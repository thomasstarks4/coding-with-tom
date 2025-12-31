import { motion } from "framer-motion";

function HamburgerButton({ showMenu, onClick }) {
  const handleClick = () => {
    onClick();
  };

  return (
    <nav className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={handleClick}
        className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg hover:shadow-xl border border-slate-700/50 backdrop-blur-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
        aria-expanded={showMenu}
      >
        <div className="relative h-6 w-6">
          {/* Top line */}
          <motion.span
            className="absolute left-0 h-0.5 w-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            animate={{
              rotate: showMenu ? 45 : 0,
              y: showMenu ? 8 : 0,
              scaleX: showMenu ? 1 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ top: 0 }}
          />
          
          {/* Middle line */}
          <motion.span
            className="absolute left-0 top-2.5 h-0.5 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{
              opacity: showMenu ? 0 : 1,
              scaleX: showMenu ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Bottom line */}
          <motion.span
            className="absolute left-0 h-0.5 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"
            animate={{
              rotate: showMenu ? -45 : 0,
              y: showMenu ? -8 : 0,
              scaleX: showMenu ? 1 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ bottom: 0 }}
          />
        </div>
        
        {/* Animated ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-cyan-400"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.2, opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </nav>
  );
}

export default HamburgerButton;
