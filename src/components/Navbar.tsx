import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#encyclopedia', label: 'الموسوعة' },
  { href: '#models-3d', label: 'مجسمات 3D' },
  { href: '#quiz', label: 'تحدي المهندس' },
  { href: '#glossary', label: 'قاموس المصطلحات' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-theme bg-surface-header backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          className="text-lg font-extrabold tracking-tight text-heading whitespace-nowrap shrink-0 hover:text-accent transition-colors"
        >
          مختبر علوم المواد
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="التنقل الرئيسي" className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink-body hover:text-accent hover:underline underline-offset-8 decoration-accent/70 transition-colors whitespace-nowrap shrink-0 py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action (+ mobile menu button on narrow screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#comparator"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-bold text-accent-fg shadow-sm hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            المقارنة الذكية
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-border-theme bg-surface p-2 text-ink shadow-sm hover:border-accent/60 hover:text-accent min-h-[44px] min-w-[44px]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="القائمة الجانبية للجوال"
          className="md:hidden border-t border-border-theme bg-surface px-4 py-3 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-ink hover:bg-surface-alt hover:text-accent transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
