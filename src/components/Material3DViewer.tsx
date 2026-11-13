import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { ThemeMode } from '../App';
import { MATERIAL_IMAGES } from '../data/materialImages';
import { MATERIALS, type MaterialId } from '../data/materialsData';
import { computeExplodedOffset, dampScalar, MATERIAL_3D_SPECS } from '../three/material3DSpecs';
import {
  buildAllMaterialAssemblies,
  buildStudioTurntable,
  disposeMaterialAssemblies,
  type MaterialAssemblyRecord,
  type StudioTurntable,
} from '../three/materialModels';
import { createProceduralTextures } from '../three/proceduralTextures';
import { type AccentPaletteId, getSite3DColors } from '../utils/accentPalettes';

interface Material3DViewerProps {
  activeMaterialId: MaterialId;
  onSelectMaterial: (id: MaterialId) => void;
  theme: ThemeMode;
  accentPalette: AccentPaletteId;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const DEFAULT_CAM_POS = new THREE.Vector3(2.95, 2.25, 3.45);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 0.36, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl =
      (probe.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (probe.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
    const isSoft = /SwiftShader|llvmpipe|Software Rasterizer|Mesa OffScreen/i.test(rendererStr);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return isSoft;
  } catch {
    return true;
  }
}

export function Material3DViewer({
  activeMaterialId,
  onSelectMaterial,
  theme,
  accentPalette,
  isFullscreen,
  onToggleFullscreen,
}: Material3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [explodePct, setExplodePct] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  // Refs bridging React state into the single mounted WebGL scene
  const activeIdRef = useRef<MaterialId>(activeMaterialId);
  const targetExplodeRef = useRef<number>(explodePct / 100);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const themeRef = useRef<ThemeMode>(theme);
  const accentRef = useRef<AccentPaletteId>(accentPalette);

  const requestRenderRef = useRef<() => void>(() => {});
  const resetCameraRef = useRef<() => void>(() => {});
  const resizeSceneRef = useRef<() => void>(() => {});
  const syncThemeRef = useRef<(t: ThemeMode, a: AccentPaletteId) => void>(() => {});
  const syncMaterialVisibilityRef = useRef<(id: MaterialId) => void>(() => {});

  const activeMaterial = MATERIALS.find((m) => m.id === activeMaterialId) ?? MATERIALS[0];
  const activeSpec = MATERIAL_3D_SPECS[activeMaterialId];

  // Keyboard shortcuts: Esc exits fullscreen, H toggles dock
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT')) return;
      if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H') {
        setControlsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen, onToggleFullscreen]);

  // Mount WebGL studio once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    if (isSoftwareGl) {
      setAutoRotate(false);
      autoRotateRef.current = false;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    if (!isSoftwareGl) {
      renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute(
      'aria-label',
      'معاينة تفاعلية ثلاثية الأبعاد للمجسمات الهندسية'
    );
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    const initialColors = getSite3DColors(themeRef.current, accentRef.current);
    scene.background = new THREE.Color(initialColors.background);
    scene.fog = new THREE.FogExp2(initialColors.background, 0.038);

    // PMREM Studio Reflection Environment (active on both hardware and software WebGL)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.85;
    roomEnv.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.copy(DEFAULT_CAM_POS);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(DEFAULT_CAM_TARGET);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.85;
    controls.maxDistance = 6.2;
    controls.minPolarAngle = 0.22;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
    controls.autoRotateSpeed = 0.9;
    controls.update();

    // Lighting Rig: Warm key + fill hemisphere + themed back rim
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(3.6, 5.4, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(initialColors.hemiSky, 0x334155, 0.9);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(initialColors.rimLight, 1.05);
    rimLight.position.set(-3.4, 2.8, -3.6);
    scene.add(rimLight);

    // Subtle studio floor receiving shadows
    const floorGeo = new THREE.CircleGeometry(18, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: initialColors.floor,
      roughness: 0.92,
      metalness: 0.04,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.082;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Procedural Textures + Turntable + All 5 Material Assemblies
    const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());
    const turntable: StudioTurntable = buildStudioTurntable(textures);
    scene.add(turntable.group);

    const assemblies: Record<MaterialId, MaterialAssemblyRecord> =
      buildAllMaterialAssemblies(textures);
    (Object.keys(assemblies) as MaterialId[]).forEach((id) => {
      assemblies[id].group.visible = id === activeIdRef.current;
      scene.add(assemblies[id].group);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Theme & site-color updater without tearing down WebGL context
    syncThemeRef.current = (mode: ThemeMode, accent: AccentPaletteId) => {
      const colors = getSite3DColors(mode, accent);
      scene.background = new THREE.Color(colors.background);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(colors.background);
      }
      hemiLight.color.setHex(colors.hemiSky);
      rimLight.color.setHex(colors.rimLight);
      floorMat.color.setHex(colors.floor);
      turntable.platterMaterial.color.setHex(colors.platter);
      turntable.rimMaterial.color.setHex(colors.rim);
      turntable.shadowMaterial.opacity = colors.shadowOpacity;
      requestRenderRef.current();
    };
    syncThemeRef.current(themeRef.current, accentRef.current);

    syncMaterialVisibilityRef.current = (id: MaterialId) => {
      (Object.keys(assemblies) as MaterialId[]).forEach((key) => {
        assemblies[key].group.visible = key === id;
      });
      requestRenderRef.current();
    };

    // Camera reset animation state (canceled immediately if user grabs OrbitControls)
    let resettingCamera = false;
    resetCameraRef.current = () => {
      resettingCamera = true;
      requestRenderRef.current();
    };

    const handleControlStart = () => {
      resettingCamera = false;
    };
    const handleControlChange = () => {
      requestRenderRef.current();
    };
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);

    // Resize handling
    const handleResize = () => {
      const w = Math.max(container.clientWidth, 300);
      const h = Math.max(container.clientHeight, 300);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      requestRenderRef.current();
    };
    resizeSceneRef.current = handleResize;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Coalesced render & pacing loop
    let currentExplode = targetExplodeRef.current;
    let rafId = 0;
    let paceTimeoutId = 0;
    let renderScheduled = false;
    let disposed = false;
    let lastTime = performance.now();

    const afterDraw = (done: () => void) => {
      if (!isSoftwareGl) {
        done();
        return;
      }
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        paceTimeoutId = window.setTimeout(done, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        paceTimeoutId = window.setTimeout(done, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.clientWaitSync(sync, 0, 0);
        if (status === gl.TIMEOUT_EXPIRED) {
          paceTimeoutId = window.setTimeout(poll, 16);
          return;
        }
        gl.deleteSync(sync);
        paceTimeoutId = window.setTimeout(done, 80);
      };
      poll();
    };

    const applyExplode = (ratio: number) => {
      const activeRecord = assemblies[activeIdRef.current];
      for (const part of activeRecord.parts) {
        const basePos = (part.userData.basePos as [number, number, number] | undefined) ?? [
          0, 0, 0,
        ];
        const explodeDelta = (part.userData.explodeOffset as
          | [number, number, number]
          | undefined) ?? [0, 0, 0];
        const [nx, ny, nz] = computeExplodedOffset(basePos, explodeDelta, ratio);
        part.position.set(nx, ny, nz);
      }
    };

    const stepFrame = () => {
      renderScheduled = false;
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      let keepAnimating = false;

      // 1. Explode damping
      if (Math.abs(currentExplode - targetExplodeRef.current) > 0.001) {
        currentExplode = dampScalar(currentExplode, targetExplodeRef.current, 10, dt);
        if (Math.abs(currentExplode - targetExplodeRef.current) <= 0.001) {
          currentExplode = targetExplodeRef.current;
        } else {
          keepAnimating = true;
        }
      }
      applyExplode(currentExplode);

      // 2. Smooth camera reset
      if (resettingCamera) {
        const alpha = 1 - Math.exp(-8 * dt);
        camera.position.lerp(DEFAULT_CAM_POS, alpha);
        controls.target.lerp(DEFAULT_CAM_TARGET, alpha);
        if (
          camera.position.distanceTo(DEFAULT_CAM_POS) < 0.015 &&
          controls.target.distanceTo(DEFAULT_CAM_TARGET) < 0.015
        ) {
          camera.position.copy(DEFAULT_CAM_POS);
          controls.target.copy(DEFAULT_CAM_TARGET);
          resettingCamera = false;
        } else {
          keepAnimating = true;
        }
      }

      // 3. Auto-rotate & OrbitControls update
      controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
      const controlsMoved = controls.update();
      if (controls.autoRotate || controlsMoved) {
        keepAnimating = true;
      }

      renderer.render(scene, camera);

      afterDraw(() => {
        if (disposed) return;
        if (keepAnimating) {
          requestRenderRef.current();
        }
      });
    };

    requestRenderRef.current = () => {
      if (disposed || renderScheduled) return;
      renderScheduled = true;
      rafId = window.requestAnimationFrame(stepFrame);
    };

    requestRenderRef.current();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(paceTimeoutId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      disposeMaterialAssemblies(assemblies);
      turntable.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      textures.dispose();
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  // Sync material selection
  useEffect(() => {
    activeIdRef.current = activeMaterialId;
    syncMaterialVisibilityRef.current(activeMaterialId);
  }, [activeMaterialId]);

  // Sync explode slider
  useEffect(() => {
    targetExplodeRef.current = explodePct / 100;
    requestRenderRef.current();
  }, [explodePct]);

  // Sync auto-rotate
  useEffect(() => {
    autoRotateRef.current = autoRotate;
    requestRenderRef.current();
  }, [autoRotate]);

  // Sync theme & full-site color palette
  useEffect(() => {
    themeRef.current = theme;
    accentRef.current = accentPalette;
    syncThemeRef.current(theme, accentPalette);
  }, [theme, accentPalette]);

  // Trigger resize after fullscreen transition
  useEffect(() => {
    const id = window.requestAnimationFrame(() => resizeSceneRef.current());
    return () => window.cancelAnimationFrame(id);
  }, [isFullscreen]);

  const wrapperClass = isFullscreen
    ? 'fixed inset-0 z-50 h-screen w-screen bg-surface-alt'
    : 'relative h-[500px] sm:h-[580px] w-full overflow-hidden rounded-2xl border border-border-theme bg-surface-alt shadow-sm transition-colors duration-200';

  return (
    <div className={wrapperClass}>
      {/* WebGL Canvas Mount or Fallback */}
      {!webglError ? (
        <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
          <img
            src={MATERIAL_IMAGES[activeMaterialId]}
            alt={`عينة ${activeMaterial.name}`}
            className="h-52 w-80 rounded-xl border border-border-theme object-cover shadow-sm"
          />
          <div className="space-y-1">
            <div className="text-base font-bold text-ink">
              {activeSpec.modelTitleAr}
            </div>
            <p className="text-xs text-ink-muted">
              تعذر تشغيل WebGL في هذا المتصفح، يتم عرض المعاينة الثابتة للمادة.
            </p>
          </div>
        </div>
      )}

      {/* Top HUD Row: Specimen Readout + Fullscreen Toggle (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-10 flex items-start justify-between gap-2.5">
        <div className="min-w-0 max-w-[240px] sm:max-w-[320px] rounded-xl border border-border-theme bg-surface/95 px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm transition-colors duration-200">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-accent">
            <span>{activeMaterial.name}</span>
            <span aria-hidden="true">·</span>
            <span dir="ltr" className="font-mono-nums">
              {activeMaterial.code}
            </span>
          </div>
          <h4 className="mt-0.5 text-xs sm:text-base font-extrabold text-heading leading-snug">
            {activeSpec.modelTitleAr}
          </h4>
          <div
            dir="ltr"
            className="mt-0.5 hidden sm:block font-mono-nums text-[11px] text-ink-muted text-right truncate"
          >
            {activeSpec.modelSubtitleAr}
          </div>
          <div
            dir="ltr"
            className="mt-1.5 flex items-center justify-end gap-2.5 border-t border-border-theme pt-1.5 font-mono-nums text-[10px] sm:text-[11px] text-ink-body"
          >
            <span>ρ {activeMaterial.density} g/cm³</span>
            <span>σ {activeMaterial.tensileStrengthMPa} MPa</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'إغلاق وضع ملء الشاشة' : 'عرض المجسم بملء الشاشة'}
          className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border-theme bg-surface/95 px-2.5 sm:px-3 py-2 text-xs font-bold text-ink shadow-sm hover:border-accent hover:text-accent transition-colors min-h-[38px]"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span>تصغير</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">ملء الشاشة</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Bottom Control Dock (single unified toolbar) */}
      <div className="absolute bottom-3.5 left-1/2 z-10 w-[min(900px,94%)] -translate-x-1/2 rounded-2xl border border-border-theme bg-surface/95 shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between gap-3 px-3.5 py-2">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <Layers className="h-4 w-4 text-accent" />
            <span>لوحة التحكم بالمجسم</span>
          </div>

          <button
            type="button"
            onClick={() => setControlsCollapsed((prev) => !prev)}
            aria-expanded={!controlsCollapsed}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-ink-body hover:bg-surface-alt transition-colors"
          >
            <span>{controlsCollapsed ? 'إظهار الأدوات' : 'طي اللوحة'}</span>
            {controlsCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {!controlsCollapsed && (
          <div className="space-y-2.5 border-t border-border-theme px-3.5 py-2.5">
            {/* Material Switcher Row */}
            <div
              role="group"
              aria-label="اختيار مجسم المادة"
              className="flex flex-wrap items-center gap-1.5"
            >
              {MATERIALS.map((mat) => {
                const isSelected = mat.id === activeMaterialId;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => onSelectMaterial(mat.id)}
                    aria-pressed={isSelected}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors min-h-[36px] ${
                      isSelected
                        ? 'bg-accent text-accent-fg shadow-xs'
                        : 'bg-surface-alt text-ink border border-border-theme hover:border-accent/60'
                    }`}
                  >
                    {mat.name}
                  </button>
                );
              })}
            </div>

            {/* Exploded View Slider + Quick Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <label
                  htmlFor="explode-view-slider"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink whitespace-nowrap"
                >
                  <Eye className="h-3.5 w-3.5 text-accent-secondary" />
                  <span>التفكيك الهندسي:</span>
                </label>
                <input
                  id="explode-view-slider"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  className="h-2 w-full accent-accent cursor-pointer"
                />
                <span
                  dir="ltr"
                  className="w-10 text-left font-mono-nums text-xs font-bold text-accent"
                >
                  {explodePct}%
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  aria-pressed={autoRotate}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-theme bg-surface-alt px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent transition-colors min-h-[36px]"
                >
                  {autoRotate ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-accent-secondary" />
                      <span>إيقاف الدوران</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-accent" />
                      <span>تدوير تلقائي</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExplodePct(0);
                    resetCameraRef.current();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-theme bg-surface-alt px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent transition-colors min-h-[36px]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>إعادة ضبط المنظور</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
