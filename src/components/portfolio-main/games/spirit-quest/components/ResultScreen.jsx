// ============================================================
// ResultScreen — Victory / Defeat / XP gain / Loot reveal
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RARITIES } from "../constants";
import { XpBar } from "./HpBar";

const STAT_LABELS = {
  hp: "HP",
  se: "SE",
  atk: "ATK",
  def: "DEF",
  spd: "SPD",
  focus: "FOCUS",
};

function getGearDescription(item) {
  if (!item) return "";

  const bonusText = Object.entries(item.stats || {})
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([stat, value]) => `+${value} ${STAT_LABELS[stat] || stat.toUpperCase()}`);

  const parts = [];
  if (item.charmDesc) parts.push(item.charmDesc);
  if (item.passive?.desc) parts.push(item.passive.desc);
  if (bonusText.length > 0) parts.push(`Bonuses: ${bonusText.join(", ")}`);
  if (item.lore) parts.push(item.lore);

  return parts.join(" • ") || "Mysterious gear infused with spirit energy.";
}

function GearTooltip({ item, x, y }) {
  const description = getGearDescription(item);

  return (
    <div
      className="pointer-events-none fixed z-[2147483647] w-[min(340px,calc(100vw-2rem))]"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="rounded-xl border border-fuchsia-400/40 bg-gradient-to-br from-gray-900 via-gray-900 to-fuchsia-950/80 px-3 py-2 shadow-[0_0_25px_rgba(217,70,239,0.3)] backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-base">{item?.icon || "✨"}</span>
          <span className={`text-xs font-semibold ${RARITIES[item?.rarity]?.color || "text-fuchsia-200"}`}>
            {item?.name}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-fuchsia-100/90">{description}</p>
      </div>
    </div>
  );
}

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
  const [tooltip, setTooltip] = useState({ item: null, x: 0, y: 0 });
  const won = outcome === "victory";

  const getTooltipPosition = (clientX, clientY) => {
    const tooltipWidth = 340;
    const offset = 16;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

    const x = Math.max(8, Math.min(clientX + offset, viewportWidth - tooltipWidth - 8));
    const y = Math.max(8, Math.min(clientY + offset, viewportHeight - 120));
    return { x, y };
  };

  const showTooltip = (item, event) => {
    if (!item) return;
    const { x, y } = getTooltipPosition(event.clientX, event.clientY);
    setTooltip({ item, x, y });
  };

  const moveTooltip = (event) => {
    setTooltip((prev) => {
      if (!prev.item) return prev;
      const { x, y } = getTooltipPosition(event.clientX, event.clientY);
      return { ...prev, x, y };
    });
  };

  const hideTooltip = () => setTooltip({ item: null, x: 0, y: 0 });

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
                      onMouseEnter={(event) => showTooltip(item, event)}
                      onMouseMove={moveTooltip}
                      onMouseLeave={hideTooltip}
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
      {tooltip.item && <GearTooltip item={tooltip.item} x={tooltip.x} y={tooltip.y} />}

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
