import { useState } from 'react';
import { Layers, Lightbulb, Plane, Settings, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { MATERIAL_IMAGES } from '../data/materialImages';
import {
  MATERIAL_MAP,
  MATERIALS,
  MaterialId,
  PRESET_CHALLENGES,
  PresetChallenge,
} from '../data/materialsData';
import { compareMaterials } from '../utils/materialsLogic';

const PRESET_ICONS: Record<PresetChallenge['id'], typeof Plane> = {
  aircraft: Plane,
  electricity: Zap,
  engine: Settings,
};

export function ComparatorSection() {
  const [materialA, setMaterialA] = useState<MaterialId>('aluminum');
  const [materialB, setMaterialB] = useState<MaterialId>('carbon');
  const [activePresetId, setActivePresetId] = useState<PresetChallenge['id'] | null>('aircraft');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const handlePresetClick = (preset: PresetChallenge) => {
    setMaterialA(preset.materialA);
    setMaterialB(preset.materialB);
    setActivePresetId(preset.id);
  };

  const handleManualChange = (side: 'A' | 'B', id: MaterialId) => {
    setActivePresetId(null);
    if (side === 'A') {
      setMaterialA(id);
    } else {
      setMaterialB(id);
    }
  };

  const comparison = compareMaterials(materialA, materialB, activePresetId);
  const matA = MATERIAL_MAP[materialA];
  const matB = MATERIAL_MAP[materialB];

  return (
    <section
      id="comparator"
      className="border-b border-[#E2E8F0] dark:border-slate-800 bg-engineering-grid py-14 sm:py-18 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 space-y-2"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-slate-50">
            02. أداة المقارنة الذكية المتطورة
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            جرّب التحديات الهندسية الجاهزة أو اختر أي مادتين يدوياً لمقارنة أدائهما عبر 5 معايير
            أساسية والحصول على توصية اختيار ذكية.
          </p>
        </motion.div>

        {/* Smart Presets Row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            تحديات هندسية جاهزة (Smart Presets)
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRESET_CHALLENGES.map((preset) => {
              const Icon = PRESET_ICONS[preset.id];
              const isActive =
                activePresetId === preset.id ||
                (materialA === preset.materialA && materialB === preset.materialB);

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`flex items-center gap-3.5 rounded-2xl border p-4 text-right shadow-sm transition-all duration-150 min-h-[60px] ${
                    isActive
                      ? 'border-[#2563EB] dark:border-sky-400 bg-blue-50/70 dark:bg-sky-500/15 text-[#1E293B] dark:text-slate-50'
                      : 'border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-slate-200 hover:border-[#2563EB]/50 dark:hover:border-sky-400/60 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-[#2563EB] dark:bg-sky-500 text-white dark:text-slate-950'
                        : 'bg-blue-50 dark:bg-slate-900 text-[#2563EB] dark:text-sky-400 border border-blue-100 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{preset.label}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                      {preset.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Comparison Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.48, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 bg-white dark:bg-[#1E293B] p-6 sm:p-8 shadow-sm space-y-8 transition-colors duration-200"
        >
          {/* Manual Dropdown Selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                  {!failedImages[matA.id] ? (
                    <img
                      src={MATERIAL_IMAGES[matA.id]}
                      alt={`عينة ${matA.name}`}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(matA.id)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${matA.tensile.metallicSheen}, ${matA.tensile.baseColor})`,
                      }}
                    >
                      <Layers className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="compare-material-a"
                  className="flex flex-1 items-center justify-between text-sm font-bold text-[#2563EB] dark:text-sky-400"
                >
                  <span>المادة الأولى</span>
                  <span dir="ltr" className="font-mono-nums text-xs text-slate-500 dark:text-slate-400">
                    {matA.code}
                  </span>
                </label>
              </div>
              <select
                id="compare-material-a"
                value={materialA}
                onChange={(e) => handleManualChange('A', e.target.value as MaterialId)}
                className="w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 px-4 py-3 text-sm font-bold text-[#1E293B] dark:text-slate-100 focus:border-[#2563EB] dark:focus:border-sky-400 focus:outline-none min-h-[46px]"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.density} g/cm³)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                  {!failedImages[matB.id] ? (
                    <img
                      src={MATERIAL_IMAGES[matB.id]}
                      alt={`عينة ${matB.name}`}
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(matB.id)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${matB.tensile.metallicSheen}, ${matB.tensile.baseColor})`,
                      }}
                    >
                      <Layers className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="compare-material-b"
                  className="flex flex-1 items-center justify-between text-sm font-bold text-[#0D9488] dark:text-teal-400"
                >
                  <span>المادة الثانية</span>
                  <span dir="ltr" className="font-mono-nums text-xs text-slate-500 dark:text-slate-400">
                    {matB.code}
                  </span>
                </label>
              </div>
              <select
                id="compare-material-b"
                value={materialB}
                onChange={(e) => handleManualChange('B', e.target.value as MaterialId)}
                className="w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 px-4 py-3 text-sm font-bold text-[#1E293B] dark:text-slate-100 focus:border-[#0D9488] dark:focus:border-teal-400 focus:outline-none min-h-[46px]"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.density} g/cm³)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5 Opposing Horizontal Bars */}
          <div className="space-y-4">
            {comparison.rows.map((row) => (
              <div
                key={row.key}
                className="rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/65 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-[#1E293B] dark:text-slate-100">
                      {row.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{row.unitHint}</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {row.winner === 'tie'
                      ? 'تعادل'
                      : `الأفضل: ${row.winner === 'A' ? matA.name : matB.name}`}
                  </div>
                </div>

                {/* Material A & Material B Side-by-Side Progress Bars */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* A */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2563EB] dark:text-sky-300">{matA.name}</span>
                      <span className="font-mono-nums font-bold text-[#1E293B] dark:text-slate-100">
                        {row.valueA}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                      <div
                        className="h-full rounded-full bg-[#2563EB] dark:bg-sky-400 transition-all duration-300"
                        style={{ width: `${row.valueA}%` }}
                      />
                    </div>
                  </div>

                  {/* B */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0D9488] dark:text-teal-300">{matB.name}</span>
                      <span className="font-mono-nums font-bold text-[#1E293B] dark:text-slate-100">
                        {row.valueB}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                      <div
                        className="h-full rounded-full bg-[#0D9488] dark:bg-teal-400 transition-all duration-300"
                        style={{ width: `${row.valueB}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Engineering Recommendation Box */}
          <motion.div
            key={`${materialA}-${materialB}-${activePresetId ?? 'manual'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            data-testid="smart-recommendation"
            className="rounded-xl border border-blue-200 dark:border-sky-500/35 bg-blue-50/60 dark:bg-sky-950/30 p-5"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-sky-500/20 text-[#2563EB] dark:text-sky-300 border border-blue-200 dark:border-sky-400/30 shadow-xs">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#2563EB] dark:text-sky-400">
                  التوصية الهندسية الذكية
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] dark:text-slate-50">
                  {comparison.recommendationTitle}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {comparison.recommendationBody}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
