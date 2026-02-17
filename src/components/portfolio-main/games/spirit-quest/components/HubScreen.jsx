// ============================================================
// HubScreen — central management (stats, equip, skills, zones)
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { PATHS } from "../constants";
import { getEffectiveStats } from "../state/playerState";
import { XpBar } from "./HpBar";

export default function HubScreen({
  player,
  onOpenInventory,
  onOpenSkills,
  onOpenZones,
  onReturnToMenu,
}) {
  const path = PATHS[player.path];
  const stats = getEffectiveStats(player);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Character header */}
      <div className="text-center">
        <motion.span
          className="text-5xl lg:text-6xl 2xl:text-7xl block mb-2"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {path?.icon || "🗡️"}
        </motion.span>
        <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          {player.name}
        </h2>
        <p className={`text-sm lg:text-base 2xl:text-lg ${path?.textColor || "text-gray-400"} mt-1`}>
          Lv.{player.level} {path?.name || "Spirit Channeler"}
          {player.ascension > 0 && (
            <span className="text-yellow-400 ml-2">★{player.ascension}</span>
          )}
        </p>
      </div>

      {/* XP bar */}
      <div className="px-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>XP</span>
          <span>{player.xp} / {player.xpToNext || "MAX"}</span>
        </div>
        <XpBar current={player.xp} max={player.xpToNext || 1} />
      </div>

      {/* Stats overview */}
      <div className="bg-gray-800/50 rounded-xl p-4 lg:p-5 2xl:p-6 border border-gray-700/50">
        <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wider mb-3">Stats</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 lg:gap-y-3">
          {[
            { label: "HP",    val: stats.maxHp,  color: "text-green-400",  icon: "❤️" },
            { label: "SE",    val: stats.maxSe,   color: "text-indigo-400", icon: "💜" },
            { label: "ATK",   val: stats.atk,     color: "text-red-400",    icon: "⚔️" },
            { label: "DEF",   val: stats.def,     color: "text-cyan-400",   icon: "🛡️" },
            { label: "SPD",   val: stats.spd,     color: "text-yellow-400", icon: "💨" },
            { label: "FOCUS", val: stats.focus,   color: "text-fuchsia-400",icon: "🎯" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-gray-400">
                {s.icon} {s.label}
              </span>
              <span className={`text-sm lg:text-base font-bold ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Currency */}
      <div className="flex justify-center gap-6 text-sm lg:text-base">
        <span className="text-yellow-400">💰 {player.gold}</span>
        <span className="text-purple-400">💎 {player.spiritShards}</span>
      </div>

      {/* Battle tracking */}
      <div className="flex justify-center gap-4 text-xs lg:text-sm text-gray-600">
        <span>Battles Won: {player.battlesWon}</span>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-2">
        <HubButton
          label="⚔️  Enter Battle"
          onClick={onOpenZones}
          color="from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500"
          primary
        />
        <div className="grid grid-cols-2 gap-2">
          <HubButton
            label="🎒 Equipment"
            onClick={onOpenInventory}
            color="from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
          />
          <HubButton
            label="✨ Skills"
            onClick={onOpenSkills}
            color="from-fuchsia-800 to-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-600"
          />
        </div>
        <button
          onClick={onReturnToMenu}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-2"
        >
          Return to Title
        </button>
      </div>
    </motion.div>
  );
}

function HubButton({ label, onClick, color, primary = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${primary ? "py-3.5 lg:py-4 2xl:py-5" : "py-2.5 lg:py-3 2xl:py-4"} rounded-xl font-bold text-sm lg:text-base tracking-wide
        bg-gradient-to-r ${color}
        transition-all duration-150 border border-gray-700
      `}
    >
      {label}
    </motion.button>
  );
}
