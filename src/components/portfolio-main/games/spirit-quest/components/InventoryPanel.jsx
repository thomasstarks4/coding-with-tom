// ============================================================
// InventoryPanel — equipment management, bag, crafting
// ============================================================

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { EQUIP_SLOTS, RARITIES, PATHS } from "../constants";
import { getEquipmentBonuses } from "../data/equipment";

export default function InventoryPanel({
  equipment,
  inventory,
  gold,
  spiritShards,
  baseStats,
  level,
  path,
  onEquip,      // (inventoryIndex) => void
  onUnequip,    // (slotName) => void
  onDiscard,    // (inventoryIndex) => void
  onBack,
}) {
  // Calculate equipment bonuses
  const equipBonuses = useMemo(() => getEquipmentBonuses(equipment), [equipment]);
  const pathData = PATHS[path];

  // Calculate effective stats
  const stats = useMemo(() => ({
    hp: baseStats.maxHp + (equipBonuses.hp || 0),
    se: baseStats.maxSe + (equipBonuses.se || 0),
    atk: baseStats.atk + (equipBonuses.atk || 0),
    def: baseStats.def + (equipBonuses.def || 0),
    spd: baseStats.spd + (equipBonuses.spd || 0),
    focus: baseStats.focus + (equipBonuses.focus || 0),
  }), [baseStats, equipBonuses]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-300 transition-colors text-sm">
          ← Back
        </button>
        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Equipment & Inventory
        </h2>
        <div className="w-12" />
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Stats</p>
          <div className="flex gap-3 text-xs">
            <span className="text-yellow-400">💰 {gold}</span>
            <span className="text-purple-400">💎 {spiritShards}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
          {[
            { label: "HP", base: baseStats.maxHp, bonus: equipBonuses.hp || 0, color: "text-green-400", icon: "❤️" },
            { label: "SE", base: baseStats.maxSe, bonus: equipBonuses.se || 0, color: "text-indigo-400", icon: "💜" },
            { label: "ATK", base: baseStats.atk, bonus: equipBonuses.atk || 0, color: "text-red-400", icon: "⚔️" },
            { label: "DEF", base: baseStats.def, bonus: equipBonuses.def || 0, color: "text-cyan-400", icon: "🛡️" },
            { label: "SPD", base: baseStats.spd, bonus: equipBonuses.spd || 0, color: "text-yellow-400", icon: "💨" },
            { label: "FOCUS", base: baseStats.focus, bonus: equipBonuses.focus || 0, color: "text-fuchsia-400", icon: "🎯" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">
                {s.icon} {s.label}
              </span>
              <div className="flex items-center gap-1">
                <motion.span
                  key={`${s.label}-total`}
                  initial={{ scale: 1.3, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "currentColor" }}
                  transition={{ duration: 0.3 }}
                  className={`text-xs font-bold ${s.color}`}
                >
                  {s.base + s.bonus}
                </motion.span>
                {s.bonus !== 0 && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-[9px] ${s.bonus > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    ({s.bonus > 0 ? "+" : ""}{s.bonus})
                  </motion.span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment slots */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipped</p>
        <div className="grid grid-cols-1 gap-2">
          {EQUIP_SLOTS.map((slot) => {
            const item = equipment[slot];
            return (
              <motion.div
                key={slot}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  item
                    ? (RARITIES[item.rarity]?.border || "border-gray-600") + " bg-gray-800/60"
                    : "border-gray-800 bg-gray-900/40 border-dashed"
                }`}
              >
                <span className="text-xs text-gray-500 uppercase w-16 flex-shrink-0">{slot}</span>
                {item ? (
                  <>
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${RARITIES[item.rarity]?.color || "text-gray-300"}`}>
                        {item.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {Object.entries(item.stats || {}).map(([s, v]) => v > 0 && (
                          <span key={s} className="text-[10px] px-1 rounded bg-gray-900 text-gray-500">
                            +{v} {s}
                          </span>
                        ))}
                        {item.passive?.desc && (
                          <span className="text-[10px] px-1 rounded bg-fuchsia-900/30 text-fuchsia-400">
                            {item.passive.desc}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onUnequip(slot)}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-700 italic">Empty</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Inventory bag */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Bag ({inventory.length}/20)
        </p>
        {inventory.length === 0 ? (
          <p className="text-sm text-gray-700 italic text-center py-4">No items in bag</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 transparent" }}>
            {inventory.map((item, idx) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center gap-3 p-2 rounded-lg border ${RARITIES[item.rarity]?.border || "border-gray-600"} bg-gray-800/40`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${RARITIES[item.rarity]?.color || "text-gray-300"}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">{item.slot} &bull; {RARITIES[item.rarity]?.label}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEquip(idx)}
                    className="text-xs px-2 py-1 rounded bg-cyan-800/50 text-cyan-300 hover:bg-cyan-700/50 transition-colors"
                  >
                    Equip
                  </button>
                  <button
                    onClick={() => onDiscard(idx)}
                    className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
