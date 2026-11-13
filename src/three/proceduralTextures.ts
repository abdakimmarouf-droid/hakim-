import * as THREE from 'three';

export interface ProceduralTextureBundle {
  brushedBump: THREE.CanvasTexture;
  carbonAlbedo: THREE.CanvasTexture;
  carbonBump: THREE.CanvasTexture;
  stippleBump: THREE.CanvasTexture;
  turntableDial: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureBundle {
  const anisotropy = Math.max(1, Math.min(8, maxAnisotropy));

  // 1. Directional brushed-metal bump/roughness map (linear data map)
  const brushedCanvas = document.createElement('canvas');
  brushedCanvas.width = 256;
  brushedCanvas.height = 256;
  const bCtx = brushedCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) {
    const v = 108 + ((Math.sin(y * 1.7) + Math.cos(y * 0.43)) * 0.5 + 0.5) * 44;
    bCtx.fillStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
    bCtx.fillRect(0, y, 256, 1 + (y % 3 === 0 ? 1 : 0));
  }
  const brushedBump = new THREE.CanvasTexture(brushedCanvas);
  brushedBump.wrapS = THREE.RepeatWrapping;
  brushedBump.wrapT = THREE.RepeatWrapping;
  brushedBump.repeat.set(3, 3);
  brushedBump.anisotropy = anisotropy;

  // 2. 3K 2x2 Diagonal Twill Carbon Fiber Weave albedo (sRGB) + bump (linear)
  const carbonColorCanvas = document.createElement('canvas');
  carbonColorCanvas.width = 256;
  carbonColorCanvas.height = 256;
  const ccCtx = carbonColorCanvas.getContext('2d')!;

  const carbonBumpCanvas = document.createElement('canvas');
  carbonBumpCanvas.width = 256;
  carbonBumpCanvas.height = 256;
  const cbCtx = carbonBumpCanvas.getContext('2d')!;

  const cell = 16;
  for (let y = 0; y < 256; y += cell) {
    for (let x = 0; x < 256; x += cell) {
      const ix = x / cell;
      const iy = y / cell;
      const isWarp = (ix + iy) % 4 < 2;

      const cGrad = isWarp
        ? ccCtx.createLinearGradient(x, y, x + cell, y)
        : ccCtx.createLinearGradient(x, y, x, y + cell);
      cGrad.addColorStop(0, isWarp ? '#12161f' : '#262f3f');
      cGrad.addColorStop(0.5, isWarp ? '#445066' : '#313b4f');
      cGrad.addColorStop(1, isWarp ? '#12161f' : '#1b2230');
      ccCtx.fillStyle = cGrad;
      ccCtx.fillRect(x, y, cell, cell);

      const bGrad = isWarp
        ? cbCtx.createLinearGradient(x, y, x + cell, y)
        : cbCtx.createLinearGradient(x, y, x, y + cell);
      bGrad.addColorStop(0, '#444444');
      bGrad.addColorStop(0.5, '#f0f0f0');
      bGrad.addColorStop(1, '#444444');
      cbCtx.fillStyle = bGrad;
      cbCtx.fillRect(x, y, cell, cell);
    }
  }
  const carbonAlbedo = new THREE.CanvasTexture(carbonColorCanvas);
  carbonAlbedo.colorSpace = THREE.SRGBColorSpace;
  carbonAlbedo.wrapS = THREE.RepeatWrapping;
  carbonAlbedo.wrapT = THREE.RepeatWrapping;
  carbonAlbedo.repeat.set(4, 4);
  carbonAlbedo.anisotropy = anisotropy;

  const carbonBump = new THREE.CanvasTexture(carbonBumpCanvas);
  carbonBump.wrapS = THREE.RepeatWrapping;
  carbonBump.wrapT = THREE.RepeatWrapping;
  carbonBump.repeat.set(4, 4);
  carbonBump.anisotropy = anisotropy;

  // 3. Injection-molded polymer micro-stipple bump texture (linear)
  const stippleCanvas = document.createElement('canvas');
  stippleCanvas.width = 128;
  stippleCanvas.height = 128;
  const sCtx = stippleCanvas.getContext('2d')!;
  const imgData = sCtx.createImageData(128, 128);
  let seed = 42;
  for (let i = 0; i < imgData.data.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const val = 110 + (seed % 36);
    imgData.data[i] = val;
    imgData.data[i + 1] = val;
    imgData.data[i + 2] = val;
    imgData.data[i + 3] = 255;
  }
  sCtx.putImageData(imgData, 0, 0);
  const stippleBump = new THREE.CanvasTexture(stippleCanvas);
  stippleBump.wrapS = THREE.RepeatWrapping;
  stippleBump.wrapT = THREE.RepeatWrapping;
  stippleBump.repeat.set(4, 4);

  // 4. Laboratory turntable calibration dial (sRGB)
  const dialCanvas = document.createElement('canvas');
  dialCanvas.width = 512;
  dialCanvas.height = 512;
  const dCtx = dialCanvas.getContext('2d')!;
  dCtx.fillStyle = '#e2e8f0';
  dCtx.fillRect(0, 0, 512, 512);

  const radial = dCtx.createRadialGradient(256, 256, 20, 256, 256, 256);
  radial.addColorStop(0, '#f8fafc');
  radial.addColorStop(0.7, '#e2e8f0');
  radial.addColorStop(1, '#cbd5e1');
  dCtx.fillStyle = radial;
  dCtx.fillRect(0, 0, 512, 512);

  dCtx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
  dCtx.lineWidth = 2;
  for (const r of [90, 155, 220]) {
    dCtx.beginPath();
    dCtx.arc(256, 256, r, 0, Math.PI * 2);
    dCtx.stroke();
  }

  for (let deg = 0; deg < 360; deg += 5) {
    const rad = (deg * Math.PI) / 180;
    const major = deg % 30 === 0;
    const r0 = major ? 204 : 212;
    const r1 = 224;
    dCtx.strokeStyle = major ? 'rgba(30, 41, 59, 0.5)' : 'rgba(100, 116, 139, 0.35)';
    dCtx.lineWidth = major ? 2.5 : 1.2;
    dCtx.beginPath();
    dCtx.moveTo(256 + Math.cos(rad) * r0, 256 + Math.sin(rad) * r0);
    dCtx.lineTo(256 + Math.cos(rad) * r1, 256 + Math.sin(rad) * r1);
    dCtx.stroke();
  }
  const turntableDial = new THREE.CanvasTexture(dialCanvas);
  turntableDial.colorSpace = THREE.SRGBColorSpace;
  turntableDial.anisotropy = anisotropy;

  // 5. Soft radial contact shadow texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shCtx = shadowCanvas.getContext('2d')!;
  const shGrad = shCtx.createRadialGradient(128, 128, 12, 128, 128, 124);
  shGrad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
  shGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.22)');
  shGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  shCtx.fillStyle = shGrad;
  shCtx.fillRect(0, 0, 256, 256);
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);

  return {
    brushedBump,
    carbonAlbedo,
    carbonBump,
    stippleBump,
    turntableDial,
    contactShadow,
    dispose: () => {
      brushedBump.dispose();
      carbonAlbedo.dispose();
      carbonBump.dispose();
      stippleBump.dispose();
      turntableDial.dispose();
      contactShadow.dispose();
    },
  };
}
