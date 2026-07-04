import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Container from "./Container";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white"
        >
          Thomas Starks
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label }) => {
            const active = pathname === to || (to === "/projects" && pathname === "/apps");
            return (
              <Link
                key={to}
                to={to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {open && (
        <nav className="border-t border-zinc-800 px-4 py-3 md:hidden">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
