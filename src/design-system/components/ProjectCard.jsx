import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import Card from "./Card";
import Tag from "./Tag";

export default function ProjectCard({ project }) {
  const { path, label, description, category, external, tech } = project;
  const inner = (
    <Card className="group flex h-full flex-col transition-colors hover:border-zinc-700 hover:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white">
          {label}
        </h3>
        {external ? (
          <ExternalLink size={16} className="shrink-0 text-zinc-500" />
        ) : (
          <ArrowRight
            size={16}
            className="shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-400"
          />
        )}
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{category}</Tag>
        {tech.slice(0, 3).map((t) => (
          <Tag key={t} className="text-zinc-500">
            {t}
          </Tag>
        ))}
      </div>
    </Card>
  );

  if (external) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link to={path} className="block h-full">
      {inner}
    </Link>
  );
}
