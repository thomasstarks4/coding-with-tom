import { useState } from "react";
import { ChevronDown, Play, RefreshCw } from "lucide-react";

export default function StarterPracticeDashboard({
  deckLength,
  readCount,
  remainingCount,
  readSentences,
  canOpenFocus,
  hasStarted,
  onStartFocus,
  onNewSet,
}) {
  const [reviewOpen, setReviewOpen] = useState(false);

  if (deckLength === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-medium text-slate-800">
          No sentence starters are selected.
        </p>
        <p className="mt-2 text-slate-600">
          Select at least one sentence pattern above to generate practice
          sentences.
        </p>
      </div>
    );
  }

  const sessionComplete = remainingCount === 0;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Practice</h2>
        <button
          type="button"
          onClick={onNewSet}
          className="inline-flex min-h-[var(--hub-touch-min)] items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 sm:self-center"
        >
          <RefreshCw size={16} />
          New set
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-700">Session progress</p>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-emerald-700">{readCount}</span>
            {" / "}
            <span className="font-semibold text-slate-800">{deckLength}</span>
            {" read"}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
            style={{
              width: deckLength ? `${(readCount / deckLength) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {sessionComplete ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-emerald-900">
              Session complete!
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Every sentence has been read. Start a new set to practice again.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-600">
              <span className="font-semibold text-emerald-700">{readCount}</span>
              {" read · "}
              <span className="font-semibold text-sky-700">{remainingCount}</span>
              {" remaining"}
            </p>
            <button
              type="button"
              onClick={onStartFocus}
              disabled={!canOpenFocus}
              className="inline-flex min-h-[var(--starter-focus-action-min,56px)] w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Play size={18} />
              {hasStarted ? "Continue focus session" : "Start focus session"}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Opens a fullscreen reading view with one sentence at a time for
              your learner.
            </p>
          </>
        )}
      </div>

      {readSentences.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setReviewOpen((open) => !open)}
            aria-expanded={reviewOpen}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
          >
            Review read sentences ({readSentences.length})
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${
                reviewOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {reviewOpen ? (
            <ul className="border-t border-slate-100 px-4 py-3">
              {readSentences.map((sentence) => (
                <li
                  key={sentence}
                  className="border-b border-slate-50 py-2 text-sm leading-relaxed text-slate-700 last:border-0"
                >
                  {sentence}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
