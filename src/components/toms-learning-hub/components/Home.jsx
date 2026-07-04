import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-auto bg-slate-50 text-slate-800">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 py-12 sm:py-16">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tom&apos;s Learning Hub
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Reading and writing tools for Grades 1–2. Sentence starters, guided
            writing, and word practice — designed to be simple and engaging.
          </p>
        </header>

        <section className="mt-10 w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-xl font-semibold text-sky-800">How it works</h2>
          <ul className="space-y-4 text-sm leading-6 text-slate-700 sm:text-base">
            <li>
              <strong>Sentence starters</strong> — simple prompts that help
              children understand sentence structure.
            </li>
            <li>
              <strong>Common words</strong> — everyday vocabulary reinforced in
              different contexts.
            </li>
            <li>
              <strong>Interactive tools</strong> — tuners, writers, and
              highlighters to keep practice engaging.
            </li>
          </ul>
        </section>

        <section className="mt-6 w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:mt-8 sm:p-8">
          <h2 className="mb-4 text-xl font-semibold text-sky-800">Why use this</h2>
          <ul className="space-y-4 text-sm leading-6 text-slate-700 sm:text-base">
            <li>
              <strong>Built for young readers</strong> — clear layout, large
              text, kid-friendly interactions.
            </li>
            <li>
              <strong>Builds confidence</strong> — gradual introduction of words
              and sentence patterns.
            </li>
            <li>
              <strong>Printable homework</strong> — generate worksheets for
              practice at home or in class.
            </li>
            <li>
              <strong>For parents and teachers</strong> — supplemental literacy
              resources for Grades 1–2.
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
          <Link
            to="/starter"
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500"
          >
            Start learning
          </Link>
          <Link
            to="/math"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Math worksheets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
