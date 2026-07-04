import usePageTitle from "../../design-system/hooks/usePageTitle";
import PageShell from "../../design-system/components/PageShell";
import Button from "../../design-system/components/Button";
import ProjectCard from "../../design-system/components/ProjectCard";
import Section from "../../design-system/components/Section";
import { getFeaturedProjects } from "../../config/project-registry";

export default function Home() {
  usePageTitle(
    "Thomas Starks — Software Developer",
    "Portfolio of Thomas Starks — full-stack engineer building web apps, education tools, and games.",
  );

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

      <Section
        title="Featured work"
        subtitle="Selected projects from my portfolio"
        className="mt-20"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button to="/projects" variant="ghost" size="sm">
            View all projects
          </Button>
        </div>
      </Section>
    </PageShell>
  );
}
