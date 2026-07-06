import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { countShownStarters } from "./countShownStarters";

export default function TunerPanel({
  starters,
  setStarters,
  lastSaved,
  expanded,
  onExpandedChange,
  collapsible = true,
}) {
  const entries = useMemo(() => Object.entries(starters), [starters]);
  const total = entries.length;
  const selected = countShownStarters(starters);
  const panelId = "configure-panel";

  const handleCheckboxChange = (key) => {
    setStarters((prev) => ({
      ...prev,
      [key]: { ...prev[key], isShown: !prev[key].isShown },
    }));
  };

  const selectAll = () => {
    setStarters((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, starter]) => [
          key,
          { ...starter, isShown: true },
        ]),
      ),
    );
  };

  const clearAll = () => {
    setStarters((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, starter]) => [
          key,
          { ...starter, isShown: false },
        ]),
      ),
    );
  };

  const showBody = !collapsible || expanded;

  return (
    <section id="configure" aria-label="Configure starters">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {collapsible ? (
              <button
                type="button"
                onClick={() => onExpandedChange(!expanded)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-sky-700 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Configure starters
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-600">
                    <span className="font-semibold text-sky-700">{selected}</span>
                    <span className="text-slate-400"> / {total}</span>
                    {" selected"}
                    {lastSaved ? (
                      <span className="ml-2 text-emerald-700">· Saved</span>
                    ) : null}
                  </p>
                </div>
              </button>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Configure starters
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  <span className="font-semibold text-sky-700">{selected}</span>
                  <span className="text-slate-400"> / {total}</span>
                  {" selected"}
                </p>
              </div>
            )}
          </div>

          {showBody ? (
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={selectAll}
                className="rounded-lg border border-sky-300 px-4 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Clear All
              </button>
            </div>
          ) : null}
        </div>

        {showBody ? (
          <div id={panelId} className="p-5 sm:p-6">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row">
              <div className="w-full text-center sm:text-left">
                <div className="mb-1 text-sm text-slate-600">Selection progress</div>
                <div className="text-2xl font-bold">
                  <span className="text-sky-600">{selected}</span>
                  <span className="text-slate-400"> / {total}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-300"
                    style={{
                      width: total ? `${(selected / total) * 100}%` : "0%",
                    }}
                  />
                </div>
                {lastSaved ? (
                  <p className="mt-2 text-xs text-emerald-700" aria-live="polite">
                    Saved
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3">
              {entries.map(([key, starter]) => (
                <div
                  key={key}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-2 p-4 transition-colors ${
                    starter.isShown
                      ? "border-sky-200 bg-sky-50 hover:border-sky-300"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                  onClick={() => handleCheckboxChange(key)}
                >
                  <div className="flex w-full flex-1 items-center gap-3 md:gap-4">
                    <input
                      id={`checkbox-${key}`}
                      type="checkbox"
                      checked={starter.isShown}
                      onChange={() => handleCheckboxChange(key)}
                      className="h-6 w-6 cursor-pointer rounded accent-sky-600"
                      onClick={(event) => event.stopPropagation()}
                    />
                    <label
                      htmlFor={`checkbox-${key}`}
                      className="flex-1 cursor-pointer text-left text-base font-medium text-slate-800 sm:text-lg"
                    >
                      {starter.text}
                    </label>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:text-sm">
                    {starter.partnerType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}