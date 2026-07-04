import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed } from "lucide-react";

export default function StarterDeckContainer({
  title,
  description,
  position,
  count,
  children,
  emptyMessage,
}) {
  const isTop = position === "top";

  return (
    <section
      className={`overflow-hidden rounded-2xl border shadow-sm ${
        isTop
          ? "border-sky-200 bg-white"
          : "border-emerald-200 bg-white"
      }`}
      aria-label={title}
    >
      <header
        className={`flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
          isTop
            ? "border-sky-100 bg-gradient-to-r from-sky-50 to-white"
            : "border-emerald-100 bg-gradient-to-r from-emerald-50 to-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isTop ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isTop ? <CircleDashed size={18} /> : <CheckCircle2 size={18} />}
          </span>
          <div>
            <h2
              className={`text-lg font-semibold tracking-tight ${
                isTop ? "text-sky-900" : "text-emerald-900"
              }`}
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <span
          className={`inline-flex min-h-8 items-center self-start rounded-full px-3.5 text-sm font-semibold sm:self-center ${
            isTop
              ? "bg-sky-100 text-sky-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {count}
        </span>
      </header>

      <div className="p-5 sm:p-6">
        {count === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm leading-relaxed text-slate-500">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function StarterSentenceCard({ card, onClick }) {
  return (
    <motion.button
      type="button"
      layout
      layoutId={card.id}
      onClick={() => onClick(card.id)}
      className="group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      whileTap={{ scale: 0.98 }}
    >
      <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
        {card.sentence}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-500 group-hover:text-sky-700">
        Tap or click to check reading
      </p>
    </motion.button>
  );
}

export function StarterReadCard({ card }) {
  return (
    <motion.div
      layout
      layoutId={card.id}
      className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm"
    >
      <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
        {card.sentence}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <CheckCircle2 size={14} />
        Read successfully
      </p>
    </motion.div>
  );
}
