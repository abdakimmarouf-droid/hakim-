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
      className="border-b border-border-theme bg-engineering-grid py-14 sm:py-18 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 space-y-2"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading">
            02. أداة المقارنة الذكية المتطورة
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-ink-body">
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
          <div className="mb-3 text-xs font-bold text-ink-muted">
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
                      ? 'border-accent bg-accent-soft text-ink'
                      : 'border-border-theme bg-surface text-ink hover:border-accent/60 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-accent text-accent-fg'
                        : 'bg-accent-soft text-accent border border-accent-border'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{preset.label}</span>
                    <span className="block text-xs text-ink-muted truncate">
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
          className="rounded-2xl border border-border-theme bg-surface p-6 sm:p-8 shadow-sm space-y-8 transition-colors duration-200"
        >
          {/* Manual Dropdown Selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border-theme bg-surface-alt">
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
                  className="flex flex-1 items-center justify-between text-sm font-bold text-accent"
                >
                  <span>المادة الأولى</span>
                  <span dir="ltr" className="font-mono-nums text-xs text-ink-muted">
                    {matA.code}
                  </span>
                </label>
              </div>
              <select
                id="compare-material-a"
                value={materialA}
                onChange={(e) => handleManualChange('A', e.target.value as MaterialId)}
                className="w-full rounded-xl border border-border-theme bg-surface-alt px-4 py-3 text-sm font-bold text-ink focus:border-accent focus:outline-none min-h-[46px]"
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
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border-theme bg-surface-alt">
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
                  className="flex flex-1 items-center justify-between text-sm font-bold text-accent-secondary"
                >
                  <span>المادة الثانية</span>
                  <span dir="ltr" className="font-mono-nums text-xs text-ink-muted">
                    {matB.code}
                  </span>
                </label>
              </div>
              <select
                id="compare-material-b"
                value={materialB}
                onChange={(e) => handleManualChange('B', e.target.value as MaterialId)}
                className="w-full rounded-xl border border-border-theme bg-surface-alt px-4 py-3 text-sm font-bold text-ink focus:border-accent-secondary focus:outline-none min-h-[46px]"
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
                className="rounded-xl border border-border-theme bg-surface-alt p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-ink">
                      {row.label}
                    </div>
                    <div className="text-xs text-ink-muted">{row.unitHint}</div>
                  </div>
                  <div className="text-xs font-semibold text-ink-body">
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
                      <span className="font-bold text-accent">{matA.name}</span>
                      <span className="font-mono-nums font-bold text-ink">
                        {row.valueA}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface border border-border-theme">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-300"
                        style={{ width: `${row.valueA}%` }}
                      />
                    </div>
                  </div>

                  {/* B */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-accent-secondary">{matB.name}</span>
                      <span className="font-mono-nums font-bold text-ink">
                        {row.valueB}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface border border-border-theme">
                      <div
                        className="h-full rounded-full bg-accent-secondary transition-all duration-300"
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
            className="rounded-xl border border-accent-border bg-accent-soft p-5"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent border border-accent-border shadow-xs">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-accent">التوصية الهندسية الذكية</div>
                <h3 className="text-base sm:text-lg font-extrabold text-heading">
                  {comparison.recommendationTitle}
                </h3>
                <p className="text-sm leading-relaxed text-ink-body">
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
