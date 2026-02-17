// ============================================================
// ResultScreen — Victory / Defeat / XP gain / Loot reveal
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PATHS, RARITIES } from "../constants";
import { XpBar } from "./HpBar";

export default function ResultScreen({
  outcome,          // "victory" | "defeat"
  enemyName,
  xpGained,
  goldGained,
  shardsGained,
  lootItems,        // array of item objects
  levelsGained,
  statGains,
  newSkills,
  player,           // updated player after XP/loot
  onContinue,       // returns to hub
}) {
  const [lootRevealed, setLootRevealed] = useState(0);
  const won = outcome === "victory";

  // Reveal loot items one by one
  const revealNext = () => {
    if (lootRevealed < (lootItems?.length || 0)) {
      setLootRevealed((v) => v + 1);
    }
  };

  const allRevealed = lootRevealed >= (lootItems?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5 lg:space-y-6 max-w-md lg:max-w-lg 2xl:max-w-xl mx-auto"
    >
      {/* Result header */}
      <motion.div
        animate={{ rotate: won ? [0, 8, -8, 0] : [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl"
      >
        {won ? "🏆" : "💀"}
      </motion.div>

      <h2 className={`text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold ${won ? "text-yellow-300" : "text-red-500"}`}>
        {won ? "VICTORY" : "DEFEAT"}
      </h2>

      <p className="text-gray-400 text-sm lg:text-base">
        {won
          ? `You defeated ${enemyName}!`
          : `${enemyName} has bested you... Train harder, channeler.`}
      </p>

      {/* Rewards (victory only) */}
      {won && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 lg:space-y-5 text-left bg-gray-800/50 rounded-xl p-4 lg:p-5 2xl:p-6 border border-gray-700/50"
        >
          {/* XP */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>XP Gained: +{xpGained}</span>
              <span>Lv.{player.level} ({player.xp}/{player.xpToNext})</span>
            </div>
            <XpBar current={player.xp} max={player.xpToNext} />
          </div>

          {/* Level up notification */}
          {levelsGained > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3"
            >
              <p className="text-yellow-300 font-bold text-sm">
                🎉 Level Up! (+{levelsGained})
              </p>
              {statGains && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(statGains).map(([stat, val]) => val > 0 && (
                    <span key={stat} className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800/40">
                      +{val} {stat.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
              {newSkills?.length > 0 && (
                <div className="mt-2">
                  <p className="text-fuchsia-300 text-xs font-bold">New Skills Unlocked:</p>
                  {newSkills.map((skill) => (
                    <p key={skill.id} className="text-fuchsia-200 text-xs mt-1">
                      ✨ {skill.name} — {skill.desc}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Currency */}
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-400">💰 +{goldGained} Gold</span>
            <span className="text-purple-400">💎 +{shardsGained} Shards</span>
          </div>

          {/* Loot */}
          {lootItems && lootItems.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Loot Drops</p>
              <div className="space-y-2">
                <AnimatePresence>
                  {lootItems.slice(0, lootRevealed).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex items-center gap-3 p-2 rounded-lg bg-gray-900/60 border ${RARITIES[item.rarity]?.border || "border-gray-600"}`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${RARITIES[item.rarity]?.color || "text-gray-300"}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase">
                          {item.slot} &bull; {RARITIES[item.rarity]?.label}
                        </p>
                      </div>
                      {item.stats && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.stats).map(([s, v]) => v > 0 && (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                              +{v} {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!allRevealed && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={revealNext}
                    className="w-full py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-fuchsia-500 transition-colors"
                  >
                    Reveal Next ({lootItems.length - lootRevealed} remaining)
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Defeat penalty */}
      {!won && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500"
        >
          <p>Lost 10% gold as a penalty.</p>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: won ? 0.6 : 0.3 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="px-8 py-3 lg:px-12 lg:py-4 2xl:py-5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-base lg:text-lg transition-colors"
      >
        {won ? "Return to Hub" : "Try Again"}
      </motion.button>
    </motion.div>
  );
}
