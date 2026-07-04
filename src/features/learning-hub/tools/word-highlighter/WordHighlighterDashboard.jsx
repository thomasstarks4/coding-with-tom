import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { PACE_OPTIONS, sampleSentences } from "../../data/fluency-samples";

export default function WordHighlighterDashboard({
  text,
  onTextChange,
  paceKey,
  onPaceChange,
  wordCount,
  canOpenFocus,
  hasStarted,
  onStartFocus,
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="fluency-text"
          className="block text-sm font-semibold text-slate-800"
        >
          Practice sentence
        </label>
        <textarea
          id="fluency-text"
          className="mt-3 min-h-[120px] w-full resize-y rounded-xl border border-slate-300 p-4 text-lg text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          placeholder="Type or paste a sentence here..."
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
        />

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-700">Sample sentences</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleSentences.map((sentence) => (
              <button
                key={sentence}
                type="button"
                onClick={() => onTextChange(sentence)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  text === sentence
                    ? "border-sky-400 bg-sky-50 text-sky-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"
                }`}
              >
                {sentence}
              </button>
            ))}
          </div>
        </div>
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

      {wordCount === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium text-slate-800">Enter a sentence to begin</p>
          <p className="mt-2 text-sm text-slate-500">
            Pick a sample sentence or type your own above.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-slate-600">
            <span className="font-semibold text-sky-700">{wordCount}</span>
            {" word"}
            {wordCount === 1 ? "" : "s"} ready
          </p>
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
            Opens a fullscreen word-by-word view for your learner.
          </p>
        </div>
      )}

      {text.trim() ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setPreviewOpen((open) => !open)}
            aria-expanded={previewOpen}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
          >
            Sentence preview
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${
                previewOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {previewOpen ? (
            <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
              {text}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
