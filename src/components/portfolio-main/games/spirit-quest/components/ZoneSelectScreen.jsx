// ============================================================
// ZoneSelectScreen — pick a battle zone
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { ZONES, BATTLE_MODIFIERS } from "../constants";

export default function ZoneSelectScreen({
  playerLevel,
  highestZone,
  selectedModifier,
  onSelectModifier,
  onSelectZone,
  onBack,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          ← Back
        </button>
        <h2 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Choose Destination
        </h2>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* Battle modifier toggle */}
      <div className="flex justify-center gap-2">
        {Object.entries(BATTLE_MODIFIERS).map(([key, mod]) => (
          <button
            key={key}
            onClick={() => onSelectModifier(key)}
            className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-bold uppercase tracking-wide border transition-all ${
              selectedModifier === key
                ? key === "nightmare"
                  ? "border-red-500 text-red-400 bg-red-500/10"
                  : key === "trial"
                  ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                : "border-gray-700 text-gray-500 hover:border-gray-500"
            }`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* Zone list */}
      <div className="space-y-3">
        {ZONES.map((zone, idx) => {
          const unlocked = playerLevel >= zone.unlockLevel;

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: unlocked ? 1 : 0.4, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              {unlocked ? (
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectZone(zone.id)}
                  className={`w-full text-left p-4 lg:p-5 2xl:p-6 rounded-2xl border border-gray-700/50 bg-gradient-to-r ${zone.color} bg-opacity-20 backdrop-blur-sm relative overflow-hidden group`}
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${zone.color} opacity-5 group-hover:opacity-15 transition-opacity duration-300 rounded-2xl`} />
                  <div className="relative flex items-center gap-4">
                    <span className="text-3xl lg:text-4xl">{zone.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {zone.name}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-400">
                        Level {zone.levelRange[0]}–{zone.levelRange[1]}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              ) : (
                <div className="w-full text-left p-4 rounded-2xl border border-gray-800/30 bg-gray-900/30 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl opacity-30">{zone.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-gray-600 line-through">{zone.name}</h3>
                      <p className="text-xs text-gray-700">Unlocks at Level {zone.unlockLevel}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-gray-700 uppercase tracking-wider">🔒 Locked</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
