import { useEffect } from "react";
import PageShell from "../../design-system/components/PageShell";
import Card from "../../design-system/components/Card";
import Tag from "../../design-system/components/Tag";

const skills = {
  Languages: ["JavaScript", "TypeScript", "C#", "PHP", "SQL", "GDScript"],
  Frontend: ["React", "Tailwind CSS", "Bootstrap", "HTML/CSS", "Framer Motion"],
  Backend: ["VB.NET", "PHP", "MySQL", "SQL Server", "REST APIs"],
  Tools: ["Git", "Postman", "Vite", "Godot", "Aseprite"],
};

export default function About() {
  useEffect(() => {
    document.title = "About — Thomas Starks";
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          About
        </h1>
        <p className="mb-10 text-lg text-zinc-400">
          Navy veteran and full-stack engineer with 3+ years building web apps
          and games.
        </p>

        <div className="space-y-6">
          <Card>
            <p className="leading-relaxed text-zinc-300">
              I'm <strong className="text-white">Thomas Starks</strong>, a
              Full-Stack Software Engineer with experience across insurance,
              watersports, and AI-assisted development. I build with React,
              JavaScript, C#, PHP, and SQL — focusing on responsive UIs, solid
              APIs, and maintainable code.
            </p>
          </Card>

          <Card>
            <p className="leading-relaxed text-zinc-300">
              At IMT Insurance I modernized legacy systems and improved API
              performance. At Makai Watersports I built React frontends with
              robust form validation and optimized SQL backends. I also develop
              games in Godot and ship web tools like{" "}
              <a
                href="https://www.myrepbro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300"
              >
                MyRepBro
              </a>{" "}
              and Tom's Learning Hub for elementary education.
            </p>
          </Card>

          <Card>
            <p className="leading-relaxed text-zinc-300">
              My Navy service instilled the discipline and leadership I bring to
              every project. I approach software with the same precision I
              applied managing electrical safety programs — shipping reliable,
              user-focused solutions.
            </p>
          </Card>
        </div>

        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-white">Skills</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(skills).map(([group, items]) => (
              <Card key={group}>
                <h3 className="mb-3 text-sm font-medium text-zinc-400">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
