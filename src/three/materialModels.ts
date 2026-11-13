import * as THREE from 'three';
import type { MaterialId } from '../data/materialsData';
import type { ProceduralTextureBundle } from './proceduralTextures';

export interface MaterialAssemblyRecord {
  group: THREE.Group;
  parts: THREE.Object3D[];
}

export interface StudioTurntable {
  group: THREE.Group;
  platterMaterial: THREE.MeshStandardMaterial;
  rimMaterial: THREE.MeshStandardMaterial;
  dialMaterial: THREE.MeshStandardMaterial;
  shadowMaterial: THREE.MeshBasicMaterial;
  dispose: () => void;
}

function registerPart(
  parent: THREE.Group,
  part: THREE.Object3D,
  explodeOffset: [number, number, number]
): THREE.Object3D {
  part.userData.explodeOffset = explodeOffset;
  part.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  parent.add(part);
  return part;
}

/**
 * Normalizes a multi-part assembly so its horizontal center sits at (0, _, 0),
 * its lowest point rests cleanly at y = 0, and its largest dimension fits targetSize.
 * Also records scaled basePos / explodeOffset on every top-level part.
 */
function normalizeAssembly(group: THREE.Group, parts: THREE.Object3D[], targetSize = 1.75): void {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = targetSize / maxDim;

  const shiftX = -center.x * scale;
  const shiftY = -box.min.y * scale;
  const shiftZ = -center.z * scale;

  for (const part of parts) {
    part.position.set(
      part.position.x * scale + shiftX,
      part.position.y * scale + shiftY,
      part.position.z * scale + shiftZ
    );
    part.scale.multiplyScalar(scale);

    part.userData.basePos = [part.position.x, part.position.y, part.position.z] as [
      number,
      number,
      number,
    ];
    const rawOffset = (part.userData.explodeOffset as [number, number, number] | undefined) ?? [
      0, 0, 0,
    ];
    part.userData.explodeOffset = [
      rawOffset[0] * scale,
      rawOffset[1] * scale,
      rawOffset[2] * scale,
    ] as [number, number, number];
  }
}

function applyAirfoilSkinUVs(geometry: THREE.BufferGeometry): void {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const pos = geometry.attributes.position;
  const norm = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  if (!box || !pos || !norm || !uv) return;

  const spanX = Math.max(box.max.x - box.min.x, 0.001);
  const spanY = Math.max(box.max.y - box.min.y, 0.001);
  const spanZ = Math.max(box.max.z - box.min.z, 0.001);
  for (let i = 0; i < pos.count; i++) {
    const nz = Math.abs(norm.getZ(i));
    if (nz > 0.7) {
      // Top / bottom cap faces
      const u = (pos.getX(i) - box.min.x) / spanX;
      const v = (pos.getY(i) - box.min.y) / spanY;
      uv.setXY(i, u, v);
    } else {
      // Extruded airfoil side skin (x/y contour + z height)
      const u = (pos.getX(i) - box.min.x) / spanX + ((pos.getY(i) - box.min.y) / spanY) * 0.6;
      const v = (pos.getZ(i) - box.min.z) / spanZ;
      uv.setXY(i, u, v);
    }
  }
  uv.needsUpdate = true;
}

