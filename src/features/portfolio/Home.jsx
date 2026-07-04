import { useEffect } from "react";
import PageShell from "../../design-system/components/PageShell";
import Button from "../../design-system/components/Button";
import ProjectCard from "../../design-system/components/ProjectCard";
import { getFeaturedProjects } from "../../config/project-registry";

export default function Home() {
  useEffect(() => {
    document.title = "Thomas Starks — Software Developer";
  }, []);

  const featured = getFeaturedProjects().slice(0, 4);

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-sky-400">
          Full-Stack Software Engineer
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Thomas Starks
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-zinc-400 md:text-xl">
          Navy veteran building web applications, education tools, and interactive
          experiences with React, modern JavaScript, and thoughtful UX.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/projects" size="lg">
            View projects
          </Button>
          <Button to="/contact" variant="secondary" size="lg">
            Get in touch
          </Button>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured work</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Selected projects from my portfolio
            </p>
          </div>
          <Button to="/projects" variant="ghost" size="sm" className="hidden sm:inline-flex">
            View all
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
