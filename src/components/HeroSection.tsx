import {
  Award,
  BookOpen,
  GraduationCap,
  Moon,
  Palette,
  Scale,
  Sun,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ACCENT_PALETTES, type AccentPaletteId } from '../utils/accentPalettes';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  accentPalette: AccentPaletteId;
  onChangeAccent: (id: AccentPaletteId) => void;
}

const QUICK_NAV = [
  {
    href: '#encyclopedia',
    title: 'موسوعة المواد',
    subtitle: '5 مواد وتطبيقاتها',
    icon: BookOpen,
    iconBg: 'bg-accent-soft text-accent border-accent-border',
    hoverBorder: 'hover:border-accent/60',
  },
  {
    href: '#comparator',
    title: 'المقارنة الذكية',
    subtitle: 'تحديات وتوصية فورية',
    icon: Scale,
    iconBg: 'bg-accent-secondary-soft text-accent-secondary border-accent-secondary/25',
    hoverBorder: 'hover:border-accent-secondary/60',
  },
  {
    href: '#quiz',
    title: 'تحدي المهندس',
    subtitle: '5 أسئلة ووسام فوري',
    icon: Award,
    iconBg: 'bg-accent-soft text-accent border-accent-border',
    hoverBorder: 'hover:border-accent/60',
  },
];

