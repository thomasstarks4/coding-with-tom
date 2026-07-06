import { ATTEMPT_MODE_OPTIONS } from "./math-quiz-explanations";

export default function MathQuizAttemptModePicker({ value, onChange }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Attempt mode</h2>
      <p className="mt-1 text-sm text-slate-600">
        Choose how wrong answers work before your learner starts.
      </p>

      <div className="mt-4 space-y-3">
        {ATTEMPT_MODE_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`block cursor-pointer rounded-xl border p-4 transition-colors ${
              value === option.id
                ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                : "border-slate-200 bg-white hover:border-sky-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="attemptMode"
                value={option.id}
                checked={value === option.id}
                onChange={() => onChange(option.id)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              <span>
                <span className="block font-semibold text-slate-900">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-slate-600">
                  {option.description}
                </span>
              </span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
