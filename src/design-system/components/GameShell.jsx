import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function GameShell({ title, children }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center p-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-zinc-700/80 bg-zinc-950/85 px-3 py-1.5 text-sm shadow-lg backdrop-blur-md">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Projects
          </Link>
          {title && (
            <>
              <span className="text-zinc-600">|</span>
              <span className="font-medium text-zinc-300">{title}</span>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
