import { useState } from 'react';
import { BookMarked, RotateCcw, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { GLOSSARY_TERMS, GlossaryCategoryId } from '../data/materialsData';
import { filterGlossaryTerms } from '../utils/materialsLogic';

const GLOSSARY_CATEGORIES: Array<{ id: GlossaryCategoryId | 'all'; label: string }> = [
  { id: 'all', label: 'جميع المصطلحات' },
  { id: 'mechanical', label: 'الخواص الميكانيكية' },
  { id: 'tensile', label: 'سلوك الشد والإجهاد' },
  { id: 'physical', label: 'الخواص الفيزيائية' },
];

export function GlossarySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategoryId | 'all'>('all');

  const filteredTerms = filterGlossaryTerms(GLOSSARY_TERMS, searchQuery, selectedCategory);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <section
      id="glossary"
      className="bg-engineering-grid py-14 sm:py-18 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-heading">
              04. قاموس المصطلحات الهندسية
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-ink-body">
              مرجع مبسط لأهم مصطلحات الميكانيكا وعلوم المواد مع الصيغ الفيزيائية والأمثلة التطبيقية
              لتسهيل الفهم والمراجعة السريعة للطلاب.
            </p>
          </div>
          <div className="text-xs font-semibold text-ink-muted">
            <span className="font-mono-nums text-accent font-bold">
              {filteredTerms.length}
            </span>{' '}
            من أصل <span className="font-mono-nums">{GLOSSARY_TERMS.length}</span> مصطلحاً هندسياً
          </div>
        </motion.div>

        {/* Search & Interactive Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.42, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-border-theme bg-surface p-4 sm:p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between transition-colors duration-200"
        >
          {/* Search Input */}
          <div className="relative flex-1 lg:max-w-sm">
            <label htmlFor="glossary-search" className="sr-only">
              ابحث في قاموس المصطلحات الهندسية
            </label>
            <Search
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              id="glossary-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مصطلح (مثال: الصلادة، يونغ، الإجهاد)..."
              className="w-full rounded-xl border border-border-theme bg-surface-alt py-2.5 pr-10 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="مسح البحث"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-muted hover:text-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Interactive Category Tabs */}
          <div
            role="tablist"
            aria-label="تصنيف المصطلحات الهندسية"
            className="flex flex-wrap items-center gap-1.5 rounded-xl bg-surface-alt p-1.5 border border-border-theme"
          >
            {GLOSSARY_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                    isActive
                      ? 'bg-accent text-accent-fg shadow-xs'
                      : 'text-ink-body hover:text-accent'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Glossary Terms Grid or Empty State */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTerms.map((term, idx) => (
              <motion.article
                key={term.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(idx, 5) * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col justify-between rounded-2xl border border-border-theme bg-surface p-5 shadow-sm transition-colors duration-150 hover:border-accent/50"
              >
                <div>
                  {/* Unboxed metadata header */}
                  <div className="mb-3 flex items-center justify-between gap-2 text-xs text-ink-muted">
                    <span className="font-semibold text-accent-secondary">
                      {term.categoryLabel}
                    </span>
                    <span dir="ltr" className="font-mono-nums text-ink-muted">
                      {term.termEn}
                    </span>
                  </div>

                  {/* Term Heading + Optional Formula/Unit */}
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-heading">
                      {term.termAr}
                    </h3>
                    {(term.formula || term.unit) && (
                      <span
                        dir="ltr"
                        className="font-mono-nums text-xs font-bold text-accent whitespace-nowrap shrink-0"
                      >
                        {[term.formula, term.unit].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-ink-body mb-4">
                    {term.definition}
                  </p>
                </div>

                <div className="border-t border-border-theme pt-3 text-xs leading-relaxed text-ink-muted">
                  <strong className="text-ink font-bold">
                    مثال تطبيقي:{' '}
                  </strong>
                  {term.engineeringExample}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border-theme bg-surface p-10 text-center shadow-sm space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border-theme bg-surface-alt text-accent">
              <BookMarked className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-heading">
                لم يتم العثور على مصطلح مطابق لبحثك
              </h3>
              <p className="text-sm text-ink-muted">
                جرّب البحث بكلمة أبسط مثل «الصلادة» أو «الإجهاد» أو أعد عرض جميع المصطلحات.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-accent-fg shadow-sm hover:bg-accent-hover transition-colors min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>عرض جميع المصطلحات</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
