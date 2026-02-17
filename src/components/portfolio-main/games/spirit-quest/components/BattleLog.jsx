// ============================================================
// BattleLog — scrollable combat log with animated entries
// ============================================================

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOG_COLORS = {
  player: "text-cyan-300",
  enemy: "text-red-400",
  system: "text-yellow-300",
  heal: "text-green-400",
  special: "text-fuchsia-400",
  status: "text-purple-300",
};

function LogEntry({ text, type }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`text-sm lg:text-base leading-relaxed ${LOG_COLORS[type] || "text-gray-300"}`}
    >
      {text}
    </motion.p>
  );
}

export default function BattleLog({ log }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="bg-black/50 border border-gray-800 rounded-xl p-3 lg:p-4 h-40 md:h-48 lg:h-56 2xl:h-64 overflow-y-auto space-y-1 lg:space-y-1.5"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 transparent" }}
    >
      <AnimatePresence>
        {log.length === 0 && (
          <p className="text-gray-600 text-sm italic">
            The battle begins... Choose your action.
          </p>
        )}
        {log.map((entry) => (
          <LogEntry key={entry.id} text={entry.text} type={entry.type} />
        ))}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}
