// ============================================================
// InventoryPanel — equipment management, bag, crafting
// ============================================================

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EQUIP_SLOTS, RARITIES } from "../constants";
import { getEquipmentBonuses } from "../data/equipment";

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
      className="pointer-events-none fixed z-[2147483647] w-[min(340px,calc(100vw-2rem))] transition-opacity duration-100"
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
  const [tooltip, setTooltip] = useState({ item: null, x: 0, y: 0 });

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
        <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
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
        <div className="grid grid-cols-3 gap-x-3 lg:gap-x-5 gap-y-1.5 lg:gap-y-2">
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
                onMouseEnter={(event) => showTooltip(item, event)}
                onMouseMove={moveTooltip}
                onMouseLeave={hideTooltip}
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
                onMouseEnter={(event) => showTooltip(item, event)}
                onMouseMove={moveTooltip}
                onMouseLeave={hideTooltip}
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
      {tooltip.item && <GearTooltip item={tooltip.item} x={tooltip.x} y={tooltip.y} />}
    </motion.div>
  );
}
