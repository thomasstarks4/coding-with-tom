import { useState } from "react";
import { Search } from "lucide-react";
import usePageTitle from "../../design-system/hooks/usePageTitle";
import PageShell from "../../design-system/components/PageShell";
import ProjectCard from "../../design-system/components/ProjectCard";
import EmptyState from "../../design-system/components/EmptyState";
import {
  getFeaturedProjects,
  getListedProjects,
  getProjectsByCategory,
  searchVisibleProjects,
} from "../../config/project-registry";

const TABS = [
  { id: "all", label: "All" },
  { id: "games", label: "Games" },
];

export default function Projects() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  usePageTitle(
    "Projects — Thomas Starks",
    "Web applications, education tools, games, and utilities built by Thomas Starks.",
  );

  const featured = getFeaturedProjects();
  const listed = getListedProjects();

  const filtered =
    tab === "games"
      ? getProjectsByCategory("Games")
      : searchVisibleProjects(query);

  const showFeatured = tab === "all" && !query;
  const showListed = tab === "all" && !query;

  return (
    <PageShell>
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Projects
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Web applications, education tools, games, and utilities I've built and
          shipped.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "all" && (
          <div className="relative max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>
        )}
      </div>

      {showFeatured && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
            Featured
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {showListed && listed.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
            More projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listed.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {!showFeatured && !showListed && (
        <section>
          {filtered.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try a different search term or browse all projects."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      )}
    </PageShell>
  );
}