// ============================================================================
// 1. STEEL: 12-Tooth Spur Gear & Stepped Drive Shaft
// ============================================================================
function buildSteelAssembly(textures: ProceduralTextureBundle): MaterialAssemblyRecord {
  const group = new THREE.Group();
  group.name = 'steel-assembly';
  const parts: THREE.Object3D[] = [];

  const steelPolishedMat = new THREE.MeshStandardMaterial({
    color: 0xd4dce6,
    metalness: 0.92,
    roughness: 0.22,
    bumpMap: textures.brushedBump,
    bumpScale: 0.008,
  });

  const shaftMat = new THREE.MeshStandardMaterial({
    color: 0xe6edf5,
    metalness: 0.95,
    roughness: 0.16,
  });

  const bronzeSleeveMat = new THREE.MeshStandardMaterial({
    color: 0xc58b43,
    metalness: 0.88,
    roughness: 0.35,
  });

  const oxideHubMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.62,
    roughness: 0.64,
  });

  const boltMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.26,
  });

  // Spur gear profile (12 teeth)
  const toothCount = 12;
  const rRoot = 0.72;
  const rOuter = 0.94;
  const gearShape = new THREE.Shape();
  for (let i = 0; i < toothCount; i++) {
    const step = (Math.PI * 2) / toothCount;
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.34;
    const a3 = a0 + step * 0.66;
    const a4 = a0 + step * 0.78;
    if (i === 0) {
      gearShape.moveTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot);
    } else {
      gearShape.lineTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot);
    }
    gearShape.lineTo(Math.cos(a1) * rRoot, Math.sin(a1) * rRoot);
    gearShape.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
    gearShape.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
    gearShape.lineTo(Math.cos(a4) * rRoot, Math.sin(a4) * rRoot);
  }
  gearShape.closePath();

  const boreHole = new THREE.Path();
  boreHole.absarc(0, 0, 0.24, 0, Math.PI * 2, true);
  gearShape.holes.push(boreHole);

  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2 + Math.PI / 4;
    const lightenHole = new THREE.Path();
    lightenHole.absarc(Math.cos(ang) * 0.48, Math.sin(ang) * 0.48, 0.1, 0, Math.PI * 2, true);
    gearShape.holes.push(lightenHole);
  }

  const gearGeo = new THREE.ExtrudeGeometry(gearShape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 3,
    curveSegments: 24,
  });
  gearGeo.center();
  const gearMesh = new THREE.Mesh(gearGeo, steelPolishedMat);
  gearMesh.rotation.x = Math.PI / 2;
  gearMesh.position.y = 0.56;
  parts.push(registerPart(group, gearMesh, [0, 0, 0]));

  // Stepped Drive Shaft (LatheGeometry)
  const shaftPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.28, 0.0),
    new THREE.Vector2(0.3, 0.04),
    new THREE.Vector2(0.3, 0.28),
    new THREE.Vector2(0.23, 0.32),
    new THREE.Vector2(0.23, 0.96),
    new THREE.Vector2(0.16, 1.0),
    new THREE.Vector2(0.16, 1.28),
    new THREE.Vector2(0.13, 1.32),
    new THREE.Vector2(0.0, 1.32),
  ];
  const shaftGeo = new THREE.LatheGeometry(shaftPoints, 36);
  const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
  shaftMesh.position.y = 0.02;
  parts.push(registerPart(group, shaftMesh, [0, 0.65, 0]));

  // Bronze bearing collar (hollow lathe)
  const sleevePoints = [
    new THREE.Vector2(0.235, 0.0),
    new THREE.Vector2(0.35, 0.0),
    new THREE.Vector2(0.35, 0.2),
    new THREE.Vector2(0.235, 0.2),
    new THREE.Vector2(0.235, 0.0),
  ];
  const sleeveGeo = new THREE.LatheGeometry(sleevePoints, 32);
  const sleeveMesh = new THREE.Mesh(sleeveGeo, bronzeSleeveMat);
  sleeveMesh.position.y = 0.19;
  parts.push(registerPart(group, sleeveMesh, [0, -0.15, 0]));

  // Dark oxide clamping flange + 4 bolts
  const hubGroup = new THREE.Group();
  const hubRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.14, 32), oxideHubMat);
  hubGroup.add(hubRing);
  const boltGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.07, 6);
  for (let b = 0; b < 4; b++) {
    const angle = (b * Math.PI) / 2;
    const bolt = new THREE.Mesh(boltGeo, boltMat);
    bolt.position.set(Math.cos(angle) * 0.33, 0.09, Math.sin(angle) * 0.33);
    hubGroup.add(bolt);
  }
  hubGroup.position.y = 0.78;
  parts.push(registerPart(group, hubGroup, [0, 0.34, 0]));

  // Top snap retaining ring
  const snapRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.028, 12, 32), oxideHubMat);
  snapRing.rotation.x = Math.PI / 2;
  snapRing.position.y = 0.96;
  parts.push(registerPart(group, snapRing, [0, 0.54, 0]));

  normalizeAssembly(group, parts);
  return { group, parts };
}

