import { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { QUIZ_QUESTIONS } from '../data/materialsData';
import { evaluateQuiz } from '../utils/materialsLogic';

export function QuizSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOption = answers[currentQuestion.id];
  const hasAnsweredCurrent = selectedOption !== undefined;
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const evaluation = evaluateQuiz(answers, QUIZ_QUESTIONS);
  const progressPct = Math.round(
    ((currentIndex + (hasAnsweredCurrent ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100
  );

  return (
    <section
      id="quiz"
      className="border-b border-border-theme bg-canvas py-14 sm:py-18 transition-colors duration-200"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center space-y-2"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading">
            03. تحدي المهندس الصغير
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-body">
            اختبر فهمك لخصائص المواد وتطبيقاتها الصناعية عبر 5 أسئلة تفاعلية مع تصحيح فوري ووسام
            تقييم نهائي.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border-theme bg-surface p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-200"
              >
                {/* Progress Header */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-accent">
                      السؤال <span className="font-mono-nums">{currentIndex + 1}</span> من{' '}
                      <span className="font-mono-nums">{QUIZ_QUESTIONS.length}</span>
                    </span>
                    <span className="font-mono-nums text-ink-muted">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-alt border border-border-theme">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-heading">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isRightOption = idx === currentQuestion.correctIndex;

                    let stateClasses =
                      'border-border-theme bg-surface-alt text-ink hover:border-accent/60 hover:bg-accent-soft/60';

                    if (hasAnsweredCurrent) {
                      if (isRightOption) {
                        stateClasses =
                          'border-teal-500 dark:border-emerald-500/70 bg-teal-50 dark:bg-emerald-500/15 text-teal-900 dark:text-emerald-200';
                      } else if (isSelected && !isRightOption) {
                        stateClasses =
                          'border-rose-400 dark:border-red-500/70 bg-rose-50 dark:bg-red-500/15 text-rose-900 dark:text-red-200';
                      } else {
                        stateClasses =
                          'border-border-theme bg-surface-alt/50 text-ink-muted opacity-75';
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={hasAnsweredCurrent}
                        onClick={() => handleSelectOption(idx)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-right text-sm sm:text-base font-semibold transition-all duration-150 min-h-[52px] ${stateClasses}`}
                      >
                        <span>{option}</span>
                        {hasAnsweredCurrent && isRightOption && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0D9488] dark:text-emerald-400" />
                        )}
                        {hasAnsweredCurrent && isSelected && !isRightOption && (
                          <XCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback & Next Button */}
                {hasAnsweredCurrent && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 border-t border-border-theme pt-5"
                  >
                    <div
                      className={`rounded-xl border p-4 text-sm leading-relaxed ${
                        isCorrect
                          ? 'border-teal-200 dark:border-emerald-500/40 bg-teal-50/70 dark:bg-emerald-950/30 text-teal-900 dark:text-emerald-200'
                          : 'border-amber-200 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <div className="font-bold mb-1">
                        {isCorrect ? '✓ إجابة صحيحة!' : '✖ إجابة غير دقيقة'}
                      </div>
                      <p>{currentQuestion.explanation}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-fg shadow-sm hover:bg-accent-hover transition-colors min-h-[44px]"
                      >
                        {currentIndex < QUIZ_QUESTIONS.length - 1
                          ? 'السؤال التالي'
                          : 'عرض النتيجة والوسام'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Final Score & Medal Screen */
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                data-testid="quiz-result-card"
                className="rounded-2xl border border-accent-border bg-surface p-8 text-center shadow-sm space-y-6 transition-colors duration-200"
              >
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border ${
                    evaluation.medalTier === 'gold'
                      ? 'border-amber-200 dark:border-amber-400/50 bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300'
                      : evaluation.medalTier === 'silver'
                        ? 'border-accent-border bg-accent-soft text-accent'
                        : 'border-accent-secondary/35 bg-accent-secondary-soft text-accent-secondary'
                  }`}
                >
                  <Award className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-accent-secondary">
                    نتيجة تحدي المهندس الصغير
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-heading">
                    {evaluation.medalTitle}
                  </h3>
                  <p className="mx-auto max-w-md text-sm text-ink-body">
                    {evaluation.medalSubtitle}
                  </p>
                </div>

                <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border-theme bg-surface-alt p-4">
                    <div className="text-xs text-ink-muted">الدرجة المحققة</div>
                    <div className="font-mono-nums mt-1 text-2xl font-extrabold text-accent">
                      {evaluation.score} / {evaluation.total}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border-theme bg-surface-alt p-4">
                    <div className="text-xs text-ink-muted">النسبة المئوية</div>
                    <div className="font-mono-nums mt-1 text-2xl font-extrabold text-accent-secondary">
                      {evaluation.percentage}%
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-fg shadow-sm hover:bg-accent-hover transition-colors min-h-[44px]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>إعادة الاختبار</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
