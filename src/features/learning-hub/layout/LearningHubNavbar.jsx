import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../../components/toms-learning-hub/images/toms-learning-hub-logo.png";

const navItems = [
  { to: "/sentence-starters", label: "Home" },
  { to: "/starter", label: "Sentence Starter" },
  { to: "/writer", label: "Writer's Might" },
  { to: "/highlighter", label: "Word Highlighter" },
  { to: "/math", label: "Math Worksheets" },
  { to: "/projects", label: "Back to Portfolio", special: true },
];

export default function LearningHubNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => setOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="hub-no-print sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Learning Hub"
      >
        <Link
          to="/sentence-starters"
          className="flex min-h-[var(--hub-touch-min)] items-center gap-3 no-underline"
          onClick={handleNavClick}
        >
          <img src={logo} alt="Tom's Learning Hub" className="h-10 w-auto" />
          <span className="hidden text-sm font-semibold text-slate-800 sm:inline">
            Tom&apos;s Learning Hub
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, special }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                special
                  ? "text-sky-700 hover:bg-sky-50"
                  : isActive(to)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <nav className="border-t border-slate-200 px-4 py-2 md:hidden">
          {navItems.map(({ to, label, special }) => (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              className={`block min-h-[var(--hub-touch-min)] rounded-md px-3 py-2 text-sm font-medium ${
                special ? "text-sky-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
