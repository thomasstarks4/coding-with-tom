// ============================================================
// HpBar & SpiritBar — animated stat bars
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { clamp } from "../constants";

export function HpBar({ current, max, color = "bg-gradient-to-r from-green-500 to-emerald-400", height = "h-4" }) {
  const pct = clamp((current / max) * 100, 0, 100);
  return (
    <div className={`w-full ${height} bg-gray-800 rounded-full overflow-hidden border border-gray-600`}>
      <motion.div
        className={`h-full ${color}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  );
}

export function SpiritBar({ current, max }) {
  const pct = clamp((current / max) * 100, 0, 100);
  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-indigo-900 mt-1">
      <motion.div
        className="h-full bg-indigo-500"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  );
}

export function XpBar({ current, max }) {
  const pct = max > 0 ? clamp((current / max) * 100, 0, 100) : 100;
  return (
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-yellow-900">
      <motion.div
        className="h-full bg-gradient-to-r from-yellow-500 to-amber-400"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      />
    </div>
  );
}
