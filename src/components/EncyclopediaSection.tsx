import { useEffect, useState } from 'react';
import { Car, Cpu, Layers, Plane, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MATERIAL_IMAGES } from '../data/materialImages';
import { MATERIALS, MaterialItem } from '../data/materialsData';

export function EncyclopediaSection() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedMaterial) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMaterial(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMaterial]);

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  return (
    <section
      id="encyclopedia"
      className="border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] py-14 sm:py-18 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-slate-50">
              01. موسوعة المواد الهندسية
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
              اضغط على أي مادة لاستعراض بطاقتها الهندسية الكاملة، أشرطة الخواص الميكانيكية، وأبرز
              تطبيقاتها في السيارات والطائرات والأجهزة.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            5 مواد معتمدة في التجارب المخبرية
          </div>
        </motion.div>

        {/* 5 Material Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALS.map((mat, idx) => {
            const hasFailed = Boolean(failedImages[mat.id]);
            return (
              <motion.button
                key={mat.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.42, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.16 } }}
                onClick={() => setSelectedMaterial(mat)}
                className="group flex flex-col justify-between rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] p-5 text-right shadow-sm transition-colors transition-shadow duration-150 hover:border-[#2563EB]/60 dark:hover:border-sky-400/70 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] dark:focus-visible:outline-sky-400"
              >
                <div>
                  {/* Material Specimen Photo */}
                  <div className="mb-4 aspect-4/3 w-full overflow-hidden rounded-xl border border-[#E2E8F0] dark:border-slate-700/70 bg-slate-100 dark:bg-slate-900">
                    {!hasFailed ? (
                      <img
                        src={MATERIAL_IMAGES[mat.id]}
                        alt={`عينة ${mat.name} (${mat.englishName})`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() => markImageFailed(mat.id)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full flex-col items-center justify-center gap-2 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${mat.tensile.metallicSheen}, ${mat.tensile.baseColor})`,
                        }}
                      >
                        <Layers className="h-8 w-8 opacity-85" />
                        <span className="text-xs font-bold">{mat.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Unboxed metadata line */}
                  <div className="mb-2.5 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">{mat.category}</span>
                    <span
                      dir="ltr"
                      className="font-mono-nums font-semibold text-[#2563EB] dark:text-sky-400"
                    >
                      {mat.code}
                    </span>
                  </div>

                  {/* Material Title & Color Swatch */}
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg border border-[#E2E8F0] dark:border-slate-600 shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${mat.tensile.metallicSheen}, ${mat.tensile.baseColor})`,
                      }}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#1E293B] dark:text-slate-50 group-hover:text-[#2563EB] dark:group-hover:text-sky-300 transition-colors">
                        {mat.name}
                      </h3>
                      <div className="font-mono-nums text-xs text-slate-500 dark:text-slate-400">
                        {mat.englishName}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-4">
                    {mat.summary}
                  </p>
                </div>

                <div className="border-t border-[#E2E8F0] dark:border-slate-700/70 pt-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span>
                      الصلادة:{' '}
                      <strong className="font-mono-nums text-[#1E293B] dark:text-slate-100">
                        {mat.properties.hardness}%
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      الكثافة:{' '}
                      <strong className="font-mono-nums text-[#1E293B] dark:text-slate-100">
                        {mat.density}
                      </strong>
                    </span>
                  </div>
                  <span className="font-bold text-[#2563EB] dark:text-sky-400 group-hover:text-[#0D9488] dark:group-hover:text-teal-300 transition-colors">
                    التفاصيل ←
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Material Detail Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 dark:bg-slate-950/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedMaterial(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-material-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#1E293B] p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-700/70 pb-4">
                <div className="flex items-center gap-3.5">
                  <span
                    className="h-12 w-12 shrink-0 rounded-xl border border-[#E2E8F0] dark:border-slate-600"
                    style={{
                      background: `linear-gradient(135deg, ${selectedMaterial.tensile.metallicSheen}, ${selectedMaterial.tensile.baseColor})`,
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedMaterial.category} ·{' '}
                      <span
                        dir="ltr"
                        className="inline-block font-mono-nums font-semibold text-[#2563EB] dark:text-sky-400"
                      >
                        {selectedMaterial.code}
                      </span>
                    </div>
                    <h3
                      id="modal-material-title"
                      className="text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-slate-50"
                    >
                      {selectedMaterial.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMaterial(null)}
                  aria-label="إغلاق نافذة المادة"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:border-[#2563EB] dark:hover:border-sky-400 hover:text-[#2563EB] dark:hover:text-sky-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Material Image */}
              <div className="mt-5 h-48 sm:h-56 w-full overflow-hidden rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                {!failedImages[selectedMaterial.id] ? (
                  <img
                    src={MATERIAL_IMAGES[selectedMaterial.id]}
                    alt={`صورة مجهرية وهندسية لعينة ${selectedMaterial.name}`}
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed(selectedMaterial.id)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-2 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${selectedMaterial.tensile.metallicSheen}, ${selectedMaterial.tensile.baseColor})`,
                    }}
                  >
                    <Layers className="h-10 w-10 opacity-85" />
                    <span className="text-sm font-bold">{selectedMaterial.name}</span>
                  </div>
                )}
              </div>

              {/* Engineering Overview */}
              <div className="mt-5 space-y-2">
                <h4 className="text-sm font-bold text-[#2563EB] dark:text-sky-400">
                  النبذة الهندسية
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedMaterial.engineeringOverview}
                </p>
              </div>

              {/* Numeric Key Specs */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/75 p-3 border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">الكثافة</div>
                  <div
                    dir="ltr"
                    className="font-mono-nums text-base sm:text-lg font-bold text-[#1E293B] dark:text-slate-100 mt-0.5 text-right"
                  >
                    {selectedMaterial.density}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      g/cm³
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/75 p-3 border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">مقاومة الشد</div>
                  <div
                    dir="ltr"
                    className="font-mono-nums text-base sm:text-lg font-bold text-[#2563EB] dark:text-sky-400 mt-0.5 text-right"
                  >
                    {selectedMaterial.tensileStrengthMPa}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      MPa
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/75 p-3 border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">معامل يونغ</div>
                  <div
                    dir="ltr"
                    className="font-mono-nums text-base sm:text-lg font-bold text-[#0D9488] dark:text-teal-400 mt-0.5 text-right"
                  >
                    {selectedMaterial.tensile.youngModulusGPa}{' '}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      GPa
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bars for 4 Requested Properties */}
              <div className="mt-6 space-y-3.5">
                <h4 className="text-sm font-bold text-[#2563EB] dark:text-sky-400">
                  الخواص الفيزيائية والميكانيكية
                </h4>
                {[
                  {
                    label: 'الصلادة',
                    value: selectedMaterial.properties.hardness,
                    color: 'bg-[#2563EB] dark:bg-sky-400',
                  },
                  {
                    label: 'المرونة',
                    value: selectedMaterial.properties.elasticity,
                    color: 'bg-[#0D9488] dark:bg-teal-400',
                  },
                  {
                    label: 'خفة الوزن',
                    value: selectedMaterial.properties.lightness,
                    color: 'bg-sky-500 dark:bg-sky-300',
                  },
                  {
                    label: 'مقاومة التآكل',
                    value: selectedMaterial.properties.corrosionResistance,
                    color: 'bg-teal-500 dark:bg-emerald-400',
                  },
                ].map((prop) => (
                  <div key={prop.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-[#1E293B] dark:text-slate-200">
                        {prop.label}
                      </span>
                      <span className="font-mono-nums font-bold text-[#1E293B] dark:text-slate-100">
                        {prop.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${prop.color}`}
                        style={{ width: `${prop.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Industrial Applications */}
              <div className="mt-6 space-y-3 border-t border-[#E2E8F0] dark:border-slate-700/70 pt-5">
                <h4 className="text-sm font-bold text-[#0D9488] dark:text-teal-400">
                  أبرز التطبيقات الصناعية
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 p-3.5 border border-[#E2E8F0] dark:border-slate-800">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#2563EB] dark:text-sky-400">
                      <Car className="h-4 w-4 shrink-0" />
                      <span>السيارات</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {selectedMaterial.applications.automotive}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 p-3.5 border border-[#E2E8F0] dark:border-slate-800">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#0D9488] dark:text-teal-400">
                      <Plane className="h-4 w-4 shrink-0" />
                      <span>الطائرات</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {selectedMaterial.applications.aerospace}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-900/70 p-3.5 border border-[#E2E8F0] dark:border-slate-800">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <Cpu className="h-4 w-4 shrink-0" />
                      <span>الأجهزة والصناعة</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {selectedMaterial.applications.devices}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
