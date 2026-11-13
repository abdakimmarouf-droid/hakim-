import { GLOSSARY_TERMS, MATERIALS, PRESET_CHALLENGES, QUIZ_QUESTIONS } from '../data/materialsData';

export function buildStandaloneHtml(): string {
  const serializedMaterials = JSON.stringify(MATERIALS);
  const serializedPresets = JSON.stringify(PRESET_CHALLENGES);
  const serializedQuiz = JSON.stringify(QUIZ_QUESTIONS);
  const serializedGlossary = JSON.stringify(GLOSSARY_TERMS);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>المختبر التفاعلي لعلوم المواد الميكانيكية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=IBM+Plex+Mono:wght@500;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #F8FAFC;
      --card: #FFFFFF;
      --surface-alt: #F8FAFC;
      --border: #E2E8F0;
      --primary: #2563EB;
      --primary-fg: #FFFFFF;
      --secondary: #0D9488;
      --text: #1E293B;
      --muted: #64748B;
      --body-text: #475569;
      --grid-line: rgba(37, 99, 235, 0.045);
      --header-bg: rgba(248, 250, 252, 0.92);
      --rec-bg: #EFF6FF;
      --rec-border: #BFDBFE;
    }
    html.dark {
      --bg: #0F172A;
      --card: #1E293B;
      --surface-alt: #0F172A;
      --border: #334155;
      --primary: #38BDF8;
      --primary-fg: #020617;
      --secondary: #2DD4BF;
      --text: #F1F5F9;
      --muted: #94A3B8;
      --body-text: #CBD5E1;
      --grid-line: rgba(56, 189, 248, 0.05);
      --header-bg: rgba(15, 23, 42, 0.92);
      --rec-bg: rgba(56, 189, 248, 0.1);
      --rec-border: rgba(56, 189, 248, 0.35);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-family: 'Cairo', system-ui, sans-serif; background: var(--bg); color: var(--text); transition: background-color 0.2s ease, color 0.2s ease; }
    body { line-height: 1.65; overflow-x: hidden; }
    .blueprint-bg {
      background-color: var(--bg);
      background-image:
        linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .mono { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; direction: ltr; display: inline-block; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
    header { position: sticky; top: 0; z-index: 40; background: var(--header-bg); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 20px; }
    .brand { font-weight: 800; font-size: 1.1rem; color: var(--text); text-decoration: none; white-space: nowrap; }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a { color: var(--body-text); text-decoration: none; font-size: 0.92rem; font-weight: 600; white-space: nowrap; }
    .nav-links a:hover { color: var(--primary); }
    .btn-primary { background: var(--primary); color: var(--primary-fg); border: none; border-radius: 12px; padding: 10px 18px; font-family: inherit; font-weight: 700; font-size: 0.9rem; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
    .btn-secondary { background: var(--card); color: var(--text); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; font-family: inherit; font-weight: 600; font-size: 0.9rem; cursor: pointer; }
    .btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
    section { padding: 56px 0; border-bottom: 1px solid var(--border); }
    h1 { font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: var(--text); }
    h2 { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; margin-bottom: 10px; color: var(--text); }
    .subtitle { color: var(--body-text); font-size: 0.98rem; max-width: 660px; margin-bottom: 28px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04); }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .team-box { margin: 24px 0; padding: 20px; border-radius: 16px; background: var(--card); border: 1px solid var(--border); }
    .quick-nav { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-top: 20px; }
    .quick-nav a { display: block; padding: 14px; border-radius: 14px; background: var(--card); border: 1px solid var(--border); color: var(--text); text-decoration: none; font-weight: 700; }
    .quick-nav a:hover { border-color: var(--primary); color: var(--primary); }
    .quick-nav span { display: block; font-size: 0.8rem; font-weight: 400; color: var(--muted); }
    .mat-card { width: 100%; text-align: right; cursor: pointer; font-family: inherit; color: var(--text); transition: transform 0.15s ease, border-color 0.15s ease; }
    .mat-card:hover { transform: translateY(-2px); border-color: var(--primary); }
    .bar-bg { height: 10px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 999px; overflow: hidden; margin-top: 6px; }
    .bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.65); display: none; align-items: center; justify-content: center; padding: 16px; z-index: 60; backdrop-filter: blur(4px); }
    .modal-backdrop.open { display: flex; }
    .modal-panel { background: var(--card); border: 1px solid var(--border); border-radius: 18px; max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; color: var(--text); }
    select { width: 100%; background: var(--surface-alt); color: var(--text); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; font-family: inherit; font-weight: 600; }
    .quiz-opt { width: 100%; text-align: right; padding: 14px 16px; border-radius: 12px; background: var(--surface-alt); border: 1px solid var(--border); color: var(--text); font-family: inherit; font-size: 0.95rem; font-weight: 600; cursor: pointer; margin-bottom: 10px; }
    .quiz-opt:hover:not(:disabled) { border-color: var(--primary); }
    .quiz-opt.correct { border-color: var(--secondary); background: rgba(13, 148, 136, 0.14); }
    .quiz-opt.wrong { border-color: #F43F5E; background: rgba(244, 63, 94, 0.14); }
    @media (max-width: 720px) { .nav-links { display: none; } }
  </style>
</head>
<body>
  <header>
    <div class="container nav-inner">
      <a href="#top" class="brand">مختبر علوم المواد</a>
      <nav class="nav-links">
        <a href="#encyclopedia">الموسوعة</a>
        <a href="#comparator">المقارنة الذكية</a>
        <a href="#quiz">تحدي المهندس</a>
        <a href="#glossary">قاموس المصطلحات</a>
      </nav>
      <a href="#comparator" class="btn-primary">المقارنة الذكية</a>
    </div>
  </header>

  <main>
    <section id="top" class="blueprint-bg">
      <div class="container">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px;">
          <div style="color: var(--secondary); font-size: 0.88rem; font-weight: 700;">مشروع دراسي تفاعلي · قسم الهندسة الميكانيكية</div>
          <button id="theme-toggle" type="button" class="btn-secondary">الوضع الداكن</button>
        </div>
        <h1>المختبر التفاعلي لعلوم المواد الميكانيكية</h1>
        <p class="subtitle">منصة تعليمية هادئة ومبسطة لاستكشاف الخواص الفيزيائية والميكانيكية للمواد الصناعية، ومقارنة أدائها الهندسي ذكياً لاختيار المادة الأنسب لكل تطبيق ميكانيكي.</p>
        <div class="team-box">
          <div style="font-size: 0.8rem; color: var(--muted);">إعداد الطلبة — قسم الهندسة الميكانيكية</div>
          <div style="font-size: 1.05rem; font-weight: 800; margin-top: 4px; margin-bottom: 12px;">معروف عبد الجكيم · عوام بلال · بوازني منيب · بلعريبي اوسامة</div>
          <div style="border-top: 1px solid var(--border); padding-top: 10px; font-size: 0.95rem; font-weight: 700;">
            تحت إشراف أستاذ مادة الهندسة الميكانيكية: <span style="color: var(--primary);">شكري رضوان</span>
          </div>
        </div>
        <div class="quick-nav">
          <a href="#encyclopedia">موسوعة المواد<span>5 مواد وتطبيقاتها</span></a>
          <a href="#comparator">المقارنة الذكية<span>تحديات جاهزة وتوصية فورية</span></a>
          <a href="#quiz">تحدي المهندس<span>5 أسئلة ووسام تقييم</span></a>
        </div>
      </div>
    </section>

    <section id="encyclopedia">
      <div class="container">
        <h2>01. موسوعة المواد الهندسية</h2>
        <p class="subtitle">اضغط على أي مادة لفتح بطاقتها الهندسية التفصيلية والخواص الميكانيكية والتطبيقات الصناعية.</p>
        <div id="materials-grid" class="grid-3"></div>
      </div>
    </section>

    <section id="comparator" class="blueprint-bg">
      <div class="container">
        <h2>02. أداة المقارنة الذكية المتطورة</h2>
        <p class="subtitle">استخدم التحديات الجاهزة أو اختر أي مادتين للمقارنة عبر 5 معايير والحصول على التوصية الهندسية الذكية.</p>
        <div id="preset-buttons" class="grid-3" style="margin-bottom:20px;"></div>
        <div class="card">
          <div class="grid-2" style="margin-bottom:20px;">
            <div>
              <label for="cmp-a" style="display:block; font-weight:700; color:var(--primary); margin-bottom:6px;">المادة الأولى</label>
              <select id="cmp-a"></select>
            </div>
            <div>
              <label for="cmp-b" style="display:block; font-weight:700; color:var(--secondary); margin-bottom:6px;">المادة الثانية</label>
              <select id="cmp-b"></select>
            </div>
          </div>
          <div id="cmp-rows" style="display:flex; flex-direction:column; gap:14px;"></div>
          <div id="cmp-rec" style="margin-top:20px; padding:18px; border-radius:12px; background:var(--rec-bg); border:1px solid var(--rec-border);"></div>
        </div>
      </div>
    </section>

    <section id="quiz">
      <div class="container" style="max-width:760px;">
        <h2 style="text-align:center;">03. تحدي المهندس الصغير</h2>
        <p class="subtitle" style="text-align:center; margin-left:auto; margin-right:auto;">5 أسئلة تفاعلية مع تصحيح فوري ووسام تقييم في نهاية الاختبار.</p>
        <div id="quiz-box" class="card"></div>
      </div>
    </section>

    <section id="glossary" class="blueprint-bg" style="border-bottom:none;">
      <div class="container">
        <h2>04. قاموس المصطلحات الهندسية</h2>
        <p class="subtitle">مرجع مبسط لأهم مصطلحات الميكانيكا وعلوم المواد مع الصيغ الفيزيائية والأمثلة التطبيقية لتسهيل الفهم للطلاب.</p>
        <div id="glossary-grid" class="grid-3"></div>
      </div>
    </section>
  </main>

  <footer style="background:var(--card); border-top:1px solid var(--border); padding:24px 0; text-align:center; font-size:0.85rem; color:var(--body-text);">
    <div class="container">
      <strong>المختبر التفاعلي لعلوم المواد الميكانيكية</strong> · تحت إشراف الأستاذ شكري رضوان
    </div>
  </footer>

  <div id="mat-modal" class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-panel">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
        <h3 id="modal-title" style="font-size:1.35rem; font-weight:800;"></h3>
        <button id="modal-close" type="button" class="btn-secondary">إغلاق</button>
      </div>
      <div id="modal-body"></div>
    </div>
  </div>

  <script>
    const MATERIALS = ${serializedMaterials};
    const PRESETS = ${serializedPresets};
    const QUIZ = ${serializedQuiz};
    const GLOSSARY = ${serializedGlossary};
    const MAT_MAP = Object.fromEntries(MATERIALS.map(m => [m.id, m]));

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.onclick = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      themeBtn.textContent = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
    };

    // Encyclopedia
    const grid = document.getElementById('materials-grid');
    const modal = document.getElementById('mat-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    document.getElementById('modal-close').onclick = () => modal.classList.remove('open');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };

    MATERIALS.forEach(m => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card mat-card';
      btn.innerHTML = '<div style="font-size:0.78rem; color:var(--primary); margin-bottom:6px;">' + m.category + ' · <span class="mono">' + m.code + '</span></div>'
        + '<h3 style="font-size:1.15rem; font-weight:800; margin-bottom:8px;">' + m.name + '</h3>'
        + '<p style="font-size:0.88rem; color:var(--body-text); margin-bottom:14px;">' + m.summary + '</p>'
        + '<div style="font-size:0.8rem; color:var(--primary); font-weight:700;">عرض التفاصيل والتطبيقات ←</div>';
      btn.onclick = () => {
        modalTitle.textContent = m.name + ' (' + m.englishName + ')';
        const props = [
          ['الصلادة', m.properties.hardness, 'var(--primary)'],
          ['المرونة', m.properties.elasticity, 'var(--secondary)'],
          ['خفة الوزن', m.properties.lightness, '#0EA5E9'],
          ['مقاومة التآكل', m.properties.corrosionResistance, '#14B8A6']
        ];
        modalBody.innerHTML = '<p style="margin-bottom:16px; color:var(--body-text);">' + m.engineeringOverview + '</p>'
          + '<h4 style="color:var(--primary); margin-bottom:10px;">الخواص الميكانيكية</h4>'
          + props.map(([l, v, c]) => '<div style="margin-bottom:10px;"><div style="display:flex; justify-content:space-between; font-size:0.85rem;"><span>' + l + '</span><span class="mono">' + v + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + v + '%; background:' + c + ';"></div></div></div>').join('')
          + '<h4 style="color:var(--secondary); margin:16px 0 8px;">التطبيقات الصناعية</h4>'
          + '<p style="font-size:0.86rem; color:var(--body-text);"><strong>السيارات:</strong> ' + m.applications.automotive + '<br><strong>الطائرات:</strong> ' + m.applications.aerospace + '<br><strong>الأجهزة:</strong> ' + m.applications.devices + '</p>';
        modal.classList.add('open');
      };
      grid.appendChild(btn);
    });

    // Comparator
    const cmpA = document.getElementById('cmp-a');
    const cmpB = document.getElementById('cmp-b');
    const presetContainer = document.getElementById('preset-buttons');
    MATERIALS.forEach(m => {
      cmpA.add(new Option(m.name, m.id));
      cmpB.add(new Option(m.name, m.id));
    });
    cmpA.value = 'aluminum'; cmpB.value = 'carbon';
    let activePreset = 'aircraft';
    PRESETS.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn-secondary'; b.textContent = p.label;
      b.onclick = () => { cmpA.value = p.materialA; cmpB.value = p.materialB; activePreset = p.id; renderCmp(); };
      presetContainer.appendChild(b);
    });
    function renderCmp() {
      const a = MAT_MAP[cmpA.value], b = MAT_MAP[cmpB.value];
      const crit = [
        ['الصلادة', 'hardness'], ['خفة الوزن', 'lightness'], ['التوصيل الكهربائي والحراري', 'conductivity'],
        ['مقاومة الصدأ', 'corrosionResistance'], ['التكلفة الاقتصادية', 'costEfficiency']
      ];
      document.getElementById('cmp-rows').innerHTML = crit.map(([label, key]) =>
        '<div style="background:var(--surface-alt); border:1px solid var(--border); padding:12px; border-radius:12px;"><div style="font-weight:700; font-size:0.9rem; margin-bottom:8px;">' + label + '</div>'
        + '<div class="grid-2" style="gap:10px;"><div><div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span style="color:var(--primary); font-weight:700;">' + a.name + '</span><span class="mono">' + a.properties[key] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + a.properties[key] + '%; background:var(--primary);"></div></div></div>'
        + '<div><div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span style="color:var(--secondary); font-weight:700;">' + b.name + '</span><span class="mono">' + b.properties[key] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + b.properties[key] + '%; background:var(--secondary);"></div></div></div></div></div>'
      ).join('');
      const preset = PRESETS.find(p => p.id === activePreset || (p.materialA === a.id && p.materialB === b.id) || (p.materialB === a.id && p.materialA === b.id));
      const rec = document.getElementById('cmp-rec');
      if (a.id === b.id) {
        rec.innerHTML = '<strong>التوصية الهندسية:</strong> اختر مادتين مختلفتين للمقارنة.';
      } else if (preset) {
        rec.innerHTML = '<div style="color:var(--primary); font-weight:700; font-size:0.82rem;">التوصية الهندسية الذكية</div><h4 style="margin:4px 0;">' + preset.title + '</h4><p style="font-size:0.9rem; color:var(--body-text);">' + preset.reasoning + '</p>';
      } else {
        rec.innerHTML = '<div style="color:var(--primary); font-weight:700; font-size:0.82rem;">التوصية الهندسية الذكية</div><p style="font-size:0.9rem; color:var(--body-text); margin-top:4px;">بمقارنة ' + a.name + ' (شد ' + a.tensileStrengthMPa + ' MPa) مع ' + b.name + ' (شد ' + b.tensileStrengthMPa + ' MPa)، يُنصح بالاعتماد على المادة الأعلى في المعيار الحاسم لتصميمك سواء كان خفض الكتلة أو المتانة أو الميزانية.</p>';
      }
    }
    cmpA.onchange = () => { activePreset = null; renderCmp(); };
    cmpB.onchange = () => { activePreset = null; renderCmp(); };
    renderCmp();

    // Quiz
    let qIdx = 0, qScore = 0, qAnswered = false;
    const qBox = document.getElementById('quiz-box');
    function renderQuiz() {
      if (qIdx >= QUIZ.length) {
        const medal = qScore >= 4 ? 'وسام مهندس المواد الخبير' : qScore >= 3 ? 'وسام المهندس الواعد' : 'وسام باحث المختبر';
        qBox.innerHTML = '<div style="text-align:center;"><h3 style="color:var(--primary); font-size:1.5rem;">' + medal + '</h3><p class="mono" style="font-size:1.4rem; margin:12px 0;">' + qScore + ' / ' + QUIZ.length + '</p><button type="button" class="btn-primary" onclick="qIdx=0;qScore=0;qAnswered=false;renderQuiz();">إعادة الاختبار</button></div>';
        return;
      }
      const q = QUIZ[qIdx];
      qBox.innerHTML = '<div style="color:var(--primary); font-size:0.85rem; font-weight:700; margin-bottom:10px;">السؤال ' + (qIdx+1) + ' من ' + QUIZ.length + '</div>'
        + '<h3 style="margin-bottom:16px;">' + q.question + '</h3>'
        + '<div id="q-opts"></div><div id="q-fb" style="margin-top:12px;"></div>';
      const optsDiv = document.getElementById('q-opts');
      q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'quiz-opt'; b.textContent = opt;
        b.onclick = () => {
          if (qAnswered) return;
          qAnswered = true;
          if (i === q.correctIndex) qScore++;
          Array.from(optsDiv.children).forEach((child, ci) => {
            child.disabled = true;
            if (ci === q.correctIndex) child.classList.add('correct');
            else if (ci === i) child.classList.add('wrong');
          });
          document.getElementById('q-fb').innerHTML = '<p style="margin-bottom:12px; color:var(--body-text);">' + q.explanation + '</p><button type="button" class="btn-primary" id="q-next">' + (qIdx < QUIZ.length - 1 ? 'السؤال التالي' : 'عرض النتيجة') + '</button>';
          document.getElementById('q-next').onclick = () => { qIdx++; qAnswered = false; renderQuiz(); };
        };
        optsDiv.appendChild(b);
      });
    }
    renderQuiz();

    // Glossary
    const glossaryGrid = document.getElementById('glossary-grid');
    GLOSSARY.forEach(t => {
      const card = document.createElement('article');
      card.className = 'card';
      const meta = [t.formula, t.unit].filter(Boolean).join(' · ');
      card.innerHTML = '<div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--secondary); margin-bottom:6px;"><span>' + t.categoryLabel + '</span><span class="mono" style="color:var(--muted);">' + t.termEn + '</span></div>'
        + '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:8px;"><h3 style="font-size:1.1rem; font-weight:800;">' + t.termAr + '</h3>' + (meta ? '<span class="mono" style="font-size:0.78rem; color:var(--primary); font-weight:700;">' + meta + '</span>' : '') + '</div>'
        + '<p style="font-size:0.88rem; color:var(--body-text); margin-bottom:12px;">' + t.definition + '</p>'
        + '<div style="border-top:1px solid var(--border); padding-top:8px; font-size:0.8rem; color:var(--muted);"><strong style="color:var(--text);">مثال تطبيقي: </strong>' + t.engineeringExample + '</div>';
      glossaryGrid.appendChild(card);
    });
  </script>
</body>
</html>`;
}
