// ============================================================
// CharacterSprite — animated player/enemy visual
// Uses layered divs + Framer Motion for all visual states
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { ELEMENT_COLORS, STATUS_EFFECTS } from "../constants";

const spriteVariants = {
  idle: {
    y: [0, -4, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
  attack: {
    x: [0, 50, 0],
    transition: { duration: 0.35, ease: "easeOut" },
  },
  hit: {
    x: [-8, 8, -5, 3, 0],
    transition: { duration: 0.35 },
  },
  heal: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.5 },
  },
  special: {
    scale: [1, 1.15, 1],
    transition: { duration: 0.5 },
  },
  defend: {
    scale: [1, 0.95, 1],
    transition: { duration: 0.3 },
  },
  defeat: {
    opacity: [1, 0.5, 0],
    scale: [1, 0.7, 0.3],
    filter: ["blur(0px)", "blur(2px)", "blur(8px)"],
    transition: { duration: 0.8 },
  },
};

const enemySpriteVariants = {
  ...spriteVariants,
  idle: {
    scale: [1, 1.03, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  attack: {
    x: [0, -50, 0],
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Aura glow animation around the sprite
function AuraGlow({ element, isPlayer }) {
  const colors = ELEMENT_COLORS[element];
  if (!colors) return null;

  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl ${colors.glow}`}
      animate={{
        boxShadow: [
          `0 0 15px 2px`,
          `0 0 25px 6px`,
          `0 0 15px 2px`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ zIndex: 0 }}
    />
  );
}

// Floating damage/heal number
export function FloatingNumber({ value, type, onComplete }) {
  const color = type === "heal" ? "text-green-400" :
                type === "crit" ? "text-yellow-300" :
                type === "status" ? "text-purple-400" : "text-red-400";

  return (
    <motion.span
      className={`absolute text-lg font-extrabold ${color} pointer-events-none`}
      initial={{ opacity: 1, y: 0, x: 0 }}
      animate={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={onComplete}
      style={{ top: "20%", left: "50%", transform: "translateX(-50%)" }}
    >
      {type === "heal" ? `+${value}` : `-${value}`}
    </motion.span>
  );
}

// Status effect icons row
function StatusIcons({ statusEffects }) {
  if (!statusEffects || statusEffects.length === 0) return null;

  return (
    <div className="flex gap-1 justify-center mt-1">
      {statusEffects.map((fx, i) => {
        const template = STATUS_EFFECTS[fx.id];
        if (!template) return null;
        return (
          <motion.span
            key={`${fx.id}-${i}`}
            className={`text-xs ${template.color} bg-gray-900/80 rounded px-1`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            title={`${template.name} (${fx.turnsLeft}t)`}
          >
            {template.icon}{fx.turnsLeft}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function CharacterSprite({
  icon,
  element,
  animState = "idle",
  isPlayer = false,
  statusEffects = [],
  pathColor,
}) {
  const variants = isPlayer ? spriteVariants : enemySpriteVariants;
  const borderColor = isPlayer
    ? (pathColor || "border-cyan-500")
    : "border-red-500";

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <AuraGlow element={element} isPlayer={isPlayer} />
        <motion.div
          className={`relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 ${borderColor}
            bg-gray-900/80 flex items-center justify-center text-4xl md:text-5xl`}
          variants={variants}
          animate={animState}
        >
          {icon}
        </motion.div>
      </div>
      <StatusIcons statusEffects={statusEffects} />
    </div>
  );
}
