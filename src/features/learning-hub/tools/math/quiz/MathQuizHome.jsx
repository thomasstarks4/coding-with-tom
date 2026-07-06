import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import HubToolPageHeader from "../../../layout/HubToolPageHeader";
import { MATH_LEVELS } from "../generateProblems";
import MathQuizAttemptModePicker from "./MathQuizAttemptModePicker";
import {
  MATH_QUIZ_CUSTOM_MAX,
  MATH_QUIZ_CUSTOM_MIN,
  MATH_QUIZ_PRESETS,
} from "./math-quiz-presets";

export default function MathQuizHome({
  attemptMode,
  onAttemptModeChange,
  customLevel,
  onCustomLevelChange,
  customCount,
  onCustomCountChange,
  onStartPreset,
  onStartCustom,
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-1 sm:px-0">
      <HubToolPageHeader
        toolId="math-quiz"
        guideFooter={
          <Link
            to="/math"
            className="text-sm font-semibold text-sky-700 underline hover:text-sky-800"
          >
            Need a printable worksheet?
          </Link>
        }
      />

      <div className="space-y-6">
        <MathQuizAttemptModePicker
          value={attemptMode}
          onChange={onAttemptModeChange}
        />

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Predefined tests
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick a ready-made quiz and start right away.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MATH_QUIZ_PRESETS.map((preset) => (
              <div key={preset.id} className="math-quiz-preset-card">
                <p className="font-semibold text-slate-900">{preset.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {preset.description}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-sky-700">
                  {preset.count} problems · Level {preset.level}
                </p>
                <button
                  type="button"
                  onClick={() => onStartPreset(preset)}
                  className="mt-4 inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  <Play size={16} />
                  Start test
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Build your own
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose a level and how many problems to include ({MATH_QUIZ_CUSTOM_MIN}
            –{MATH_QUIZ_CUSTOM_MAX}).
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {MATH_LEVELS.map((entry) => (
              <button
                key={entry.level}
                type="button"
                onClick={() => onCustomLevelChange(entry.level)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  customLevel === entry.level
                    ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                    : "border-slate-200 bg-white hover:border-sky-300"
                }`}
              >
                <p className="font-semibold text-slate-900">{entry.label}</p>
                <p className="mt-1 text-sm text-slate-600">{entry.range}</p>
              </button>
            ))}
          </div>

          <label
            htmlFor="customQuizCount"
            className="mt-5 block text-sm font-semibold text-slate-900"
          >
            Number of problems
          </label>
          <input
            id="customQuizCount"
            type="number"
            min={MATH_QUIZ_CUSTOM_MIN}
            max={MATH_QUIZ_CUSTOM_MAX}
            value={customCount}
            onChange={(event) => onCustomCountChange(event.target.value)}
            className="mt-2 w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-center text-xl font-semibold text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          <button
            type="button"
            onClick={onStartCustom}
            className="mt-5 inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            <Play size={16} />
            Generate and start
          </button>
        </section>
      </div>
    </div>
  );
}
