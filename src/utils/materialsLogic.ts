import {
  GlossaryCategoryId,
  GlossaryTerm,
  MATERIAL_MAP,
  MaterialId,
  PRESET_CHALLENGES,
  PresetChallenge,
  QuizQuestion,
} from '../data/materialsData';

export type TensilePhase = 'elastic' | 'plastic' | 'fracture';

export interface TensileSimulationResult {
  materialId: MaterialId;
  forceN: number;
  stressMPa: number;
  strainPct: number;
  phase: TensilePhase;
  phaseLabel: string;
  phaseDescription: string;
  elongationPx: number;
  neckWidthRatio: number; // 1.0 = full width, 0.45 = heavily necked
  specimenFillColor: string;
  statusGlyph: '●' | '▲' | '✖';
  progressToFracturePct: number;
}

export interface ComparisonCriterionRow {
  key: keyof typeof CRITERIA_LABELS;
  label: string;
  unitHint: string;
  valueA: number;
  valueB: number;
  winner: 'A' | 'B' | 'tie';
}

export interface ComparisonResult {
  materialAId: MaterialId;
  materialBId: MaterialId;
  rows: ComparisonCriterionRow[];
  recommendationTitle: string;
  recommendationBody: string;
  winnerId: MaterialId | 'tie';
}

export interface QuizEvaluationResult {
  score: number;
  total: number;
  percentage: number;
  medalTitle: string;
  medalSubtitle: string;
  medalTier: 'gold' | 'silver' | 'bronze';
}

export const CRITERIA_LABELS = {
  hardness: { label: 'الصلادة والتحمل', unitHint: 'مقاومة الخدش والإجهاد' },
  lightness: { label: 'خفة الوزن', unitHint: 'مؤشر عكسي للكثافة' },
  conductivity: { label: 'التوصيل الكهربائي والحراري', unitHint: 'كفاءة نقل الطاقة' },
  corrosionResistance: { label: 'مقاومة الصدأ والتآكل', unitHint: 'الاستقرار الكيميائي' },
  costEfficiency: { label: 'التكلفة الاقتصادية', unitHint: 'الجدوى الإنتاجية (الأعلى = أوفر)' },
} as const;

export function calculateTensileState(
  materialId: MaterialId,
  rawForceN: number
): TensileSimulationResult {
  const material = MATERIAL_MAP[materialId];
  const forceN = Math.max(0, Math.min(1500, rawForceN));
  const {
    areaMm2,
    yieldForceN,
    ultimateForceN,
    maxElongationPct,
    maxNeckingRatio,
    baseColor,
  } = material.tensile;

  const stressMPa = Number((forceN / areaMm2).toFixed(1));
  const progressToFracturePct = Math.min(100, Math.round((forceN / ultimateForceN) * 100));

  if (forceN >= ultimateForceN) {
    return {
      materialId,
      forceN,
      stressMPa,
      strainPct: Number(maxElongationPct.toFixed(2)),
      phase: 'fracture',
      phaseLabel: 'الانكسار (Fracture)',
      phaseDescription: `تجاوز الإجهاد حد التحمل الأقصى للمادة (${ultimateForceN} N)، مما أدى إلى انفصال العينة بالكامل.`,
      elongationPx: Math.round(maxElongationPct * 2.2),
      neckWidthRatio: Number((1 - maxNeckingRatio).toFixed(3)),
      specimenFillColor: '#ef4444',
      statusGlyph: '✖',
      progressToFracturePct: 100,
    };
  }

  if (forceN > yieldForceN) {
    const plasticSpan = Math.max(1, ultimateForceN - yieldForceN);
    const plasticRatio = (forceN - yieldForceN) / plasticSpan; // 0..1
    const elasticStrain = maxElongationPct * 0.22;
    const strainPct = Number(
      (elasticStrain + plasticRatio * (maxElongationPct - elasticStrain)).toFixed(2)
    );
    const neckDrop = plasticRatio * maxNeckingRatio;
    const neckWidthRatio = Number((1 - neckDrop).toFixed(3));
    const elongationPx = Math.round(strainPct * 2.2);

    return {
      materialId,
      forceN,
      stressMPa,
      strainPct,
      phase: 'plastic',
      phaseLabel: 'التشوه الدائم (Plastic)',
      phaseDescription:
        materialId === 'carbon'
          ? 'المادة تقترب من حد الانهيار الفجائي تحت حمل شد مرتفع جداً.'
          : 'تجاوزت المادة حد الخضوع؛ يبدأ التخصّر في المنتصف (Necking) ولا يعود الشكل الأصلي.',
      elongationPx,
      neckWidthRatio,
      specimenFillColor: '#f97316',
      statusGlyph: '▲',
      progressToFracturePct,
    };
  }

  // Elastic region
  const elasticRatio = yieldForceN > 0 ? forceN / yieldForceN : 0;
  const elasticMaxStrain = maxElongationPct * 0.22;
  const strainPct = Number((elasticRatio * elasticMaxStrain).toFixed(2));
  const neckWidthRatio = Number((1 - elasticRatio * 0.04).toFixed(3));
  const elongationPx = Math.round(strainPct * 2.2);

  return {
    materialId,
    forceN,
    stressMPa,
    strainPct,
    phase: 'elastic',
    phaseLabel: 'منطقة المرونة (Elastic)',
    phaseDescription:
      forceN === 0
        ? 'العينة في حالة سكون تام دون أي إجهاد مطبق.'
        : 'تشوه مرن مؤقت متناسب خطياً مع القوة؛ ستعود العينة لأبعادها الأصلية عند إزالة الحمل.',
    elongationPx,
    neckWidthRatio,
    specimenFillColor: forceN === 0 ? baseColor : '#38bdf8',
    statusGlyph: '●',
    progressToFracturePct,
  };
}

