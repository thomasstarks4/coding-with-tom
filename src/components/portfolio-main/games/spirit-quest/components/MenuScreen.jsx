// ============================================================
// MenuScreen — title, new/continue, settings
// ============================================================

import React from "react";
import { motion } from "framer-motion";

export default function MenuScreen({ onNewGame, onContinue, hasSave, onClearSave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      {/* Title */}
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-red-500 drop-shadow-lg">
          Spirit Quest
        </h1>
        <p className="text-lg lg:text-xl 2xl:text-2xl text-fuchsia-300 mt-2 lg:mt-3 tracking-widest uppercase">
          Spirit Sword
        </p>
      </div>

      {/* Decorative spirit energy pulse */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl lg:text-7xl 2xl:text-8xl"
      >
        ⚔️
      </motion.div>

      {/* Action buttons */}
      <div className="space-y-3 lg:space-y-4 max-w-xs lg:max-w-sm 2xl:max-w-md mx-auto">
        {hasSave && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full py-3 lg:py-4 2xl:py-5 rounded-xl font-bold text-lg lg:text-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border border-cyan-400/30 transition-all"
          >
            Continue
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewGame}
          className="w-full py-3 lg:py-4 2xl:py-5 rounded-xl font-bold text-lg lg:text-xl bg-gradient-to-r from-fuchsia-700 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-500 border border-fuchsia-400/30 transition-all"
        >
          New Game
        </motion.button>
        {hasSave && (
          <button
            onClick={onClearSave}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors mt-2"
          >
            Delete Save Data
          </button>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-6">
        Turn-Based RPG &bull; React &bull; Tailwind &bull; Framer Motion
      </p>
    </motion.div>
  );
}