// ============================================================================
// 2. ALUMINUM: 6061-T6 T-Slot Profile & CNC Gusset Bracket
// ============================================================================
function buildAluminumAssembly(textures: ProceduralTextureBundle): MaterialAssemblyRecord {
  const group = new THREE.Group();
  group.name = 'aluminum-assembly';
  const parts: THREE.Object3D[] = [];

  const alumExtrudedMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.88,
    roughness: 0.24,
    bumpMap: textures.brushedBump,
    bumpScale: 0.006,
  });

  const gussetBeadMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.72,
    roughness: 0.54,
  });

  const boltDarkMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.84,
    roughness: 0.42,
  });

  const anodizedPinMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.86,
    roughness: 0.22,
  });

  // T-slot square profile (outer 0.74 x 0.74 with 4 recessed T-grooves)
  const h = 0.37;
  const c = 0.04;
  const gHalf = 0.09;
  const gNeck = 0.1;
  const gWide = 0.16;
  const gDepth = 0.15;

  const tShape = new THREE.Shape();
  tShape.moveTo(-h + c, -h);
  // Bottom edge groove
  tShape.lineTo(-gHalf, -h);
  tShape.lineTo(-gHalf, -h + gNeck);
  tShape.lineTo(-gWide, -h + gNeck);
  tShape.lineTo(-gWide, -h + gDepth);
  tShape.lineTo(gWide, -h + gDepth);
  tShape.lineTo(gWide, -h + gNeck);
  tShape.lineTo(gHalf, -h + gNeck);
  tShape.lineTo(gHalf, -h);
  tShape.lineTo(h - c, -h);
  tShape.lineTo(h, -h + c);
  // Right edge groove
  tShape.lineTo(h, -gHalf);
  tShape.lineTo(h - gNeck, -gHalf);
  tShape.lineTo(h - gNeck, -gWide);
  tShape.lineTo(h - gDepth, -gWide);
  tShape.lineTo(h - gDepth, gWide);
  tShape.lineTo(h - gNeck, gWide);
  tShape.lineTo(h - gNeck, gHalf);
  tShape.lineTo(h, gHalf);
  tShape.lineTo(h, h - c);
  tShape.lineTo(h - c, h);
  // Top edge groove
  tShape.lineTo(gHalf, h);
  tShape.lineTo(gHalf, h - gNeck);
  tShape.lineTo(gWide, h - gNeck);
  tShape.lineTo(gWide, h - gDepth);
  tShape.lineTo(-gWide, h - gDepth);
  tShape.lineTo(-gWide, h - gNeck);
  tShape.lineTo(-gHalf, h - gNeck);
  tShape.lineTo(-gHalf, h);
  tShape.lineTo(-h + c, h);
  tShape.lineTo(-h, h - c);
  // Left edge groove
  tShape.lineTo(-h, gHalf);
  tShape.lineTo(-h + gNeck, gHalf);
  tShape.lineTo(-h + gNeck, gWide);
  tShape.lineTo(-h + gDepth, gWide);
  tShape.lineTo(-h + gDepth, -gWide);
  tShape.lineTo(-h + gNeck, -gWide);
  tShape.lineTo(-h + gNeck, -gHalf);
  tShape.lineTo(-h, -gHalf);
  tShape.lineTo(-h, -h + c);
  tShape.closePath();

  const centerBore = new THREE.Path();
  centerBore.absarc(0, 0, 0.11, 0, Math.PI * 2, true);
  tShape.holes.push(centerBore);

  const beamGeo = new THREE.ExtrudeGeometry(tShape, {
    depth: 1.45,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 2,
  });
  const beamMesh = new THREE.Mesh(beamGeo, alumExtrudedMat);
  beamMesh.rotation.x = -Math.PI / 2;
  beamMesh.position.set(-0.22, 0.0, 0);
  parts.push(registerPart(group, beamMesh, [-0.25, 0.18, 0]));

  // CNC Gusset L-bracket
  const gussetGroup = new THREE.Group();
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.1, 0.64), gussetBeadMat);
  basePlate.position.set(0.32, 0.05, 0);
  gussetGroup.add(basePlate);

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.7, 0);
  finShape.lineTo(0.7, 0.12);
  finShape.lineTo(0.14, 0.68);
  finShape.lineTo(0, 0.68);
  finShape.closePath();

  const finHole = new THREE.Path();
  finHole.absarc(0.24, 0.24, 0.09, 0, Math.PI * 2, true);
  finShape.holes.push(finHole);

  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  const finFront = new THREE.Mesh(finGeo, gussetBeadMat);
  finFront.position.set(0.12, 0.08, 0.22);
  const finBack = new THREE.Mesh(finGeo, gussetBeadMat);
  finBack.position.set(0.12, 0.08, -0.3);
  gussetGroup.add(finFront, finBack);
  parts.push(registerPart(group, gussetGroup, [0.38, 0.05, 0]));

  // 4 Hex Socket Cap Bolts
  const boltsGroup = new THREE.Group();
  const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.08, 6);
  const boltCoords: Array<[number, number, number]> = [
    [0.42, 0.13, 0.16],
    [0.42, 0.13, -0.16],
    [0.64, 0.13, 0.16],
    [0.64, 0.13, -0.16],
  ];
  for (const [bx, by, bz] of boltCoords) {
    const bolt = new THREE.Mesh(capGeo, boltDarkMat);
    bolt.position.set(bx, by, bz);
    boltsGroup.add(bolt);
  }
  parts.push(registerPart(group, boltsGroup, [0.38, 0.45, 0]));

  // Anodized Blue Alignment Pin in top bore
  const pinGroup = new THREE.Group();
  const pinShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.42, 24), anodizedPinMat);
  const pinHead = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.09, 24), anodizedPinMat);
  pinHead.position.y = 0.22;
  pinGroup.add(pinShaft, pinHead);
  pinGroup.position.set(-0.22, 1.48, 0);
  parts.push(registerPart(group, pinGroup, [-0.25, 0.56, 0]));

  normalizeAssembly(group, parts);
  return { group, parts };
}

