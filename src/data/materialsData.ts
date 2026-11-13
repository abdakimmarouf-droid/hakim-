export type MaterialId = 'steel' | 'aluminum' | 'copper' | 'abs' | 'carbon';

export interface MaterialProperties {
  hardness: number; // الصلادة (0-100)
  elasticity: number; // المرونة / القابلية للاستطالة (0-100)
  lightness: number; // خفة الوزن (0-100)
  corrosionResistance: number; // مقاومة التآكل والصدأ (0-100)
  conductivity: number; // التوصيل الكهربائي والحراري (0-100)
  costEfficiency: number; // التكلفة الاقتصادية (0-100، الأعلى = أوفر اقتصادياً)
}

export interface MaterialApplications {
  automotive: string;
  aerospace: string;
  devices: string;
}

export interface MaterialTensileConfig {
  areaMm2: number; // مقطع العينة القياسية بالمليمتر المربع
  yieldForceN: number; // قوة الخضوع (بداية التشوه الدائم)
  ultimateForceN: number; // أقصى قوة شد قبل الانكسار
  maxElongationPct: number; // الاستطالة القصوى عند الانكسار %
  maxNeckingRatio: number; // نسبة التخصّر القصوى في المنتصف (0 - 0.55)
  youngModulusGPa: number; // معامل يونغ للمرونة
  baseColor: string;
  metallicSheen: string;
}

export interface MaterialItem {
  id: MaterialId;
  name: string;
  englishName: string;
  code: string;
  category: string;
  density: number; // g/cm3
  tensileStrengthMPa: number;
  summary: string;
  engineeringOverview: string;
  properties: MaterialProperties;
  applications: MaterialApplications;
  tensile: MaterialTensileConfig;
}

