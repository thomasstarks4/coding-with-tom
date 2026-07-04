import { useState } from "react";
import { Info, Play, Printer, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import HubModal from "../../layout/HubModal";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import {
  MATH_LEVELS,
  MATH_PRACTICE_SET_SIZE,
  formatProblem,
} from "./generateProblems";

export default function MathDashboard({
  level,
  onLevelChange,
  numProblems,
  onNumProblemsChange,
  includeAnswerKey,
  onIncludeAnswerKeyChange,
  worksheetProblems,
  practiceSet,
  activeLevel,
  onGenerate,
  onPrint,
  canOpenFocus,
  hasStartedFocus,
  onStartFocus,
  onNewPracticeSet,
}) {
  const [showLevelGuide, setShowLevelGuide] = useState(false);

  return (
    <div className="hub-no-print mx-auto w-full max-w-5xl px-1 sm:px-0">
      <HubToolPageHeader
        toolId="math"
        guideFooter={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              to="/math/quiz"
              className="text-sm font-semibold text-sky-700 underline hover:text-sky-800"
            >
              Try interactive quiz
            </Link>
            <button
              type="button"
              onClick={() => setShowLevelGuide(true)}
              className="text-sm font-semibold text-sky-700 underline hover:text-sky-800"
            >
              See level details
            </button>
          </div>
        }
      />

      <form onSubmit={onGenerate} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Level</h2>
              <p className="mt-1 text-sm text-slate-600">
                Choose difficulty for your learner.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLevelGuide(true)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-sky-700 hover:bg-sky-50"
            >
              <Info size={16} />
              Guide
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {MATH_LEVELS.map((entry) => (
              <button
                key={entry.level}
                type="button"
                onClick={() => onLevelChange(entry.level)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  level === entry.level
                    ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                    : "border-slate-200 bg-white hover:border-sky-300"
                }`}
              >
                <p className="font-semibold text-slate-900">{entry.label}</p>
                <p className="mt-1 text-sm text-slate-600">{entry.range}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {entry.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Screen practice
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Work through {MATH_PRACTICE_SET_SIZE} problems together on a large
            screen before or instead of printing.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canOpenFocus}
              onClick={onStartFocus}
              className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={16} />
              {hasStartedFocus ? "Continue focus session" : "Start focus session"}
            </button>
            <button
              type="button"
              onClick={onNewPracticeSet}
              className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              New practice set
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {practiceSet.length} problems loaded at {activeLevel?.label}.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="numProblems"
            className="block text-lg font-semibold text-slate-900"
          >
            Printable worksheet
          </label>
          <p className="mt-1 text-sm text-slate-600">
            Generate a worksheet to preview and print.
          </p>

          <input
            id="numProblems"
            type="number"
            min="1"
            max="100"
            required
            value={numProblems}
            onChange={(event) => onNumProblemsChange(event.target.value)}
            className="mt-3 w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-center text-xl font-semibold text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          <label className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(event) =>
                onIncludeAnswerKeyChange(event.target.checked)
              }
              className="h-5 w-5 rounded accent-sky-600"
            />
            Include answer key on printout
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              Generate worksheet
            </button>
            <button
              type="button"
              disabled={worksheetProblems.length === 0}
              onClick={onPrint}
              className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </section>
      </form>

      {worksheetProblems.length > 0 ? (
        <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center">
          <p className="font-semibold text-emerald-900">
            Generated {worksheetProblems.length} problems at {activeLevel?.label}
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Preview below, then print when ready.
          </p>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium text-slate-800">Ready to practice?</p>
          <p className="mt-2 text-sm text-slate-500">
            Start a focus session or generate a printable worksheet.
          </p>
        </section>
      )}

      {worksheetProblems.length > 0 ? (
        <section className="mt-6">
          <div className="math-problems-grid">
            {worksheetProblems.map((problem, index) => (
              <div
                key={index}
                className="math-problem-card bg-white shadow-sm"
              >
                <p className="math-problem-number">#{index + 1}</p>
                <div className="math-problem-body">
                  <pre className="math-problem-text">
                    {formatProblem(problem)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <HubModal
        open={showLevelGuide}
        onClose={() => setShowLevelGuide(false)}
        maxWidth="max-w-lg"
        labelledBy="math-level-guide-title"
      >
        <h2
          id="math-level-guide-title"
          className="text-center text-2xl font-bold text-slate-900"
        >
          Level guide
        </h2>
        <div className="mt-5 space-y-3">
          {MATH_LEVELS.map((entry) => (
            <div
              key={entry.level}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-semibold text-slate-900">{entry.label}</p>
              <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
            </div>
          ))}
        </div>
      </HubModal>
    </div>
  );
}