// ============================================================================
// 3. COPPER: Toroidal Magnetic Coil & Busbar Assembly
// ============================================================================
class ToroidalHelixCurve extends THREE.Curve<THREE.Vector3> {
  private readonly majorR: number;
  private readonly minorR: number;
  private readonly turns: number;

  constructor(majorR: number, minorR: number, turns: number) {
    super();
    this.majorR = majorR;
    this.minorR = minorR;
    this.turns = turns;
  }

  override getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const phi = t * Math.PI * 2;
    const theta = t * Math.PI * 2 * this.turns;
    const r = this.majorR + this.minorR * Math.cos(theta);
    const x = r * Math.cos(phi);
    const z = r * Math.sin(phi);
    const y = this.minorR * Math.sin(theta);
    return optionalTarget.set(x, y, z);
  }
}

function buildCopperAssembly(textures: ProceduralTextureBundle): MaterialAssemblyRecord {
  const group = new THREE.Group();
  group.name = 'copper-assembly';
  const parts: THREE.Object3D[] = [];

  const copperBrightMat = new THREE.MeshStandardMaterial({
    color: 0xe07a48,
    metalness: 0.95,
    roughness: 0.18,
  });

  const copperBusbarMat = new THREE.MeshStandardMaterial({
    color: 0xc96338,
    metalness: 0.94,
    roughness: 0.24,
    bumpMap: textures.brushedBump,
    bumpScale: 0.005,
  });

  const ferriteCoreMat = new THREE.MeshStandardMaterial({
    color: 0x222730,
    metalness: 0.12,
    roughness: 0.78,
  });

  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.0,
    roughness: 0.58,
  });

  // Heavy Electrolytic Copper Busbar Base
  const busbarShape = new THREE.Shape();
  busbarShape.moveTo(-0.78, -0.34);
  busbarShape.lineTo(0.78, -0.34);
  busbarShape.lineTo(0.84, -0.28);
  busbarShape.lineTo(0.84, 0.28);
  busbarShape.lineTo(0.78, 0.34);
  busbarShape.lineTo(-0.78, 0.34);
  busbarShape.lineTo(-0.84, 0.28);
  busbarShape.lineTo(-0.84, -0.28);
  busbarShape.closePath();

  const lugHoleL = new THREE.Path();
  lugHoleL.absarc(-0.64, 0, 0.08, 0, Math.PI * 2, true);
  const lugHoleR = new THREE.Path();
  lugHoleR.absarc(0.64, 0, 0.08, 0, Math.PI * 2, true);
  busbarShape.holes.push(lugHoleL, lugHoleR);

  const busbarGeo = new THREE.ExtrudeGeometry(busbarShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  busbarGeo.center();
  const busbarMesh = new THREE.Mesh(busbarGeo, copperBusbarMat);
  busbarMesh.rotation.x = Math.PI / 2;
  busbarMesh.position.y = 0.08;
  parts.push(registerPart(group, busbarMesh, [0, -0.1, 0]));

  // Ceramic ribbed standoffs (2x)
  const ceramicGroup = new THREE.Group();
  const cerPts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.11, 0),
    new THREE.Vector2(0.11, 0.08),
    new THREE.Vector2(0.08, 0.1),
    new THREE.Vector2(0.11, 0.13),
    new THREE.Vector2(0.11, 0.2),
    new THREE.Vector2(0.08, 0.22),
    new THREE.Vector2(0.1, 0.28),
    new THREE.Vector2(0, 0.28),
  ];
  const cerGeo = new THREE.LatheGeometry(cerPts, 24);
  const cLeft = new THREE.Mesh(cerGeo, ceramicMat);
  cLeft.position.set(-0.46, 0.16, 0);
  const cRight = new THREE.Mesh(cerGeo, ceramicMat);
  cRight.position.set(0.46, 0.16, 0);
  ceramicGroup.add(cLeft, cRight);
  parts.push(registerPart(group, ceramicGroup, [0, 0.12, 0]));

  // Ferrite Magnetic Toroid Core
  const toroidGeo = new THREE.TorusGeometry(0.5, 0.18, 28, 56);
  const toroidMesh = new THREE.Mesh(toroidGeo, ferriteCoreMat);
  toroidMesh.position.y = 0.88;
  parts.push(registerPart(group, toroidMesh, [0, 0.32, 0.35]));

  // Helical Copper Windings wrapping the Toroid
  const helixCurve = new ToroidalHelixCurve(0.5, 0.215, 20);
  const windingGeo = new THREE.TubeGeometry(helixCurve, 360, 0.032, 10, true);
  const windingMesh = new THREE.Mesh(windingGeo, copperBrightMat);
  windingMesh.rotation.x = Math.PI / 2;
  windingMesh.position.y = 0.88;
  parts.push(registerPart(group, windingMesh, [0, 0.54, -0.25]));

  normalizeAssembly(group, parts);
  return { group, parts };
}