export function compareMaterials(
  materialAId: MaterialId,
  materialBId: MaterialId,
  activePresetId?: PresetChallenge['id'] | null
): ComparisonResult {
  const matA = MATERIAL_MAP[materialAId];
  const matB = MATERIAL_MAP[materialBId];

  const criteriaKeys = Object.keys(CRITERIA_LABELS) as Array<keyof typeof CRITERIA_LABELS>;

  const rows: ComparisonCriterionRow[] = criteriaKeys.map((key) => {
    const valueA = matA.properties[key];
    const valueB = matB.properties[key];
    const winner: 'A' | 'B' | 'tie' =
      valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';

    return {
      key,
      label: CRITERIA_LABELS[key].label,
      unitHint: CRITERIA_LABELS[key].unitHint,
      valueA,
      valueB,
      winner,
    };
  });

  if (materialAId === materialBId) {
    return {
      materialAId,
      materialBId,
      rows,
      winnerId: 'tie',
      recommendationTitle: `تم اختيار ${matA.name} في كلا الطرفين`,
      recommendationBody:
        'اختر مادتين مختلفتين أو استخدم أحد أزرار التحديات الهندسية الجاهزة للحصول على مقارنة تحليلية وتوصية اختيار دقيقة.',
    };
  }

  // Check if matches any preset challenge directly (in either order)
  const matchingPreset =
    (activePresetId && PRESET_CHALLENGES.find((p) => p.id === activePresetId)) ||
    PRESET_CHALLENGES.find(
      (p) =>
        (p.materialA === materialAId && p.materialB === materialBId) ||
        (p.materialA === materialBId && p.materialB === materialAId)
    );

  if (matchingPreset) {
    return {
      materialAId,
      materialBId,
      rows,
      winnerId: matchingPreset.winnerId,
      recommendationTitle: matchingPreset.title,
      recommendationBody: matchingPreset.reasoning,
    };
  }

  // Algorithmic smart recommendation for any arbitrary pair
  const scoreA =
    matA.properties.hardness +
    matA.properties.lightness +
    matA.properties.conductivity +
    matA.properties.corrosionResistance +
    matA.properties.costEfficiency;

  const scoreB =
    matB.properties.hardness +
    matB.properties.lightness +
    matB.properties.conductivity +
    matB.properties.corrosionResistance +
    matB.properties.costEfficiency;

  const strengthsA = rows.filter((r) => r.winner === 'A').map((r) => r.label);
  const strengthsB = rows.filter((r) => r.winner === 'B').map((r) => r.label);

  const winnerMat = scoreA >= scoreB ? matA : matB;
  const runnerMat = scoreA >= scoreB ? matB : matA;
  const winnerStrengths = scoreA >= scoreB ? strengthsA : strengthsB;
  const runnerStrengths = scoreA >= scoreB ? strengthsB : strengthsA;

  return {
    materialAId,
    materialBId,
    rows,
    winnerId: scoreA === scoreB ? 'tie' : winnerMat.id,
    recommendationTitle:
      scoreA === scoreB
        ? `توازن هندسي متقارب بين ${matA.name} و${matB.name}`
        : `الأفضلية العامة لـ ${winnerMat.name} في المعايير المجمّعة`,
    recommendationBody: `يتفوق ${winnerMat.name} في (${winnerStrengths.join('، ') || 'التوازن العام'})، بينما يمتاز ${runnerMat.name} في (${runnerStrengths.join('، ') || 'تطبيقاته التخصصية'}). يعتمد القرار النهائي على أولوية التصميم: هل الأولوية لتخفيض الكتلة (${matA.density} مقابل ${matB.density} g/cm³) أم لتحمل الشد (${matA.tensileStrengthMPa} مقابل ${matB.tensileStrengthMPa} MPa) أم للميزانية؟`,
  };
}

export function evaluateQuiz(
  selectedAnswers: Record<number, number>,
  questions: QuizQuestion[]
): QuizEvaluationResult {
  const total = questions.length;
  let score = 0;

  for (const q of questions) {
    if (selectedAnswers[q.id] === q.correctIndex) {
      score += 1;
    }
  }

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  if (percentage >= 80) {
    return {
      score,
      total,
      percentage,
      medalTitle: 'وسام مهندس المواد الخبير',
      medalSubtitle: 'أداء استثنائي وإلمام متكامل بسلوك المعادن والمركبات تحت الإجهاد.',
      medalTier: 'gold',
    };
  }

  if (percentage >= 60) {
    return {
      score,
      total,
      percentage,
      medalTitle: 'وسام المهندس الميكانيكي الواعد',
      medalSubtitle: 'نتيجة جيدة جداً! راجع تفاصيل محاكي الشد لرفع دقتك إلى 100%.',
      medalTier: 'silver',
    };
  }

  return {
    score,
    total,
    percentage,
    medalTitle: 'وسام باحث المختبر المبتدئ',
    medalSubtitle: 'بداية مشجعة! استكشف بطاقات الموسوعة وأعد المحاولة لاكتساب الوسام الذهبي.',
    medalTier: 'bronze',
  };
}

export function filterGlossaryTerms(
  terms: GlossaryTerm[],
  query: string,
  category: GlossaryCategoryId | 'all'
): GlossaryTerm[] {
  const normalizedQuery = query.trim().toLowerCase();

  return terms.filter((term) => {
    if (category !== 'all' && term.categoryId !== category) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const searchable = [
      term.termAr,
      term.termEn,
      term.definition,
      term.engineeringExample,
      term.formula ?? '',
      term.unit ?? '',
      term.categoryLabel,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}
