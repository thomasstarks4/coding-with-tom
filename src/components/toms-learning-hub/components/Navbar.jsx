import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../images/toms-learning-hub-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the menu when a link is clicked (mobile)
  const handleNavClick = () => setOpen(false);

  const navItems = [
    { to: "/sentence-starters", label: "Home" },
    { to: "/tuner", label: "Sentence Tuner" },
    { to: "/starter", label: "Sentence Starter" },
    { to: "/writer", label: "Writer's Might" },
    { to: "/highlighter", label: "Word Highlighter" },
    { to: "/", label: "Back To Portfolio", special: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg backdrop-blur-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 transition-all duration-300"
        aria-label="Primary"
      >
        {/* Logo / Brand */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/sentence-starters"
            className="flex flex-col items-center text-white no-underline"
            onClick={handleNavClick}
          >
            <motion.img
              src={logo}
              alt="Tom's Learning Hub logo"
              className="mb-1 h-12 w-auto drop-shadow-lg"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="text-xl font-bold sm:text-2xl bg-gradient-to-r from-white to-cyan-200 text-transparent bg-clip-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tom&apos;s Learning Hub
            </motion.span>
          </Link>
        </motion.div>

        {/* Hamburger (mobile) */}
        <motion.button
          type="button"
          className="ml-2 inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-500 lg:hidden backdrop-blur-sm"
          aria-controls="primary-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="sr-only">Toggle navigation</span>
          <motion.div
            animate={open ? "open" : "closed"}
            className="relative h-6 w-6"
          >
            {/* Hamburger to X animation */}
            <motion.span
              className="absolute left-0 top-1 h-0.5 w-6 bg-white rounded-full"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 },
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-3.5 h-0.5 w-6 bg-white rounded-full"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 bottom-1 h-0.5 w-6 bg-white rounded-full"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 },
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.button>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, index) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.to}
                className="relative px-4 py-2 text-white font-medium transition-colors group"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.span>

                {/* Active indicator */}
                {isActive(item.to) && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-lg"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover underline effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu (collapsible) with AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="primary-menu"
            className="lg:hidden overflow-hidden bg-gradient-to-b from-blue-600 to-indigo-700 border-t border-white/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.ul
              className="flex flex-col items-stretch px-4 pb-4 pt-2"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.1,
                  },
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.to}
                  className="py-2"
                  variants={{
                    open: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        y: { stiffness: 1000, velocity: -100 },
                      },
                    },
                    closed: {
                      y: 20,
                      opacity: 0,
                      transition: {
                        y: { stiffness: 1000 },
                      },
                    },
                  }}
                >
                  <Link
                    to={item.to}
                    className={`block rounded-lg px-4 py-3 text-center text-white font-medium transition-all ${
                      isActive(item.to)
                        ? "bg-white/25 shadow-lg"
                        : "hover:bg-white/10"
                    }`}
                    onClick={handleNavClick}
                  >
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
