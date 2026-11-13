import { Award, BookOpen, GraduationCap, Moon, Scale, Sun, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const QUICK_NAV = [
  {
    href: '#encyclopedia',
    title: 'موسوعة المواد',
    subtitle: '5 مواد وتطبيقاتها',
    icon: BookOpen,
    iconBg:
      'bg-blue-50 dark:bg-sky-500/15 text-[#2563EB] dark:text-sky-400 border-blue-100 dark:border-sky-400/25',
    hoverBorder: 'hover:border-[#2563EB]/50 dark:hover:border-sky-400/60',
  },
  {
    href: '#comparator',
    title: 'المقارنة الذكية',
    subtitle: 'تحديات وتوصية فورية',
    icon: Scale,
    iconBg:
      'bg-teal-50 dark:bg-teal-500/15 text-[#0D9488] dark:text-teal-400 border-teal-100 dark:border-teal-400/25',
    hoverBorder: 'hover:border-[#0D9488]/50 dark:hover:border-teal-400/60',
  },
  {
    href: '#quiz',
    title: 'تحدي المهندس',
    subtitle: '5 أسئلة ووسام فوري',
    icon: Award,
    iconBg:
      'bg-blue-50 dark:bg-sky-500/15 text-[#2563EB] dark:text-sky-400 border-blue-100 dark:border-sky-400/25',
    hoverBorder: 'hover:border-[#2563EB]/50 dark:hover:border-sky-400/60',
  },
];

export function HeroSection({ theme, onToggleTheme }: HeroSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section
      id="top"
      className="relative border-b border-[#E2E8F0] dark:border-slate-800 bg-engineering-grid py-12 sm:py-16 lg:py-20 transition-colors duration-200"
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
                <p className="text-xs sm:text-sm font-bold text-[#0D9488] dark:text-teal-400 tracking-wide">
                  مشروع دراسي تفاعلي · قسم الهندسة الميكانيكية
                </p>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-pressed={isDark}
                  aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
                  data-testid="theme-toggle-btn"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-[#1E293B] dark:text-slate-100 shadow-xs hover:border-[#2563EB] dark:hover:border-sky-400 hover:text-[#2563EB] dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>الوضع الفاتح</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-[#2563EB]" />
                      <span>الوضع الداكن</span>
                    </>
                  )}
                </button>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1E293B] dark:text-slate-50"
                style={{ textWrap: 'balance' }}
              >
                المختبر التفاعلي لعلوم المواد الميكانيكية
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                منصة تعليمية هادئة ومبسطة لاستكشاف الخواص الفيزيائية والميكانيكية للمواد الصناعية،
                ومقارنة أدائها الهندسي ذكياً لاختيار المادة الأنسب لكل تطبيق ميكانيكي.
              </p>
            </div>

            {/* Students & Professor Attribution Card */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] p-5 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-sky-500/15 text-[#2563EB] dark:text-sky-400 border border-blue-100 dark:border-sky-400/25">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    إعداد الطلبة — قسم الهندسة الميكانيكية
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-slate-100 leading-snug">
                    معروف عبد الجكيم · عوام بلال · بوازني منيب · بلعريبي اوسامة
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] dark:border-slate-700/70 pt-3.5 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/15 text-[#0D9488] dark:text-teal-400 border border-teal-100 dark:border-teal-400/25">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    إشراف أكاديمي
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-slate-100">
                    تحت إشراف أستاذ مادة الهندسة الميكانيكية:{' '}
                    <span className="text-[#2563EB] dark:text-sky-400">شكري رضوان</span>
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
                    className={`group flex items-center gap-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] p-3.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${item.hoverBorder} min-h-[56px]`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#1E293B] dark:text-slate-100 group-hover:text-[#2563EB] dark:group-hover:text-sky-400 whitespace-nowrap">
                        {item.title}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
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
            <div className="relative flex w-full flex-col justify-between rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] p-6 shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700/70 pb-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">مخطط مقارنة خصائص المواد المرجعي</span>
                <span dir="ltr" className="font-mono-nums font-semibold text-[#2563EB] dark:text-sky-400">
                  σ = F / A
                </span>
              </div>

              {/* Dual-theme Blueprint SVG */}
              <div className="my-5 flex-1 flex items-center justify-center">
                <svg
                  viewBox="0 0 380 260"
                  className="w-full h-auto max-h-[260px]"
                  role="img"
                  aria-label="مخطط هندسي يوضح العلاقة بين الإجهاد والانفعال للمواد الهندسية الخمس"
                >
                  <g
                    className="stroke-[#E2E8F0] dark:stroke-slate-700"
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
                    className="stroke-slate-500 dark:stroke-slate-400"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="48"
                    y1="215"
                    x2="355"
                    y2="215"
                    className="stroke-slate-500 dark:stroke-slate-400"
                    strokeWidth="1.5"
                  />

                  <polygon
                    points="48,215 115,96 115,215"
                    className="fill-[#2563EB] dark:fill-sky-400"
                    opacity="0.1"
                  />
                  <path
                    d="M 115 215 L 115 96 C 155 62, 215 44, 262 46 C 292 48, 315 74, 330 98 L 330 215 Z"
                    className="fill-[#0D9488] dark:fill-teal-400"
                    opacity="0.1"
                  />

                  <path
                    d="M 48 215 L 115 96"
                    fill="none"
                    className="stroke-[#2563EB] dark:stroke-sky-400"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 115 96 C 155 62, 215 44, 262 46 C 292 48, 315 74, 330 98"
                    fill="none"
                    className="stroke-[#0D9488] dark:stroke-teal-400"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="115"
                    cy="96"
                    r="5"
                    className="fill-[#2563EB] dark:fill-sky-400 stroke-white dark:stroke-[#1E293B]"
                    strokeWidth="2"
                  />
                  <circle
                    cx="262"
                    cy="46"
                    r="5"
                    className="fill-[#0D9488] dark:fill-teal-400 stroke-white dark:stroke-[#1E293B]"
                    strokeWidth="2"
                  />
                  <circle
                    cx="330"
                    cy="98"
                    r="5"
                    className="fill-slate-500 dark:fill-slate-300 stroke-white dark:stroke-[#1E293B]"
                    strokeWidth="2"
                  />

                  <text
                    x="58"
                    y="34"
                    className="fill-slate-600 dark:fill-slate-300"
                    fontSize="11"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="600"
                  >
                    الإجهاد (σ)
                  </text>
                  <text
                    x="292"
                    y="238"
                    className="fill-slate-600 dark:fill-slate-300"
                    fontSize="11"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="600"
                  >
                    الانفعال (ε)
                  </text>
                  <text
                    x="104"
                    y="96"
                    className="fill-[#2563EB] dark:fill-sky-400"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    حد المرونة
                  </text>
                  <text
                    x="230"
                    y="34"
                    className="fill-[#0D9488] dark:fill-teal-400"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    أقصى تحمل (UTS)
                  </text>
                  <text
                    x="316"
                    y="120"
                    className="fill-slate-600 dark:fill-slate-300"
                    fontSize="10.5"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="700"
                  >
                    الحد الأقصى
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2.5 border-t border-[#E2E8F0] dark:border-slate-700/70 pt-4 text-center">
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 border border-[#E2E8F0] dark:border-slate-800 p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-[#2563EB] dark:text-sky-400">
                    5
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    مواد قياسية
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 border border-[#E2E8F0] dark:border-slate-800 p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-[#0D9488] dark:text-teal-400">
                    3
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    تحديات جاهزة
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 border border-[#E2E8F0] dark:border-slate-800 p-2.5">
                  <div className="font-mono-nums text-lg font-bold text-[#1E293B] dark:text-slate-100">
                    5
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
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