export interface PresetChallenge {
  id: 'aircraft' | 'electricity' | 'engine';
  label: string;
  subtitle: string;
  materialA: MaterialId;
  materialB: MaterialId;
  winnerId: MaterialId;
  title: string;
  reasoning: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GlossaryCategoryId = 'mechanical' | 'tensile' | 'physical';

export interface GlossaryTerm {
  id: string;
  termAr: string;
  termEn: string;
  formula?: string;
  unit?: string;
  categoryId: GlossaryCategoryId;
  categoryLabel: string;
  definition: string;
  engineeringExample: string;
}

export const MATERIALS: MaterialItem[] = [
  {
    id: 'steel',
    name: 'الحديد الصلب',
    englishName: 'Carbon Steel',
    code: 'Fe-C · 1045',
    category: 'سبائك حديدية',
    density: 7.85,
    tensileStrengthMPa: 620,
    summary: 'عمود الصناعات الثقيلة بصلادة عالية وقدرة فائقة على تحمل الأحمال والصدمات الميكانيكية.',
    engineeringOverview:
      'يُعد الصلب الكربوني سبيكة من الحديد والكربون بنسبة مدروسة تمنحه توازناً مثالياً بين المتانة والصلادة وقابلية التشغيل. يتميز بمعامل مرونة مرتفع جداً (200 GPa) وقدرة واضحة على التشوه اللدن قبل الانكسار، مما يمنح المهندسين إنذاراً بصرياً قبل الانهيار الإنشائي.',
    properties: {
      hardness: 90,
      elasticity: 68,
      lightness: 24,
      corrosionResistance: 38,
      conductivity: 32,
      costEfficiency: 88,
    },
    applications: {
      automotive: 'تصنيع أعمدة الكرنك، التروس، أنظمة التعليق، وهياكل الحماية ضد الصدمات.',
      aerospace: 'معدات الهبوط عالية الإجهاد (Landing Gear) ومثبتات المحركات النفاثة.',
      devices: 'قواعد المكابس الهيدروليكية، أدوات القطع الميكانيكية، والمحامل الصناعية.',
    },
    tensile: {
      areaMm2: 2.1,
      yieldForceN: 880,
      ultimateForceN: 1300,
      maxElongationPct: 22,
      maxNeckingRatio: 0.42,
      youngModulusGPa: 200,
      baseColor: '#94a3b8',
      metallicSheen: '#cbd5e1',
    },
  },
  {
    id: 'aluminum',
    name: 'الألومنيوم',
    englishName: 'Aluminum 6061',
    code: 'Al · 6061-T6',
    category: 'معادن خفيفة',
    density: 2.7,
    tensileStrengthMPa: 310,
    summary: 'معدن خفيف الوزن يجمع بين مقاومة التآكل الجيدة وسهولة التشكيل والنقل الحراري.',
    engineeringOverview:
      'تمثل سبيكة الألومنيوم 6061-T6 الخيار القياسي في تطبيقات خفض الوزن دون التضحية بالاستقرار البنيوي. تبلغ كثافته ثلث كثافة الصلب تقريباً، ويكوّن طبقة أكسيد طبيعية تحميه من الصدأ، كما يتميز بتوصيل حراري وكهربائي ممتاز مقارنة بوزنه.',
    properties: {
      hardness: 58,
      elasticity: 74,
      lightness: 82,
      corrosionResistance: 84,
      conductivity: 76,
      costEfficiency: 74,
    },
    applications: {
      automotive: 'كتل المحركات الحديثة، المبردات (Radiators)، وألواح الهياكل خفيفة الوزن.',
      aerospace: 'الألواح الخارجية لجسم الطائرة، الأضلاع الداعمة للأجنحة، وخزانات الوقود.',
      devices: 'هياكل الحواسيب المحمولة، المشتتات الحرارية للمعالجات، وكابلات الجهد العالي.',
    },
    tensile: {
      areaMm2: 2.2,
      yieldForceN: 480,
      ultimateForceN: 685,
      maxElongationPct: 17,
      maxNeckingRatio: 0.36,
      youngModulusGPa: 69,
      baseColor: '#cbd5e1',
      metallicSheen: '#f1f5f9',
    },
  },
  {
    id: 'copper',
    name: 'النحاس',
    englishName: 'Electrolytic Copper',
    code: 'Cu · C11000',
    category: 'معادن موصلة',
    density: 8.96,
    tensileStrengthMPa: 245,
    summary: 'المرجع الهندسي الأول للتوصيل الكهربائي والحراري مع مطيلية فائقة وسهولة في السحب.',
    engineeringOverview:
      'يمتلك النحاس النقي ثاني أعلى موصلية كهربائية وحرارية بين المعادن بعد الفضة، لكنه أكثر اقتصادية وموثوقية في التشغيل. يتمتع بمطيلية عالية تسمح بسحبه إلى أسلاك دقيقة دون انكسار، ويقاوم التآكل الجوي بكفاءة عالية.',
    properties: {
      hardness: 44,
      elasticity: 84,
      lightness: 18,
      corrosionResistance: 86,
      conductivity: 98,
      costEfficiency: 52,
    },
    applications: {
      automotive: 'ضفائر الأسلاك الكهربائية، ملفات المحركات الكهربائية للسيارات الهجينة، والمبادلات الحرارية.',
      aerospace: 'أنظمة الحماية من الصواعق، الموصلات الدقيقة لإلكترونيات الطيران، وأنابيب التبريد.',
      devices: 'المسارات المطبوعة في الدوائر الإلكترونية، ملفات المحولات، وأنابيب التكييف.',
    },
    tensile: {
      areaMm2: 2.3,
      yieldForceN: 340,
      ultimateForceN: 565,
      maxElongationPct: 32,
      maxNeckingRatio: 0.5,
      youngModulusGPa: 117,
      baseColor: '#ea8c55',
      metallicSheen: '#fdba74',
    },
  },
  {
    id: 'abs',
    name: 'البلاستيك الهندسي ABS',
    englishName: 'ABS Polymer',
    code: 'C₈H₈·C₄H₆·C₃H₃N',
    category: 'بوليمرات هندسية',
    density: 1.04,
    tensileStrengthMPa: 46,
    summary: 'بوليمر صناعي خفيف للغاية، مقاوم للصدمات، وعازل كهربائي مثالي للتصنيع السريع.',
    engineeringOverview:
      'يتكون بوليمر ABS من اتحاد ثلاثة مونومرات تمنحه الصلابة ومقاومة الصدمات وقابلية الحقن والتشكيل الدقيق. لا يصدأ مطلقاً ويتميز بعزل كهربائي وحراري ممتاز، مع وزن منخفض جداً وتكلفة إنتاج اقتصادية في الكميات الكبيرة.',
    properties: {
      hardness: 30,
      elasticity: 60,
      lightness: 95,
      corrosionResistance: 96,
      conductivity: 6,
      costEfficiency: 94,
    },
    applications: {
      automotive: 'لوحات القيادة الداخلية، المصدات، أغطية المرايا، وقنوات التهوية.',
      aerospace: 'تجهيزات المقصورة الداخلية غير الحاملة للأحمال، وعلب الأجهزة المساعدة.',
      devices: 'هياكل الأجهزة المنزلية، خيوط الطباعة ثلاثية الأبعاد، ومعدات الحماية الشخصية.',
    },
    tensile: {
      areaMm2: 4.5,
      yieldForceN: 135,
      ultimateForceN: 210,
      maxElongationPct: 26,
      maxNeckingRatio: 0.34,
      youngModulusGPa: 2.3,
      baseColor: '#38bdf8',
      metallicSheen: '#7dd3fc',
    },
  },
  {
    id: 'carbon',
    name: 'ألياف الكربون',
    englishName: 'Carbon Fiber CFRP',
    code: 'CFRP · Composite',
    category: 'مواد مركبة متقدمة',
    density: 1.6,
    tensileStrengthMPa: 1150,
    summary: 'أعلى نسبة قوة إلى وزن في الهندسة الحديثة؛ صلادة فائقة مع وزن أخف من الألومنيوم.',
    engineeringOverview:
      'تتكون مركبات ألياف الكربون (CFRP) من خيوط كربونية مجهرية مدمجة في مصفوفة راتنجية (Epoxy). تتفوق على الصلب في مقاومة الشد بمقدار كبير مع وزن يقل عن خُمس وزن الصلب، إلا أن سلوكها هش نسبياً إذ تنكسر فجأة دون مرحلة تخصّر واضحة.',
    properties: {
      hardness: 94,
      elasticity: 35,
      lightness: 92,
      corrosionResistance: 95,
      conductivity: 24,
      costEfficiency: 18,
    },
    applications: {
      automotive: 'مقصورات سيارات السباق (Monocoque)، أغطية المحركات الرياضية، وأعمدة النقل الخفيفة.',
      aerospace: 'الأجنحة والهياكل الرئيسية للطائرات الحديثة مثل Boeing 787 وشفرات المروحيات.',
      devices: 'الأطراف الصناعية المتطورة، الهياكل الدقيقة للطائرات المسيرة (Drones)، والكاميرات.',
    },
    tensile: {
      areaMm2: 1.25,
      yieldForceN: 1290,
      ultimateForceN: 1440,
      maxElongationPct: 3.8,
      maxNeckingRatio: 0.06,
      youngModulusGPa: 135,
      baseColor: '#334155',
      metallicSheen: '#64748b',
    },
  },
];

export const MATERIAL_MAP: Record<MaterialId, MaterialItem> = MATERIALS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<MaterialId, MaterialItem>
);

