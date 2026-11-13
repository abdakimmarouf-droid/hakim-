export type AccentPaletteId = 'blue' | 'red' | 'green' | 'purple';

export interface Site3DColorSpec {
  background: number;
  floor: number;
  platter: number;
  rim: number;
  hemiSky: number;
  rimLight: number;
  shadowOpacity: number;
}

export interface AccentPalette {
  id: AccentPaletteId;
  labelAr: string;
  swatchLight: string;
  swatchDark: string;
  canvasLight: string;
  canvasDark: string;
  surfaceLight: string;
  surfaceDark: string;
  threeLight: Site3DColorSpec;
  threeDark: Site3DColorSpec;
}

export const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: 'blue',
    labelAr: 'أزرق هندسي',
    swatchLight: '#2563EB',
    swatchDark: '#38BDF8',
    canvasLight: '#EEF4FC',
    canvasDark: '#0B1528',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#14223B',
    threeLight: {
      background: 0xe4ecf8,
      floor: 0xd5e1f2,
      platter: 0xc3d3e8,
      rim: 0x8ea4c4,
      hemiSky: 0xdbeafe,
      rimLight: 0x93c5fd,
      shadowOpacity: 0.38,
    },
    threeDark: {
      background: 0x091222,
      floor: 0x0f1c33,
      platter: 0x1b2d4d,
      rim: 0x47618a,
      hemiSky: 0xdbeafe,
      rimLight: 0x38bdf8,
      shadowOpacity: 0.56,
    },
  },
  {
    id: 'red',
    labelAr: 'أحمر دافئ مريح',
    swatchLight: '#C93B4B',
    swatchDark: '#FB7185',
    canvasLight: '#FDF2F3',
    canvasDark: '#1C0E13',
    surfaceLight: '#FFFBFB',
    surfaceDark: '#29151C',
    threeLight: {
      background: 0xf6e6e8,
      floor: 0xedd7da,
      platter: 0xe2c4c8,
      rim: 0xb88b95,
      hemiSky: 0xffe4e6,
      rimLight: 0xfda4af,
      shadowOpacity: 0.38,
    },
    threeDark: {
      background: 0x170b0f,
      floor: 0x211016,
      platter: 0x341b24,
      rim: 0x6e3b4b,
      hemiSky: 0xffe4e6,
      rimLight: 0xfb7185,
      shadowOpacity: 0.58,
    },
  },
  {
    id: 'green',
    labelAr: 'أخضر نعناعي',
    swatchLight: '#0D9488',
    swatchDark: '#2DD4BF',
    canvasLight: '#EDF7F4',
    canvasDark: '#0A1A17',
    surfaceLight: '#FAFEFC',
    surfaceDark: '#122924',
    threeLight: {
      background: 0xe1f0eb,
      floor: 0xd1e5df,
      platter: 0xbdd7cf,
      rim: 0x7ea69c,
      hemiSky: 0xccfbf1,
      rimLight: 0x5eead4,
      shadowOpacity: 0.38,
    },
    threeDark: {
      background: 0x081512,
      floor: 0x0e221d,
      platter: 0x18362f,
      rim: 0x3a6b60,
      hemiSky: 0xccfbf1,
      rimLight: 0x2dd4bf,
      shadowOpacity: 0.56,
    },
  },
  {
    id: 'purple',
    labelAr: 'بنفسجي هادئ',
    swatchLight: '#6366F1',
    swatchDark: '#A78BFA',
    canvasLight: '#F3F1FC',
    canvasDark: '#131126',
    surfaceLight: '#FCFBFF',
    surfaceDark: '#1E1B38',
    threeLight: {
      background: 0xe8e4f7,
      floor: 0xdad4f0,
      platter: 0xc8c0e6,
      rim: 0x8b84b5,
      hemiSky: 0xe0e7ff,
      rimLight: 0xa5b4fc,
      shadowOpacity: 0.38,
    },
    threeDark: {
      background: 0x0f0d1f,
      floor: 0x16132b,
      platter: 0x262147,
      rim: 0x564e8a,
      hemiSky: 0xede9fe,
      rimLight: 0xa78bfa,
      shadowOpacity: 0.56,
    },
  },
];

export function isValidAccentPaletteId(value: unknown): value is AccentPaletteId {
  return value === 'blue' || value === 'red' || value === 'green' || value === 'purple';
}

export function getSite3DColors(mode: 'light' | 'dark', accentId: AccentPaletteId): Site3DColorSpec {
  const palette = ACCENT_PALETTES.find((p) => p.id === accentId) ?? ACCENT_PALETTES[0];
  return mode === 'dark' ? palette.threeDark : palette.threeLight;
}
