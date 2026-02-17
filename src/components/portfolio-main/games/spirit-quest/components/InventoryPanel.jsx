// ============================================================
// InventoryPanel — equipment management, bag, crafting
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { EQUIP_SLOTS, RARITIES } from "../constants";

export default function InventoryPanel({
  equipment,
  inventory,
  gold,
  spiritShards,
  onEquip,      // (inventoryIndex) => void
  onUnequip,    // (slotName) => void
  onDiscard,    // (inventoryIndex) => void
  onBack,
}) {
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

      {/* Currency */}
      <div className="flex justify-center gap-6 text-sm">
        <span className="text-yellow-400">💰 {gold} Gold</span>
        <span className="text-purple-400">💎 {spiritShards} Shards</span>
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
