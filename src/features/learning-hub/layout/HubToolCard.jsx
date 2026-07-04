import { Link } from "react-router-dom";

export default function HubToolCard({
  to,
  title,
  summary,
  detail,
  bestFor,
  cta = "Open tool",
}) {
  return (
    <Link
      to={to}
      className="hub-tool-card flex min-h-[var(--hub-touch-min)] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50/40 no-underline"
    >
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
        {summary}
      </p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{detail}</p>
      {bestFor ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
          Best for: {bestFor}
        </p>
      ) : null}
      <span className="mt-4 text-sm font-semibold text-sky-700">{cta} →</span>
    </Link>
  );
}