// ============================================================================
// 4. ABS POLYMER: Injection-Molded Pump Housing & Radial Impeller
// ============================================================================
function buildAbsAssembly(textures: ProceduralTextureBundle): MaterialAssemblyRecord {
  const group = new THREE.Group();
  group.name = 'abs-assembly';
  const parts: THREE.Object3D[] = [];

  const absShellMat = new THREE.MeshPhysicalMaterial({
    color: 0x2563eb,
    metalness: 0.04,
    roughness: 0.44,
    clearcoat: 0.28,
    clearcoatRoughness: 0.3,
    bumpMap: textures.stippleBump,
    bumpScale: 0.004,
  });

  const absImpellerMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.02,
    roughness: 0.3,
  });

  const elastomerMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.0,
    roughness: 0.88,
  });

  const brassInsertMat = new THREE.MeshStandardMaterial({
    color: 0xd4a348,
    metalness: 0.88,
    roughness: 0.26,
  });

  // Molded Flanged Housing Shell (LatheGeometry hollow bowl)
  const shellPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.84, 0.0),
    new THREE.Vector2(0.84, 0.14),
    new THREE.Vector2(0.68, 0.18),
    new THREE.Vector2(0.68, 0.62),
    new THREE.Vector2(0.78, 0.66),
    new THREE.Vector2(0.78, 0.78),
    new THREE.Vector2(0.6, 0.78),
    new THREE.Vector2(0.6, 0.22),
    new THREE.Vector2(0.18, 0.22),
    new THREE.Vector2(0.18, 0.16),
    new THREE.Vector2(0.0, 0.16),
  ];
  const shellGeo = new THREE.LatheGeometry(shellPts, 44);
  const shellMesh = new THREE.Mesh(shellGeo, absShellMat);
  parts.push(registerPart(group, shellMesh, [0, 0, 0]));

  // 4 Brass Heat-Set Inserts on top flange
  const insertsGroup = new THREE.Group();
  const insertGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.09, 16);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    const ins = new THREE.Mesh(insertGeo, brassInsertMat);
    ins.position.set(Math.cos(a) * 0.69, 0.76, Math.sin(a) * 0.69);
    insertsGroup.add(ins);
  }
  parts.push(registerPart(group, insertsGroup, [0, 0.24, 0]));

  // Elastomer O-Ring Gasket
  const oRing = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.032, 14, 48), elastomerMat);
  oRing.rotation.x = Math.PI / 2;
  oRing.position.y = 0.81;
  parts.push(registerPart(group, oRing, [0, 0.42, 0]));

  // Radial 6-Blade Polymer Impeller
  const impGroup = new THREE.Group();
  const impHub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.4, 28), absImpellerMat);
  impHub.position.y = 0.2;
  impGroup.add(impHub);

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.14, 0.0);
  bladeShape.quadraticCurveTo(0.36, 0.08, 0.52, 0.22);
  bladeShape.lineTo(0.49, 0.26);
  bladeShape.quadraticCurveTo(0.32, 0.13, 0.13, 0.05);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 2,
  });

  for (let k = 0; k < 6; k++) {
    const blade = new THREE.Mesh(bladeGeo, absImpellerMat);
    blade.rotation.order = 'YXZ';
    blade.rotation.y = (k * Math.PI) / 3;
    blade.rotation.x = -Math.PI / 2;
    blade.position.y = 0.06;
    impGroup.add(blade);
  }
  const impDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.05, 36), absImpellerMat);
  impDisc.position.y = 0.04;
  impGroup.add(impDisc);

  impGroup.position.y = 0.36;
  parts.push(registerPart(group, impGroup, [0, 0.72, 0]));

  normalizeAssembly(group, parts);
  return { group, parts };
}

