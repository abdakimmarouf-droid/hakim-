import test from 'node:test';
import assert from 'node:assert/strict';
import { GLOSSARY_TERMS, QUIZ_QUESTIONS } from '../data/materialsData';
import {
  calculateTensileState,
  compareMaterials,
  evaluateQuiz,
  filterGlossaryTerms,
} from './materialsLogic';
import { buildStandaloneHtml } from './standaloneHtml';

test('calculateTensileState handles elastic, plastic, and fracture phases accurately for steel', () => {
  const zero = calculateTensileState('steel', 0);
  assert.equal(zero.phase, 'elastic');
  assert.equal(zero.stressMPa, 0);
  assert.equal(zero.neckWidthRatio, 1);

  const elastic = calculateTensileState('steel', 500);
  assert.equal(elastic.phase, 'elastic');
  assert.equal(elastic.statusGlyph, '●');
  assert.ok(elastic.elongationPx > 0);

  const plastic = calculateTensileState('steel', 1050);
  assert.equal(plastic.phase, 'plastic');
  assert.equal(plastic.statusGlyph, '▲');
  assert.ok(plastic.neckWidthRatio < 0.9);

  const fracture = calculateTensileState('steel', 1400);
  assert.equal(fracture.phase, 'fracture');
  assert.equal(fracture.statusGlyph, '✖');
  assert.equal(fracture.progressToFracturePct, 100);
});

test('calculateTensileState shows early fracture for ABS and high endurance for carbon fiber', () => {
  const absAt300 = calculateTensileState('abs', 300);
  assert.equal(absAt300.phase, 'fracture');

  const carbonAt1000 = calculateTensileState('carbon', 1000);
  assert.equal(carbonAt1000.phase, 'elastic');

  const carbonAt1450 = calculateTensileState('carbon', 1450);
  assert.equal(carbonAt1450.phase, 'fracture');
});

test('compareMaterials handles preset challenges and custom pairs properly', () => {
  const aircraft = compareMaterials('aluminum', 'carbon', 'aircraft');
  assert.equal(aircraft.winnerId, 'carbon');
  assert.equal(aircraft.rows.length, 5);

  const electricity = compareMaterials('copper', 'aluminum', 'electricity');
  assert.equal(electricity.winnerId, 'copper');

  const engine = compareMaterials('steel', 'abs', 'engine');
  assert.equal(engine.winnerId, 'steel');

  const same = compareMaterials('copper', 'copper');
  assert.equal(same.winnerId, 'tie');

  const custom = compareMaterials('steel', 'carbon');
  assert.ok(custom.recommendationBody.length > 20);
  assert.equal(custom.rows.length, 5);
});

test('evaluateQuiz scores answers and assigns appropriate medal tiers', () => {
  const allCorrect: Record<number, number> = {};
  for (const q of QUIZ_QUESTIONS) {
    allCorrect[q.id] = q.correctIndex;
  }
  const goldResult = evaluateQuiz(allCorrect, QUIZ_QUESTIONS);
  assert.equal(goldResult.score, 5);
  assert.equal(goldResult.percentage, 100);
  assert.equal(goldResult.medalTier, 'gold');

  const partial = { 1: QUIZ_QUESTIONS[0].correctIndex, 2: QUIZ_QUESTIONS[1].correctIndex, 3: QUIZ_QUESTIONS[2].correctIndex };
  const silverResult = evaluateQuiz(partial, QUIZ_QUESTIONS);
  assert.equal(silverResult.score, 3);
  assert.equal(silverResult.medalTier, 'silver');

  const low = { 1: 0 };
  const bronzeResult = evaluateQuiz(low, QUIZ_QUESTIONS);
  assert.equal(bronzeResult.medalTier, 'bronze');
});

test('filterGlossaryTerms filters accurately by Arabic query, English query, and category', () => {
  const all = filterGlossaryTerms(GLOSSARY_TERMS, '', 'all');
  assert.equal(all.length, 12);

  const hardnessAr = filterGlossaryTerms(GLOSSARY_TERMS, 'الصلادة', 'all');
  assert.ok(hardnessAr.some((t) => t.id === 'hardness'));

  const hardnessEn = filterGlossaryTerms(GLOSSARY_TERMS, 'hardness', 'mechanical');
  assert.equal(hardnessEn.length, 1);
  assert.equal(hardnessEn[0].id, 'hardness');

  const tensileOnly = filterGlossaryTerms(GLOSSARY_TERMS, '', 'tensile');
  assert.ok(tensileOnly.length >= 5);
  assert.ok(tensileOnly.every((t) => t.categoryId === 'tensile'));

  const none = filterGlossaryTerms(GLOSSARY_TERMS, 'غير_موجود_xyz', 'all');
  assert.equal(none.length, 0);
});

test('buildStandaloneHtml generates complete self-contained RTL Arabic HTML document', () => {
  const html = buildStandaloneHtml();
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(html.includes('lang="ar" dir="rtl"'));
  assert.ok(html.includes('المختبر التفاعلي لعلوم المواد الميكانيكية'));
  assert.ok(html.includes('شكري رضوان'));
  assert.ok(html.includes('#F8FAFC'));
  assert.ok(html.includes('الوضع الداكن'));
  assert.ok(html.includes('ألياف الكربون'));
  assert.ok(html.includes('تحدي هيكل طائرة'));
  assert.ok(html.includes('قاموس المصطلحات الهندسية'));
  assert.ok(html.includes('الصلادة'));
  assert.ok(!html.includes('محاكي اختبار الشد'));
  assert.ok(html.includes('</html>'));
});
