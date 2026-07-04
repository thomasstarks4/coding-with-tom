import { useState } from "react";
import { ChevronDown, Play, RefreshCw } from "lucide-react";
import { PACE_OPTIONS, PRACTICE_SET_SIZE } from "../../data/fluency-samples";

export default function WordHighlighterDashboard({
  customText,
  onCustomTextChange,
  practiceSet,
  paceKey,
  onPaceChange,
  canOpenFocus,
  hasStarted,
  onStartFocus,
  onNewPracticeSet,
}) {
  const [setPreviewOpen, setSetPreviewOpen] = useState(false);

  return (
    <>
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="fluency-text"
          className="block text-sm font-semibold text-slate-800"
        >
          Your sentence (optional)
        </label>
        <p className="mt-1 text-sm text-slate-500">
          Add a custom line to include in the set. Click{" "}
          <strong className="font-semibold text-slate-700">New practice set</strong>{" "}
          to rebuild your {PRACTICE_SET_SIZE} sentences with this line first.
        </p>
        <textarea
          id="fluency-text"
          className="mt-3 min-h-[100px] w-full resize-y rounded-xl border border-slate-300 p-4 text-lg text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          placeholder="Type a sentence to include in the set..."
          value={customText}
          onChange={(event) => onCustomTextChange(event.target.value)}
        />
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Pacing</p>
            <p className="mt-1 text-sm text-slate-500">
              Auto-advance moves to the next word after a short pause.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PACE_OPTIONS).map(([key, option]) => (
              <button
                key={key}
                type="button"
                onClick={() => onPaceChange(key)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  paceKey === key
                    ? "bg-sky-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {practiceSet.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium text-slate-800">No practice set loaded</p>
          <p className="mt-2 text-sm text-slate-500">
            Load a set of sentences to begin.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-sky-700">{practiceSet.length}</span>
              {" sentence"}
              {practiceSet.length === 1 ? "" : "s"} preloaded
            </p>
            <button
              type="button"
              onClick={onNewPracticeSet}
              className="inline-flex min-h-[var(--hub-touch-min)] items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-50 sm:self-center"
            >
              <RefreshCw size={16} />
              New practice set
            </button>
          </div>

          <button
            type="button"
            onClick={onStartFocus}
            disabled={!canOpenFocus}
            className="inline-flex min-h-[var(--hub-focus-action-min,56px)] w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Play size={18} />
            {hasStarted ? "Continue focus session" : "Start focus session"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Fullscreen view shows each sentence with one highlighted word at a time.
          </p>
        </div>
      )}

      {practiceSet.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setSetPreviewOpen((open) => !open)}
            aria-expanded={setPreviewOpen}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
          >
            Practice set preview ({practiceSet.length})
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${
                setPreviewOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {setPreviewOpen ? (
            <ol className="list-decimal border-t border-slate-100 px-4 py-3 pl-8">
              {practiceSet.map((sentence) => (
                <li
                  key={sentence}
                  className="py-1.5 text-sm leading-relaxed text-slate-600"
                >
                  {sentence}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
