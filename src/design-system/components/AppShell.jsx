import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Container from "./Container";

export default function AppShell({ title, children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <Container className="flex h-14 items-center gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Projects
          </Link>
          {title && (
            <span className="text-sm font-medium text-zinc-200">{title}</span>
          )}
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
