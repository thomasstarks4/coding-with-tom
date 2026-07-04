import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import { useHubProgress } from "../../hooks/useHubProgress";
import {
  PACE_OPTIONS,
  sampleSentences,
} from "../../data/fluency-samples";
import {
  clampWordIndex,
  tokenizeText,
} from "./tokenizeText";

export default function WordHighlighter() {
  const { progress, updateProgress } = useHubProgress();
  const [text, setText] = useState(
    progress.highlighter.lastSentence || sampleSentences[0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paceKey, setPaceKey] = useState("manual");
  const [sessionStarted, setSessionStarted] = useState(false);

  const words = useMemo(() => tokenizeText(text), [text]);
  const currentWord = words[currentIndex] ?? "";
  const isComplete = words.length > 0 && currentIndex >= words.length - 1;
  const pace = PACE_OPTIONS[paceKey];

  useEffect(() => {
    setCurrentIndex(0);
    setSessionStarted(false);
  }, [text]);

  useEffect(() => {
    if (paceKey === "manual" || !sessionStarted || words.length === 0) {
      return undefined;
    }

    if (currentIndex >= words.length - 1) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => clampWordIndex(index + 1, words.length));
    }, pace.ms);

    return () => window.clearTimeout(timer);
  }, [paceKey, pace.ms, sessionStarted, currentIndex, words.length]);

  const persistSentence = useCallback(
    (sentence) => {
      updateProgress({
        highlighter: {
          ...progress.highlighter,
          lastSentence: sentence,
          wordsCompleted: 0,
        },
      });
    },
    [progress.highlighter, updateProgress],
  );

  const handleTextChange = (value) => {
    setText(value);
    persistSentence(value);
  };

  const handleSampleSelect = (sentence) => {
    handleTextChange(sentence);
  };

  const startSession = () => {
    if (words.length === 0) {
      return;
    }
    setCurrentIndex(0);
    setSessionStarted(true);
  };

  const goNext = () => {
    if (words.length === 0) {
      return;
    }
    setSessionStarted(true);
    setCurrentIndex((index) => clampWordIndex(index + 1, words.length));
    if (currentIndex + 1 >= words.length) {
      updateProgress({
        highlighter: {
          ...progress.highlighter,
          lastSentence: text,
          wordsCompleted: words.length,
        },
      });
    }
  };

  const repeatWord = () => {
    setSessionStarted(true);
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setSessionStarted(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-1 sm:px-0">
      <HubToolPageHeader toolId="highlighter" />

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
          onChange={(event) => handleTextChange(event.target.value)}
        />

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-700">Sample sentences</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleSentences.map((sentence) => (
              <button
                key={sentence}
                type="button"
                onClick={() => handleSampleSelect(sentence)}
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
                onClick={() => setPaceKey(key)}
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

      {words.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium text-slate-800">
            Enter a sentence to begin
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Pick a sample sentence or type your own above.
          </p>
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {!sessionStarted ? (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                {words.length} word{words.length === 1 ? "" : "s"} ready
              </p>
              <button
                type="button"
                onClick={startSession}
                className="mt-4 inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
              >
                Start fluency practice
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">
                  Word {currentIndex + 1} of {words.length}
                </p>
                <p className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  {currentWord}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((index) => clampWordIndex(index - 1, words.length))
                  }
                  disabled={currentIndex === 0}
                  className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={repeatWord}
                  className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
                >
                  <RotateCcw size={16} />
                  Repeat
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={resetSession}
                  className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              {isComplete ? (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center">
                  <p className="font-semibold text-emerald-900">
                    Sentence complete!
                  </p>
                  <p className="mt-1 text-sm text-emerald-800">
                    Nice reading. Try another sentence or reset to practice again.
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      index === currentIndex
                        ? "bg-sky-600 text-white"
                        : index < currentIndex
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