export function HeroSection({
  theme,
  onToggleTheme,
  accentPalette,
  onChangeAccent,
}: HeroSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section
      id="top"
      className="relative border-b border-border-theme bg-engineering-grid py-12 sm:py-16 lg:py-20 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          {/* Right / Main Narrative Column in RTL */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-7 lg:col-span-7"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-bold text-accent-secondary tracking-wide">
                  مشروع دراسي تفاعلي · قسم الهندسة الميكانيكية
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Full-Site Comfortable Color Theme Selector beside Dark Mode */}
                  <div
                    role="group"
                    aria-label="تغيير لون الموقع بالكامل"
                    className="inline-flex items-center gap-2 rounded-xl border border-border-theme bg-surface px-3 py-1.5 shadow-xs min-h-[40px]"
                  >
                    <Palette className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-bold text-ink-body whitespace-nowrap">
                      لون الموقع:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ACCENT_PALETTES.map((palette) => {
                        const isSelected = accentPalette === palette.id;
                        const swatchColor = isDark ? palette.swatchDark : palette.swatchLight;
                        return (
                          <button
                            key={palette.id}
                            type="button"
                            onClick={() => onChangeAccent(palette.id)}
                            aria-label={`تغيير لون الموقع إلى: ${palette.labelAr}`}
                            aria-pressed={isSelected}
                            title={`تغيير لون الموقع: ${palette.labelAr}`}
                            data-testid={`accent-btn-${palette.id}`}
                            className={`h-5 w-5 rounded-full transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                              isSelected
                                ? 'scale-110 ring-2 ring-offset-2 ring-ink ring-offset-surface'
                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatchColor }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Dark / Light Mode Toggle */}
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    aria-pressed={isDark}
                    aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
                    data-testid="theme-toggle-btn"
                    className="inline-flex items-center gap-2 rounded-xl border border-border-theme bg-surface px-3.5 py-2 text-xs font-bold text-ink shadow-xs hover:border-accent hover:text-accent transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    {isDark ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-400" />
                        <span>الوضع الفاتح</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-accent" />
                        <span>الوضع الداكن</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-heading"
                style={{ textWrap: 'balance' }}
              >
                المختبر التفاعلي لعلوم المواد الميكانيكية
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-ink-body">
                منصة تعليمية هادئة ومبسطة لاستكشاف الخواص الفيزيائية والميكانيكية للمواد الصناعية،
                ومقارنة أدائها الهندسي ذكياً لاختيار المادة الأنسب لكل تطبيق ميكانيكي.
              </p>
            </div>

            {/* Students & Professor Attribution Card */}
            <div className="rounded-2xl border border-border-theme bg-surface p-5 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent border border-accent-border">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-ink-muted">
                    إعداد الطلبة — قسم الهندسة الميكانيكية
                  </div>
                  <div className="text-sm sm:text-base font-bold text-ink leading-snug">
                    معروف عبد الجكيم · عوام بلال · بوازني منيب · بلعريبي اوسامة
                  </div>
                </div>
              </div>

              <div className="border-t border-border-theme pt-3.5 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-secondary-soft text-accent-secondary border border-accent-secondary/25">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-ink-muted">
                    إشراف أكاديمي
                  </div>
                  <div className="text-sm sm:text-base font-bold text-ink">
                    تحت إشراف أستاذ مادة الهندسة الميكانيكية:{' '}
                    <span className="text-accent">شكري رضوان</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Grid to 3 Main Sections */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {QUICK_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl border border-border-theme bg-surface p-3.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${item.hoverBorder} min-h-[56px]`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink group-hover:text-accent whitespace-nowrap">
                        {item.title}
                      </span>
                      <span className="block text-xs text-ink-muted whitespace-nowrap">
                        {item.subtitle}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Left Visual Engineering Blueprint Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="relative flex w-full flex-col justify-between rounded-2xl border border-border-theme bg-surface p-6 shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-border-theme pb-3 text-xs text-ink-muted">
                <span className="font-semibold">مخطط مقارنة خصائص المواد المرجعي</span>
                <span dir="ltr" className="font-mono-nums font-semibold text-accent">
                  σ = F / A
                </span>
              </div>

              {/* Dual-theme Blueprint SVG synced with active full-site theme */}
              <div className="my-5 flex-1 flex items-center justify-center">
                <svg
                  viewBox="0 0 380 260"
                  className="w-full h-auto max-h-[260px]"
                  role="img"
                  aria-label="مخطط هندسي يوضح العلاقة بين الإجهاد والانفعال للمواد الهندسية الخمس"
                >
                  <g
                    className="stroke-border-theme"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  >
                    <line x1="48" y1="40" x2="350" y2="40" />
                    <line x1="48" y1="85" x2="350" y2="85" />
                    <line x1="48" y1="130" x2="350" y2="130" />
                    <line x1="48" y1="175" x2="350" y2="175" />
                    <line x1="115" y1="25" x2="115" y2="215" />
                    <line x1="190" y1="25" x2="190" y2="215" />
                    <line x1="265" y1="25" x2="265" y2="215" />
                  </g>

                  <line
                    x1="48"
                    y1="20"
                    x2="48"
                    y2="215"
                    className="stroke-ink-muted"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="48"
                    y1="215"
                    x2="355"
                    y2="215"
                    className="stroke-ink-muted"
                    strokeWidth="1.5"
                  />

                  <polygon
                    points="48,215 115,96 115,215"
                    className="fill-accent"
                    opacity="0.12"
                  />
                  <path
                    d="M 115 215 L 115 96 C 155 62, 215 44, 262 46 C 292 48, 315 74, 330 98 L 330 215 Z"
                    className="fill-accent-secondary"
                    opacity="0.12"
                  />

                  <path
                    d="M 48 215 L 115 96"
                    fill="none"
                    className="stroke-accent"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 115 96 C 155 62, 215 44, 262 46 C 292 48, 315 74, 330 98"
                    fill="none"
                    className="stroke-accent-secondary"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="115"
                    cy="96"
                    r="5"
                    className="fill-accent stroke-surface"
                    strokeWidth="2"
                  />
                  <circle
                    cx="262"
                    cy="46"
                    r="5"
                    className="fill-accent-secondary stroke-surface"
                    strokeWidth="2"
                  />
                  <circle
                    cx="330"
                    cy="98"
                    r="5"
                    className="fill-ink-muted stroke-surface"
                    strokeWidth="2"
                  />

                  <text
                    x="58"
                    y="34"
                    className="fill-ink-body"
                    fontSize="11"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="600"
                  >
                    الإجهاد (σ)
                  </text>
                  <text
                    x="292"
                    y="238"
                    className="fill-ink-body"
                    fontSize="11"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="600"
                  >
                    الانفعال (ε)
                  </text>
                  <text
                    x="104"
                    y="96"
                    className="fill-accent"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    حد المرونة
                  </text>
                  <text
                    x="230"
                    y="34"
                    className="fill-accent-secondary"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    أقصى تحمل (UTS)
                  </text>
                  <text
                    x="316"
                    y="120"
                    className="fill-ink-body"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    الحد الأقصى
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2.5 border-t border-border-theme pt-4 text-center">
                <div className="rounded-xl bg-surface-alt border border-border-theme p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-accent">5</div>
                  <div className="text-[11px] font-medium text-ink-muted">
                    مواد قياسية
                  </div>
                </div>
                <div className="rounded-xl bg-surface-alt border border-border-theme p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-accent-secondary">3</div>
                  <div className="text-[11px] font-medium text-ink-muted">
                    تحديات جاهزة
                  </div>
                </div>
                <div className="rounded-xl bg-surface-alt border border-border-theme p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-ink">
                    5
                  </div>
                  <div className="text-[11px] font-medium text-ink-muted">
                    أسئلة تقييم
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