export const PRESET_CHALLENGES: PresetChallenge[] = [
  {
    id: 'aircraft',
    label: 'تحدي هيكل طائرة',
    subtitle: 'الألومنيوم مقابل ألياف الكربون',
    materialA: 'aluminum',
    materialB: 'carbon',
    winnerId: 'carbon',
    title: 'ألياف الكربون تتفوق في نسبة القوة إلى الوزن',
    reasoning:
      'في هياكل الطائرات الحديثة، كل كيلوغرام إضافي يرفع استهلاك الوقود. تتفوق ألياف الكربون بصلادة أعلى (94 مقابل 58) ووزن أخف (كثافة 1.6 مقابل 2.7 g/cm³) ومقاومة ممتازة للتعب والصدأ، بينما يظل الألومنيوم خياراً اقتصادياً ممتازاً للأجزاء التي تتطلب صيانة وتشكيل أسهل.',
  },
  {
    id: 'electricity',
    label: 'تحدي نقل الكهرباء',
    subtitle: 'النحاس مقابل الألومنيوم',
    materialA: 'copper',
    materialB: 'aluminum',
    winnerId: 'copper',
    title: 'النحاس يتصدر التوصيل بينما الألومنيوم يناسب الخطوط الهوائية',
    reasoning:
      'يتفوق النحاس في التوصيل الكهربائي والحراري (98%) وفي المطيلية، مما يجعله الخيار الأول للأسلاك الداخلية والمحركات واللوحات الإلكترونية. أما الألومنيوم فرغم أن توصيله أقل نسبياً (76%)، إلا أن خفة وزنه وتكلفته الأقل تجعله مثالياً لخطوط نقل الجهد العالي الممتدة بين الأبراج.',
  },
  {
    id: 'engine',
    label: 'تحدي قطع المحرك',
    subtitle: 'الحديد الصلب مقابل البلاستيك الهندسي',
    materialA: 'steel',
    materialB: 'abs',
    winnerId: 'steel',
    title: 'الحديد الصلب ضروري لقلب المحرك المتحمل للحرارة والإجهاد',
    reasoning:
      'تتعرض قطع المحرك الداخلية (مثل المكابس وأعمدة الكرنك والتروس) لإجهادات شد وضغط هائلة وحرارة مرتفعة، وهنا ينتصر الحديد الصلب بصلادته (90) وقوة تحمله (620 MPa). أما البلاستيك الهندسي ABS فيناسب الأغطية الخارجية وقنوات الهواء الباردة لخفة وزنه وعزله التام.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'أي من المواد التالية تحقق أعلى نسبة "قوة شد مقابل خفة الوزن" في صناعة هياكل الطائرات الحديثة؟',
    options: [
      'الحديد الصلب الكربوني',
      'ألياف الكربون المركبة (CFRP)',
      'النحاس النقي',
      'البلاستيك الهندسي ABS',
    ],
    correctIndex: 1,
    explanation:
      'ألياف الكربون توفر قوة شد تصل إلى أكثر من 1150 MPa بكثافة منخفضة جداً (1.6 g/cm³)، مما يجعلها مثالية للطيران.',
  },
  {
    id: 2,
    question: 'ماذا يحدث للعينة المعدنية عندما تتجاوز "حد الخضوع" (Yield Point) وتدخل مرحلة التشوه الدائم؟',
    options: [
      'تعود إلى طولها الأصلي تماماً بمجرد إزالة القوة',
      'تتحول إلى مادة عازلة للكهرباء',
      'تبدأ بالتخصّر في المنتصف (Necking) ولا تعود لشكلها الأصلي',
      'تزداد سماكتها في المنتصف وتصبح أكثر صلادة',
    ],
    correctIndex: 2,
    explanation:
      'بعد تجاوز حد المرونة تدخل المادة منطقة التشوه اللدن الدائم، حيث يحدث استطالة غير مسترجعة وتخصّر موضعي قبل الانكسار.',
  },
  {
    id: 3,
    question: 'لماذا يُفضّل استخدام الألومنيوم أحياناً في كابلات نقل الجهد العالي الهوائية بدلاً من النحاس رغم تفوق النحاس في التوصيل؟',
    options: [
      'لأن الألومنيوم أكثر صلادة من الحديد الصلب',
      'لأن الألومنيوم أخف وزناً بكثير وأقل تكلفة في المسافات الطويلة',
      'لأن النحاس لا يوصل التيار المتردد',
      'لأن الألومنيوم ينصهر عند درجات حرارة أعلى من النحاس',
    ],
    correctIndex: 1,
    explanation:
      'كثافة الألومنيوم (2.7 g/cm³) أقل من ثلث كثافة النحاس (8.96 g/cm³)، مما يقلل الأحمال الميكانيكية على أبراج الكهرباء.',
  },
  {
    id: 4,
    question: 'ما السمة المميزة لسلوك "ألياف الكربون" في اختبار الشد مقارنة بالنحاس أو الحديد الصلب؟',
    options: [
      'تتمدد بنسبة تزيد عن 30% قبل الانكسار',
      'تنكسر بشكل شبه مفاجئ (هش نسبياً) دون مرحلة تخصّر طويلة',
      'تتحول إلى بلاستيك مرن عند زيادة القوة',
      'تنكسر عند قوة أقل من 150 نيوتن',
    ],
    correctIndex: 1,
    explanation:
      'المواد المركبة مثل ألياف الكربون تتحمل أحمالاً عالية جداً لكنها تنكسر باستطالة محدودة (~3-4%) ودون تخصّر لدن واضح.',
  },
  {
    id: 5,
    question: 'ما المادة الأنسب لتصنيع أغطية الأجهزة المنزلية واللوحات الداخلية للسيارات بتكلفة اقتصادية وعزل كهربائي تام؟',
    options: [
      'البلاستيك الهندسي ABS',
      'الحديد الصلب عالي الكربون',
      'النحاس الملدن',
      'ألياف الكربون المنسوجة',
    ],
    correctIndex: 0,
    explanation:
      'البلاستيك الهندسي ABS يجمع بين خفة الوزن، مقاومة الصدأ التامة، العزل الكهربائي، وسهولة التشكيل بالحقن بتكلفة اقتصادية.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'hardness',
    termAr: 'الصلادة',
    termEn: 'Hardness',
    unit: 'HV / HRC',
    categoryId: 'mechanical',
    categoryLabel: 'الخواص الميكانيكية',
    definition:
      'مقاومة سطح المادة للخدش أو التآكل أو الاختراق الميكانيكي عند ضغط جسم صلب عليه دون أن يتشوه موضعياً.',
    engineeringExample:
      'يتمتع الحديد الصلب وألياف الكربون بصلادة مرتفعة تجعلهما مثاليين للتروس وأدوات القطع.',
  },
  {
    id: 'elasticity',
    termAr: 'المرونة',
    termEn: 'Elasticity',
    categoryId: 'mechanical',
    categoryLabel: 'الخواص الميكانيكية',
    definition:
      'قدرة المادة على التمدد أو الانضغاط عند تطبيق قوة عليها، ثم العودة تماماً إلى أبعادها وشكلها الأصلي بمجرد إزالة الحمل.',
    engineeringExample:
      'تُصمَّم نوابض التعليق في السيارات لتعمل ضمن منطقة المرونة طوال عمرها التشغيلي.',
  },
  {
    id: 'stress',
    termAr: 'الإجهاد',
    termEn: 'Stress',
    formula: 'σ = F / A',
    unit: 'MPa',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'مقدار القوة الداخلية المؤثرة عمودياً أو موازياً على وحدة المساحة من المقطع العرضي للمادة عند تعرضها لحمل خارجي.',
    engineeringExample:
      'تتحمل قضبان الصلب إجهاد شد يصل إلى 620 MPa قبل الوصول إلى مرحلة الانهيار.',
  },
  {
    id: 'strain',
    termAr: 'الانفعال',
    termEn: 'Strain',
    formula: 'ε = ΔL / L₀',
    unit: '%',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'نسبة التغير في طول العينة (الاستطالة أو الانكماش) مقارنة بطولها الأصلي نتيجة تعرضها لإجهاد ميكانيكي.',
    engineeringExample:
      'يستطيل النحاس بنسبة تتجاوز 30% قبل الانكسار بينما لا يتجاوز انفعال ألياف الكربون 4%.',
  },
  {
    id: 'youngs-modulus',
    termAr: 'معامل يونغ (معامل المرونة)',
    termEn: "Young's Modulus",
    formula: 'E = σ / ε',
    unit: 'GPa',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'مقياس لمدى جساءة المادة ومقاومتها للتشوه المرن، ويُمثَّل بميل الخط المستقيم في بداية منحنى الإجهاد والانفعال.',
    engineeringExample:
      'معامل يونغ للصلب (200 GPa) يقارب ثلاثة أضعاف الألومنيوم (69 GPa)، لذا يتطلب قوة أكبر لثنيه.',
  },
  {
    id: 'yield-point',
    termAr: 'حد الخضوع',
    termEn: 'Yield Point',
    formula: 'σy',
    unit: 'MPa',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'قيمة الإجهاد الحرجة التي تنتقل عندها المادة من التشوه المرن المؤقت إلى التشوه اللدن الدائم الذي لا يزول بإزالة القوة.',
    engineeringExample:
      'يُعد حد الخضوع المرجع الأساسي للمهندسين عند تصميم الجسور والأعمدة لتفادي الانحناء الدائم.',
  },
  {
    id: 'ultimate-tensile-strength',
    termAr: 'مقاومة الشد القصوى',
    termEn: 'Ultimate Tensile Strength',
    formula: 'UTS',
    unit: 'MPa',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'أعلى قيمة إجهاد شد تستطيع المادة تحملها أثناء الاختبار قبل أن تبدأ بالانهيار والتخصّر السريع نحو الانكسار.',
    engineeringExample:
      'تصل مقاومة الشد القصوى لمركبات ألياف الكربون إلى 1150 MPa رغم خفة وزنها الفائقة.',
  },
  {
    id: 'ductility',
    termAr: 'المطيلية',
    termEn: 'Ductility',
    categoryId: 'mechanical',
    categoryLabel: 'الخواص الميكانيكية',
    definition:
      'قابلية المادة للاستطالة والتشكيل اللدن تحت تأثير قوى الشد — مثل سحبها إلى أسلاك طويلة — قبل أن تنكسر.',
    engineeringExample:
      'يُعد النحاس والألومنيوم من أكثر المعادن مطيلية، مما يسهل سحبهما إلى كابلات كهربائية دقيقة.',
  },
  {
    id: 'necking',
    termAr: 'التخصّر',
    termEn: 'Necking',
    categoryId: 'tensile',
    categoryLabel: 'سلوك الشد والإجهاد',
    definition:
      'تناقص موضعي مفاجئ في قطر أو مساحة مقطع العينة المعدنية عند نقطة معينة بعد تجاوز أقصى قوة شد وقبيل الانكسار.',
    engineeringExample:
      'يظهر التخصّر بوضوح في منتصف عينات الصلب والنحاس كإنذار بصري واضح قبل انفصال العينة.',
  },
  {
    id: 'brittleness',
    termAr: 'الهشاشة',
    termEn: 'Brittleness',
    categoryId: 'mechanical',
    categoryLabel: 'الخواص الميكانيكية',
    definition:
      'ميل المادة للانكسار المفاجئ عند تجاوز حد تحملها دون أن تُظهر استطالة أو تشوهاً لدناً واضحاً قبل الكسر.',
    engineeringExample:
      'تتحمل ألياف الكربون أحمالاً هائلة لكنها تنكسر فجأة دون تخصّر ملحوظ عند بلوغ حدها الأقصى.',
  },
  {
    id: 'density',
    termAr: 'الكثافة',
    termEn: 'Density',
    formula: 'ρ = m / V',
    unit: 'g/cm³',
    categoryId: 'physical',
    categoryLabel: 'الخواص الفيزيائية',
    definition:
      'كتلة المادة الموجودة في وحدة الحجوم؛ تحدد ثقل القطعة المصنوعة مقارنة بحجمها الهندسي.',
    engineeringExample:
      'كثافة الألومنيوم (2.7 g/cm³) أقل بكثير من الحديد الصلب (7.85 g/cm³)، مما يوفر وقود الطائرات.',
  },
  {
    id: 'conductivity',
    termAr: 'التوصيل الحراري والكهربائي',
    termEn: 'Conductivity',
    categoryId: 'physical',
    categoryLabel: 'الخواص الفيزيائية',
    definition:
      'قدرة المادة على نقل الشحنات الكهربائية أو الطاقة الحرارية عبر بنيتها الداخلية بأقل فقدان ممكن.',
    engineeringExample:
      'يتصدر النحاس نقل الكهرباء والحرارة، بينما يُستخدم البلاستيك ABS كعازل لحماية المستخدمين.',
  },
];
