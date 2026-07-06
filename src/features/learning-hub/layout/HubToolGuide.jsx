import { ChevronDown } from "lucide-react";
import { getToolGuide } from "../data/tool-guides";
import { useToolGuide } from "../hooks/useToolGuide";

export default function HubToolGuide({ toolId, footer }) {
  const guide = getToolGuide(toolId);
  const { isExpanded, toggle, dismiss } = useToolGuide(toolId);

  if (!guide) {
    return null;
  }

  const toggleId = `hub-tool-guide-toggle-${toolId}`;
  const panelId = `hub-tool-guide-panel-${toolId}`;

  return (
    <div className="hub-no-print mt-4">
      <button
        id={toggleId}
        type="button"
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-sky-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:bg-sky-50"
      >
        <span className="text-sm font-semibold text-sky-900">
          How to use {guide.title}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-sky-700 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={toggleId}
          className="mt-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 sm:px-5 sm:py-5"
        >
          <p className="text-sm font-medium leading-6 text-slate-800">
            {guide.summary}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{guide.detail}</p>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sky-700">
            Best for: {guide.bestFor}
          </p>

          {footer ? <div className="mt-4">{footer}</div> : null}

          <button
            type="button"
            onClick={dismiss}
            className="mt-4 inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Got it
          </button>
        </div>
      ) : null}
    </div>
  );
}
