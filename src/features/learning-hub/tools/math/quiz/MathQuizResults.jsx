import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, RotateCcw } from "lucide-react";
import { formatProblem } from "../generateProblems";
import { ATTEMPT_MODES } from "./math-quiz-explanations";

export default function MathQuizResults({
  scores,
  attemptMode,
  quizLabel,
  onTryAgain,
  onNewTest,
}) {
  const [showMissed, setShowMissed] = useState(false);
  const showFirstTryScore = attemptMode !== ATTEMPT_MODES.singleAttempt;

  return (
    <div className="mx-auto w-full max-w-3xl px-1 py-4 text-center sm:px-0">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Quiz complete
      </p>
      <h2 className="math-quiz-score-hero mt-3">
        {scores.finalCorrect} / {scores.total} correct
      </h2>
      <p className="mt-2 text-lg text-slate-600">
        {scores.finalPercent}% final score
      </p>

      {showFirstTryScore ? (
        <p className="mt-2 text-sm font-medium text-slate-500">
          First try: {scores.firstTryCorrect} / {scores.total} (
          {scores.firstTryPercent}%)
        </p>
      ) : null}

      <p className="mt-3 text-sm text-slate-500">{quizLabel}</p>

      {scores.missed.length > 0 ? (
        <div className="mt-8 text-left">
          <button
            type="button"
            onClick={() => setShowMissed((open) => !open)}
            className="text-sm font-semibold text-sky-700 underline hover:text-sky-800"
          >
            {showMissed ? "Hide" : "Show"} missed problems ({scores.missed.length})
          </button>

          {showMissed ? (
            <ul className="mt-4 space-y-3">
              {scores.missed.map(({ index, problem }) => (
                <li
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-700">
                    Problem #{index + 1}
                  </p>
                  <pre className="math-quiz-problem mt-2 text-2xl">
                    {formatProblem(problem)}
                  </pre>
                  <p className="mt-2 text-sm text-slate-600">
                    Answer: {problem.answer}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="mt-8 text-base font-medium text-emerald-800">
          Perfect run — every problem solved!
        </p>
      )}

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onTryAgain}
          className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          <RotateCcw size={16} />
          Try again
        </button>
        <button
          type="button"
          onClick={onNewTest}
          className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          New test
        </button>
        <Link
          to="/math"
          className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg border border-sky-300 bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
        >
          Print worksheet
        </Link>
      </div>
    </div>
  );
}
