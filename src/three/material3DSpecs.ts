import type { MaterialId } from '../data/materialsData';

export interface Material3DPartSpec {
  id: string;
  labelAr: string;
  materialNoteAr: string;
}

export interface Material3DSpec {
  materialId: MaterialId;
  modelTitleAr: string;
  modelSubtitleAr: string;
  architectureSummaryAr: string;
  parts: Material3DPartSpec[];
}

export const MATERIAL_3D_SPECS: Record<MaterialId, Material3DSpec> = {
  steel: {
    materialId: 'steel',
    modelTitleAr: 'ترس صناعي مسنن ومحور كرنك',
    modelSubtitleAr: 'Spur Gear & Stepped Drive Shaft',
    architectureSummaryAr:
      'مجسم ميكانيكي متعدد الأجزاء يوضح صلادة الصلب الكربوني في نقل العزم العالي ومقاومة التآكل الميكانيكي.',
    parts: [
      { id: 'gear-body', labelAr: 'قرص الترس المسنن (12 سناً)', materialNoteAr: 'صلب كربوني مصقول' },
      { id: 'drive-shaft', labelAr: 'المحور المدرج المركزي', materialNoteAr: 'فولاذ مقسى لامع' },
      { id: 'bearing-collar', labelAr: 'جلبة المحمل البرونزية', materialNoteAr: 'سبيكة برونز منخفضة الاحتكاك' },
      { id: 'hub-flange', labelAr: 'طوق التثبيت والأكسيد الداكن', materialNoteAr: 'صلب مؤكسد غير لامع' },
      { id: 'snap-ring', labelAr: 'حلقة الإحكام العلوية', materialNoteAr: 'صلب زنبركي مرن' },
    ],
  },
  aluminum: {
    materialId: 'aluminum',
    modelTitleAr: 'مقطع إنشائي T-Slot وزاوية تثبيت CNC',
    modelSubtitleAr: 'Extruded 6061-T6 Profile & Gusset Bracket',
    architectureSummaryAr:
      'نموذج إنشائي خفيف الوزن يبرز قابلية الألومنيوم للبثق الدقيق وتشكيل الهياكل المعيارية.',
    parts: [
      { id: 'extrusion-beam', labelAr: 'العمود المبثوق ذو القنوات', materialNoteAr: 'ألومنيوم مؤنود مصقول' },
      { id: 'gusset-bracket', labelAr: 'الزاوية الداعمة المفرّزة CNC', materialNoteAr: 'ألومنيوم مسفوع بالرمل' },
      { id: 'hex-bolts', labelAr: 'مسامير التثبيت السداسية', materialNoteAr: 'صلب داكن مقاوم للقص' },
      { id: 'alignment-pin', labelAr: 'خابور المعايرة الهندسي', materialNoteAr: 'ألومنيوم مؤنود أزرق' },
    ],
  },
  copper: {
    materialId: 'copper',
    modelTitleAr: 'ملف حلقي كهرومغناطيسي وقضيب توصيل',
    modelSubtitleAr: 'Toroidal Copper Coil & Busbar Assembly',
    architectureSummaryAr:
      'تجميع كهربائي حراري يظهر مطيلية النحاس العالية في اللف الحلقي وكفاءة التوصيل عبر القضبان النحاسية.',
    parts: [
      { id: 'copper-busbar', labelAr: 'قضيب التوصيل الرئيسي (Busbar)', materialNoteAr: 'نحاس إلكتروليتي نقي' },
      { id: 'ferrite-core', labelAr: 'القلب المغناطيسي الحلقي', materialNoteAr: 'فيريت غير لامع عالي النفاذية' },
      { id: 'copper-windings', labelAr: 'لفائف السلك النحاسي الحلزونية', materialNoteAr: 'سلك نحاسي مسحوب' },
      { id: 'ceramic-standoffs', labelAr: 'عوازل التثبيت الخزفية', materialNoteAr: 'سيراميك عازل مطفأ' },
    ],
  },
  abs: {
    materialId: 'abs',
    modelTitleAr: 'غلاف مضخة محقون ومروحة بوليمرية',
    modelSubtitleAr: 'Injection-Molded Housing & Polymer Impeller',
    architectureSummaryAr:
      'تصميم بوليمري خفيف الوزن يبرز دقة القولبة بالحقن، العزل الكهربائي، ومقاومة الصدمات لـ ABS.',
    parts: [
      { id: 'molded-shell', labelAr: 'الهيكل الأسطواني المحقون', materialNoteAr: 'بوليمر ABS شبه لامع' },
      { id: 'polymer-impeller', labelAr: 'الدفاعة الشعاعية متعددة الشفرات', materialNoteAr: 'ABS أبيض مقوى' },
      { id: 'elastomer-seal', labelAr: 'حلقة الإحكام المطاطية', materialNoteAr: 'إيلاستومر مرن مطفأ' },
      { id: 'brass-inserts', labelAr: 'جلب الربط النحاسية الحرارية', materialNoteAr: 'نحاس أصفر مخرّش' },
    ],
  },
  carbon: {
    materialId: 'carbon',
    modelTitleAr: 'جناح ديناميكي منسوج وأنبوب مركب',
    modelSubtitleAr: 'Woven CFRP Airfoil & Composite Spar',
    architectureSummaryAr:
      'بنية مركبة متقدمة تجمع بين نسيج ألياف الكربون المطلي بالراتنج، القلب الخلوي الخفيف، ووصلات التيتانيوم.',
    parts: [
      { id: 'carbon-airfoil', labelAr: 'الجنيح الانسيابي المنسوج 3K', materialNoteAr: 'ألياف كربون بطلاء إيبوكسي لامع' },
      { id: 'honeycomb-core', labelAr: 'القلب السداسي الداخلي الخفيف', materialNoteAr: 'أراميد ذهبي خفيف' },
      { id: 'composite-spar', labelAr: 'الأنبوب الإنشائي المجوف', materialNoteAr: 'كربون مركب مطفأ' },
      { id: 'titanium-clevis', labelAr: 'مفصل الجذر والمسمار', materialNoteAr: 'تيتانيوم مصقول' },
    ],
  },
};

export function computeExplodedOffset(
  baseCoord: readonly [number, number, number],
  explodeDelta: readonly [number, number, number],
  explodeRatio: number
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, explodeRatio));
  return [
    baseCoord[0] + explodeDelta[0] * clamped,
    baseCoord[1] + explodeDelta[1] * clamped,
    baseCoord[2] + explodeDelta[2] * clamped,
  ];
}

export function dampScalar(current: number, target: number, lambda: number, dt: number): number {
  if (dt <= 0) return current;
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