// ============================================================================
// 5. CARBON FIBER: Woven 3K CFRP Airfoil, Honeycomb Core & Composite Spar
// ============================================================================
function buildCarbonAssembly(textures: ProceduralTextureBundle): MaterialAssemblyRecord {
  const group = new THREE.Group();
  group.name = 'carbon-assembly';
  const parts: THREE.Object3D[] = [];

  const carbonWeaveMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: textures.carbonAlbedo,
    bumpMap: textures.carbonBump,
    bumpScale: 0.015,
    metalness: 0.14,
    roughness: 0.24,
    clearcoat: 0.92,
    clearcoatRoughness: 0.1,
  });

  const rawSparMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    metalness: 0.08,
    roughness: 0.68,
    bumpMap: textures.carbonBump,
    bumpScale: 0.006,
  });

  const honeycombMat = new THREE.MeshStandardMaterial({
    color: 0xd4a348,
    metalness: 0.05,
    roughness: 0.56,
  });

  const titaniumClevisMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.28,
  });

  // Titanium Root Clevis Mount
  const clevisGroup = new THREE.Group();
  const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.1, 0.56), titaniumClevisMat);
  baseFoot.position.y = 0.05;
  const lugL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.1), titaniumClevisMat);
  lugL.position.set(0, 0.24, 0.15);
  const lugR = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.1), titaniumClevisMat);
  lugR.position.set(0, 0.24, -0.15);
  const crossPin = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.44, 24), titaniumClevisMat);
  crossPin.rotation.x = Math.PI / 2;
  crossPin.position.set(0, 0.31, 0);
  clevisGroup.add(baseFoot, lugL, lugR, crossPin);
  parts.push(registerPart(group, clevisGroup, [0, -0.05, 0]));

  // Raw Composite Cylindrical Spar Tube (rises slightly above winglet cutaway)
  const sparPts = [
    new THREE.Vector2(0.055, 0.0),
    new THREE.Vector2(0.1, 0.0),
    new THREE.Vector2(0.088, 1.38),
    new THREE.Vector2(0.048, 1.38),
    new THREE.Vector2(0.048, 0.0),
  ];
  const sparGeo = new THREE.LatheGeometry(sparPts, 28);
  const sparMesh = new THREE.Mesh(sparGeo, rawSparMat);
  sparMesh.position.set(-0.18, 0.22, 0);
  parts.push(registerPart(group, sparMesh, [-0.34, 0.18, 0]));

  // Aramid Honeycomb Core Cluster emerging cleanly above airfoil cutaway
  const honeycombGroup = new THREE.Group();
  const hexCellGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.42, 6);
  const cellOffsets: Array<[number, number]> = [
    [-0.04, 0.0],
    [0.065, 0.045],
    [0.065, -0.045],
    [0.17, 0.0],
  ];
  for (const [cx, cz] of cellOffsets) {
    const cell = new THREE.Mesh(hexCellGeo, honeycombMat);
    cell.position.set(cx, 1.34, cz);
    honeycombGroup.add(cell);
  }
  parts.push(registerPart(group, honeycombGroup, [0.3, 0.16, 0]));

  // Aerodynamic Woven 3K Carbon Airfoil Winglet
  const foilShape = new THREE.Shape();
  foilShape.moveTo(-0.56, 0.0);
  foilShape.bezierCurveTo(-0.56, 0.22, -0.18, 0.24, 0.56, 0.02);
  foilShape.lineTo(0.56, -0.02);
  foilShape.bezierCurveTo(-0.18, -0.16, -0.56, -0.18, -0.56, 0.0);
  foilShape.closePath();

  const foilGeo = new THREE.ExtrudeGeometry(foilShape, {
    depth: 0.96,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.018,
    bevelSegments: 3,
    curveSegments: 36,
  });
  applyAirfoilSkinUVs(foilGeo);
  const foilMesh = new THREE.Mesh(foilGeo, carbonWeaveMat);
  foilMesh.rotation.x = -Math.PI / 2;
  foilMesh.position.set(0.02, 0.38, 0);
  parts.push(registerPart(group, foilMesh, [0, 0.24, 0.16]));

  normalizeAssembly(group, parts);
  return { group, parts };
}

