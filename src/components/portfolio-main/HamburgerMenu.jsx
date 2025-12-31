import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function HamburgerMenu({ showMenu, onClose }) {
  const location = useLocation();

  const menuItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/about", label: "About", icon: "👤" },
    { to: "/apps", label: "Applications", icon: "💼" },
    { to: "/contact", label: "Contact", icon: "📧" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {showMenu && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

            {/* Menu content */}
            <div className="relative h-full flex flex-col justify-center items-center p-8">
              {/* Brand/Logo area */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text text-center">
                  Coding With Tom
                </h2>
              </motion.div>

              {/* Menu items */}
              <motion.ul
                className="flex flex-col gap-4 w-full"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.2,
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
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.to}
                    variants={{
                      open: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          y: { stiffness: 1000, velocity: -100 },
                        },
                      },
                      closed: {
                        y: 50,
                        opacity: 0,
                        transition: {
                          y: { stiffness: 1000 },
                        },
                      },
                    }}
                    className="relative"
                  >
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="block w-full"
                    >
                      <motion.div
                        className={`relative px-8 py-5 rounded-xl text-left overflow-hidden group ${
                          isActive(item.to)
                            ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-2 border-cyan-500/50"
                            : "bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-500/50"
                        }`}
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                        <div className="relative flex items-center gap-4">
                          <span className="text-3xl">{item.icon}</span>
                          <span className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </span>
                        </div>

                        {/* Active indicator */}
                        {isActive(item.to) && (
                          <motion.div
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400"
                            layoutId="activeIndicator"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Footer text */}
              <motion.div
                className="mt-auto pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-slate-400 text-sm text-center">
                  Full-Stack Developer & Game Creator
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default HamburgerMenu;
