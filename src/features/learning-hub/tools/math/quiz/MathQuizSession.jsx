import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { formatProblem } from "../generateProblems";
import { getQuizExplanation } from "./math-quiz-explanations";

export default function MathQuizSession({
  quizLabel,
  level,
  progress,
  currentProblem,
  feedbackPhase,
  validationError,
  canAdvance,
  onSubmitAnswer,
  onNext,
  onExit,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [currentProblem, progress.current]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitAnswer(inputValue);
  };

  const inputClassName = [
    "math-quiz-input",
    feedbackPhase === "success" ? "math-quiz-input--success" : "",
    feedbackPhase === "wrong" || validationError
      ? "math-quiz-input--error"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-1 sm:px-0">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            {quizLabel}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Problem {progress.current} of {progress.total}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Exit quiz
        </button>
      </div>

      <div className="math-quiz-progress-track">
        <div
          className="math-quiz-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {currentProblem ? (
          <pre className="math-quiz-problem">{formatProblem(currentProblem)}</pre>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center">
          <label htmlFor="math-quiz-answer" className="sr-only">
            Your answer
          </label>
          <input
            id="math-quiz-answer"
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={feedbackPhase === "success" && canAdvance}
            className={inputClassName}
            placeholder="?"
            autoComplete="off"
          />

          {validationError ? (
            <p className="math-quiz-error-banner mt-4">{validationError}</p>
          ) : null}

          <AnimatePresence mode="wait">
            {feedbackPhase === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <p className="math-quiz-success-banner">
                  <Check size={18} />
                  Correct!
                </p>
              </motion.div>
            ) : null}

            {feedbackPhase === "wrong" ? (
              <motion.p
                key="wrong"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="math-quiz-error-banner mt-4"
              >
                Not quite — review and tap Next when ready.
              </motion.p>
            ) : null}

            {feedbackPhase === "explanation" && currentProblem ? (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="math-quiz-explanation mt-4"
              >
                <p className="font-semibold">One more chance</p>
                <p className="mt-2">{getQuizExplanation(currentProblem, level)}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {!canAdvance ? (
              <button
                type="submit"
                className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
              >
                Check answer
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
