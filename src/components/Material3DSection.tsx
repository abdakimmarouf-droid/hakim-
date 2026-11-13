import { useState } from 'react';
import { Box, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import type { ThemeMode } from '../App';
import { MATERIALS, type MaterialId } from '../data/materialsData';
import { MATERIAL_3D_SPECS } from '../three/material3DSpecs';
import type { AccentPaletteId } from '../utils/accentPalettes';
import { Material3DViewer } from './Material3DViewer';

interface Material3DSectionProps {
  activeMaterialId: MaterialId;
  onSelectMaterial: (id: MaterialId) => void;
  theme: ThemeMode;
  accentPalette: AccentPaletteId;
}

export function Material3DSection({
  activeMaterialId,
  onSelectMaterial,
  theme,
  accentPalette,
}: Material3DSectionProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeMaterial = MATERIALS.find((m) => m.id === activeMaterialId) ?? MATERIALS[0];
  const activeSpec = MATERIAL_3D_SPECS[activeMaterialId];

  return (
    <section
      id="models-3d"
      className="border-b border-border-theme bg-surface py-14 sm:py-18 transition-colors duration-200"
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
            <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-extrabold text-heading">
              <Box className="h-6 w-6 text-accent shrink-0" />
              <span>مختبر المجسمات ثلاثية الأبعاد (3D)</span>
            </h2>
            <p className="max-w-2xl text-sm sm:text-base text-ink-body">
              استعرض نموذجاً هندسياً ثلاثي الأبعاد مخصصاً لكل مادة: أدر المجسم بحرية، قرّب
              التفاصيل، واستخدم شريط التفكيك الهندسي لفصل الأجزاء الميكانيكية ومعاينة بنيتها.
            </p>
          </div>
          <div className="text-xs font-semibold text-ink-muted">
            اسحب للتدوير · عجلة الفأرة للتقريب
          </div>
        </motion.div>

        {/* Interactive Three.js Canvas Stage */}
        <Material3DViewer
          activeMaterialId={activeMaterialId}
          onSelectMaterial={onSelectMaterial}
          theme={theme}
          accentPalette={accentPalette}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        />

        {/* Engineering Parts Breakdown below the 3D Stage (never obstructing canvas) */}
        <div className="mt-6 rounded-2xl border border-border-theme bg-surface-alt p-5 sm:p-6 transition-colors duration-200">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Layers className="h-4 w-4 text-accent-secondary" />
              <span>مكونات مجسم {activeMaterial.name}:</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-body">
              {activeSpec.architectureSummaryAr}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeSpec.parts.map((part, idx) => (
              <div
                key={part.id}
                className="rounded-xl border border-border-theme bg-surface p-3.5 transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-accent">
                  <span>الجزء {idx + 1}</span>
                  <span className="text-accent-secondary">{part.materialNoteAr}</span>
                </div>
                <div className="mt-1 text-xs sm:text-sm font-bold text-ink">
                  {part.labelAr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