export function buildAllMaterialAssemblies(
  textures: ProceduralTextureBundle
): Record<MaterialId, MaterialAssemblyRecord> {
  return {
    steel: buildSteelAssembly(textures),
    aluminum: buildAluminumAssembly(textures),
    copper: buildCopperAssembly(textures),
    abs: buildAbsAssembly(textures),
    carbon: buildCarbonAssembly(textures),
  };
}

export function disposeMaterialAssemblies(
  assemblies: Record<MaterialId, MaterialAssemblyRecord>
): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  Object.values(assemblies).forEach((record) => {
    record.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        geometries.add(obj.geometry);
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => materials.add(m));
        } else if (obj.material) {
          materials.add(obj.material);
        }
      }
    });
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}

export function buildStudioTurntable(textures: ProceduralTextureBundle): StudioTurntable {
  const group = new THREE.Group();
  group.name = 'studio-turntable';

  const platterMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.72,
    roughness: 0.34,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.88,
    roughness: 0.24,
  });

  const dialMaterial = new THREE.MeshStandardMaterial({
    map: textures.turntableDial,
    metalness: 0.05,
    roughness: 0.55,
  });

  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: textures.contactShadow,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });

  const platterGeo = new THREE.CylinderGeometry(1.56, 1.64, 0.08, 64);
  const platterMesh = new THREE.Mesh(platterGeo, platterMaterial);
  platterMesh.position.y = -0.04;
  platterMesh.receiveShadow = true;
  group.add(platterMesh);

  const dialGeo = new THREE.CircleGeometry(1.52, 64);
  const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
  dialMesh.rotation.x = -Math.PI / 2;
  dialMesh.position.y = 0.002;
  dialMesh.receiveShadow = true;
  group.add(dialMesh);

  const rimGeo = new THREE.TorusGeometry(1.55, 0.024, 16, 64);
  const rimMesh = new THREE.Mesh(rimGeo, rimMaterial);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.002;
  group.add(rimMesh);

  const shadowGeo = new THREE.CircleGeometry(1.38, 48);
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.006;
  group.add(shadowMesh);

  return {
    group,
    platterMaterial,
    rimMaterial,
    dialMaterial,
    shadowMaterial,
    dispose: () => {
      platterGeo.dispose();
      dialGeo.dispose();
      rimGeo.dispose();
      shadowGeo.dispose();
      platterMaterial.dispose();
      rimMaterial.dispose();
      dialMaterial.dispose();
      shadowMaterial.dispose();
    },
  };
}
