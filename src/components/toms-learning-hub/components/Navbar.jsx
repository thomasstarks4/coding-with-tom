import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/toms-learning-hub-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Close the menu when a link is clicked (mobile)
  const handleNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-500 shadow-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 transition-all duration-300 motion-reduce:transition-none"
        aria-label="Primary"
      >
        {/* Logo / Brand */}
        <div className="flex items-center">
          <Link
            to="/sentence-starters"
            className="flex flex-col items-center text-white no-underline"
            onClick={handleNavClick}
          >
            <img
              src={logo}
              alt="Tom's Learning Hub logo"
              className="mb-1 h-10 w-auto"
            />
            <span className="text-xl font-bold sm:text-2xl">
              Tom&apos;s Learning Hub
            </span>
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500 lg:hidden"
          aria-controls="primary-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {/* Icon */}
          <svg
            className={`h-6 w-6 transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {/* Close Icon */}
          <svg
            className={`-ml-6 h-6 w-6 transition-opacity duration-200 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M6 6l12 12M18 6l-12 12"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-6 lg:flex">
          <li>
            <Link
              to="/sentence-starters"
              className="text-white transition-colors hover:text-teal-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/tuner"
              className="text-white transition-colors hover:text-teal-300"
            >
              Sentence Tuner
            </Link>
          </li>
          <li>
            <Link
              to="/starter"
              className="text-white transition-colors hover:text-teal-300"
            >
              Sentence Starter
            </Link>
          </li>
          <li>
            <Link
              to="/writer"
              className="text-white transition-colors hover:text-teal-300"
            >
              Writer&apos;s Might
            </Link>
          </li>
          <li>
            <Link
              to="/highlighter"
              className="text-white transition-colors hover:text-teal-300"
            >
              Word Highlighter
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-white transition-colors hover:text-teal-300"
            >
              Back To My Portfolio
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu (collapsible) */}
      <div
        id="primary-menu"
        className={`
          lg:hidden
          overflow-hidden
          transition-[max-height,opacity]
          duration-300 ease-in-out motion-reduce:transition-none
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul className="flex flex-col items-stretch bg-blue-500 px-4 pb-4 pt-2">
          <li className="py-2 text-center">
            <Link
              to="/sentence-starters"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Home
            </Link>
          </li>
          <li className="py-2 text-center">
            <Link
              to="/tuner"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Sentence Tuner
            </Link>
          </li>
          <li className="py-2 text-center">
            <Link
              to="/starter"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Sentence Starter
            </Link>
          </li>
          <li className="py-2 text-center">
            <Link
              to="/writer"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Writer&apos;s Might
            </Link>
          </li>
          <li className="py-2 text-center">
            <Link
              to="/highlighter"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Word Highlighter
            </Link>
          </li>
          <li className="py-2 text-center">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
              onClick={handleNavClick}
            >
              Back To My Portfolio
            </Link>
          </li>
        </ul>
      </div>

      {/* Motion preference: optional helper for people who prefer less motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
