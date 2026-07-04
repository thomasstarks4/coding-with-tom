import { Link } from "react-router-dom";
import HubPageHeader from "../layout/HubPageHeader";
import HubToolCard from "../layout/HubToolCard";
import { hubTools } from "../data/hub-tools";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <HubPageHeader
        title="Tom's Learning Hub"
        subtitle="Reading and writing tools for Grades 1–2 — built for parents and teachers running short, focused practice sessions."
      />

      <section className="rounded-xl border border-sky-200 bg-sky-50 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-sky-900">
          Recommended first session
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-sky-800 sm:text-base">
          For reading practice, start in{" "}
          <Link to="/tuner" className="font-semibold underline">
            Sentence Tuner
          </Link>{" "}
          and pick a handful of starters that fit your learner. Then open{" "}
          <Link to="/starter" className="font-semibold underline">
            Sentence Starter
          </Link>{" "}
          and work through the set together for about 10 minutes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/tuner"
            className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Open Sentence Tuner
          </Link>
          <Link
            to="/starter"
            className="inline-flex min-h-[var(--hub-touch-min)] items-center rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
          >
            Open Sentence Starter
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">Tools</h2>
        <p className="mb-4 text-sm text-slate-600 sm:text-base">
          Each tool below includes a short guide for parents and teachers. Pick
          one, work with your learner, and keep sessions to about 5–15 minutes.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {hubTools.map((tool) => (
            <HubToolCard key={tool.to} {...tool} />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          For educators
        </h2>
        <ul className="space-y-3 text-sm leading-6 text-slate-600 sm:text-base">
          <li>
            <strong className="text-slate-800">Reading path:</strong> Sentence
            Tuner → Sentence Starter → Word Highlighter for harder words.
          </li>
          <li>
            <strong className="text-slate-800">Writing path:</strong> Writer&apos;s
            Might for prompts and printable lined pages.
          </li>
          <li>
            <strong className="text-slate-800">Math path:</strong> Math
            Worksheets for leveled addition and subtraction printouts.
          </li>
        </ul>
      </section>
    </div>
  );
}
