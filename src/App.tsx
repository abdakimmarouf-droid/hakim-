import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { ComparatorSection } from './components/ComparatorSection';
import { EncyclopediaSection } from './components/EncyclopediaSection';
import { GlossarySection } from './components/GlossarySection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';
import { buildStandaloneHtml } from './utils/standaloneHtml';

export type ThemeMode = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('materials-lab-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Ignore storage access restrictions
    }
    return 'light';
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

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-slate-100 transition-colors duration-200">
        <Navbar />

        <main>
          <HeroSection theme={theme} onToggleTheme={handleToggleTheme} />
          <EncyclopediaSection />
          <ComparatorSection />
          <QuizSection />
          <GlossarySection />
        </main>

        <footer className="border-t border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#0B1220] py-8 transition-colors duration-200">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="text-center sm:text-right space-y-1">
              <div className="text-sm font-bold text-[#1E293B] dark:text-slate-100">
                المختبر التفاعلي لعلوم المواد الميكانيكية
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                إعداد الطلبة: معروف عبد الجكيم · عوام بلال · بوازني منيب · بلعريبي اوسامة — قسم
                الهندسة الميكانيكية
              </div>
              <div className="text-xs font-semibold text-[#2563EB] dark:text-sky-400">
                تحت إشراف أستاذ مادة الهندسة الميكانيكية: شكري رضوان
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/80 px-4 py-2 text-xs font-bold text-[#1E293B] dark:text-slate-200 shadow-xs hover:border-[#2563EB] dark:hover:border-sky-400 hover:text-[#2563EB] dark:hover:text-sky-300 transition-colors whitespace-nowrap min-h-[40px]"
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
