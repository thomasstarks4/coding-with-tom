import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Container from "./Container";

export default function TpcLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Projects
            </Link>
            <span className="text-sm font-medium text-zinc-200">{title}</span>
          </div>
          <nav className="flex gap-1 text-sm">
            <Link
              to="/tpc/home"
              className="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/tpc/chat"
              className="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Chat
            </Link>
            <Link
              to="/tpc/about"
              className="rounded-md px-3 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Privacy
            </Link>
          </nav>
        </Container>
      </header>
      <main className="py-10">
        <Container className="max-w-2xl">{children}</Container>
      </main>
    </div>
  );
}
