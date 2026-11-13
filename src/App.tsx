import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { ComparatorSection } from './components/ComparatorSection';
import { EncyclopediaSection } from './components/EncyclopediaSection';
import { GlossarySection } from './components/GlossarySection';
import { HeroSection } from './components/HeroSection';
import { Material3DSection } from './components/Material3DSection';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';
import type { MaterialId } from './data/materialsData';
import { type AccentPaletteId, isValidAccentPaletteId } from './utils/accentPalettes';
import { buildStandaloneHtml } from './utils/standaloneHtml';

export type ThemeMode = 'light' | 'dark';

export default function App() {
  const [active3DMaterial, setActive3DMaterial] = useState<MaterialId>('steel');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('materials-lab-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Ignore storage access restrictions
    }
    return 'light';
  });

  const [accentPalette, setAccentPalette] = useState<AccentPaletteId>(() => {
    try {
      const saved = window.localStorage.getItem('materials-lab-accent');
      if (isValidAccentPaletteId(saved)) return saved;
    } catch {
      // Ignore storage access restrictions
    }
    return 'blue';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('materials-lab-theme', theme);
    } catch {
      // Ignore storage access restrictions
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentPalette);
    try {
      window.localStorage.setItem('materials-lab-accent', accentPalette);
    } catch {
      // Ignore storage access restrictions
    }
  }, [accentPalette]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleInspect3D = (id: MaterialId) => {
    setActive3DMaterial(id);
    const el = document.getElementById('models-3d');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = buildStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'materials-science-lab.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-canvas text-ink transition-colors duration-200">
        <Navbar />

        <main>
          <HeroSection
            theme={theme}
            onToggleTheme={handleToggleTheme}
            accentPalette={accentPalette}
            onChangeAccent={setAccentPalette}
          />
          <EncyclopediaSection onInspect3D={handleInspect3D} />
          <Material3DSection
            activeMaterialId={active3DMaterial}
            onSelectMaterial={setActive3DMaterial}
            theme={theme}
            accentPalette={accentPalette}
          />
          <ComparatorSection />
          <QuizSection />
          <GlossarySection />
        </main>

        <footer className="border-t border-border-theme bg-surface py-8 transition-colors duration-200">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="text-center sm:text-right space-y-1">
              <div className="text-sm font-bold text-ink">
                المختبر التفاعلي لعلوم المواد الميكانيكية
              </div>
              <div className="text-xs text-ink-body">
                إعداد الطلبة: معروف عبد الجكيم · عوام بلال · بوازني منيب · بلعريبي اوسامة — قسم
                الهندسة الميكانيكية
              </div>
              <div className="text-xs font-semibold text-accent">
                تحت إشراف أستاذ مادة الهندسة الميكانيكية: شكري رضوان
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="inline-flex items-center gap-2 rounded-xl border border-border-theme bg-surface-alt px-4 py-2 text-xs font-bold text-ink shadow-xs hover:border-accent hover:text-accent transition-colors whitespace-nowrap min-h-[40px]"
            >
              <Download className="h-4 w-4" />
              <span>تنزيل نسخة HTML موحدة</span>
            </button>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
