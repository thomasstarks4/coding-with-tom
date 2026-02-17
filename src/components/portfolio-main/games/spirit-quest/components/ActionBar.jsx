// ============================================================
// ActionBar — dynamic combat buttons (skills + basic actions)
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSkillById } from "../data/skills";

function ActionButton({ label, onClick, disabled, color, subtext }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm tracking-wide
        bg-gradient-to-r ${color}
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        border border-gray-700 relative
      `}
    >
      {label}
      {subtext && (
        <span className="block text-[10px] font-normal opacity-70 mt-0.5">{subtext}</span>
      )}
    </motion.button>
  );
}

export default function ActionBar({
  activeSkills = [],
  onBasicAttack,
  onGuard,
  onUseSkill,
  turnLock,
  playerSe,
  cooldowns = {},
}) {
  const [showTooltip, setShowTooltip] = useState(null);

  const skills = activeSkills.map((id) => getSkillById(id)).filter(Boolean);

  return (
    <div className="space-y-2">
      {/* Skill buttons (top row) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {skills.map((skill) => {
          const onCd = cooldowns[skill.id] > 0;
          const noSe = playerSe < skill.seCost;
          const disabled = turnLock || onCd || noSe;

          return (
            <div key={skill.id} className="relative">
              <ActionButton
                label={`${skill.name}`}
                subtext={onCd ? `CD: ${cooldowns[skill.id]}t` : `${skill.seCost} SE`}
                onClick={() => onUseSkill(skill.id)}
                disabled={disabled}
                color="from-fuchsia-800 to-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-600"
              />
              {/* Tooltip on hover */}
              <div
                className="absolute inset-0 z-10 cursor-help"
                onMouseEnter={() => setShowTooltip(skill.id)}
                onMouseLeave={() => setShowTooltip(null)}
              />
              <AnimatePresence>
                {showTooltip === skill.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-gray-300 w-48 z-20 shadow-xl pointer-events-none"
                  >
                    <p className="font-bold text-fuchsia-300">{skill.name}</p>
                    <p className="mt-1">{skill.desc}</p>
                    <p className="mt-1 text-gray-500">
                      {skill.seCost} SE • CD: {skill.cooldown}t • {skill.element}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Basic actions (bottom row) */}
      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          label="⚔️ Attack"
          onClick={onBasicAttack}
          disabled={turnLock}
          color="from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500"
        />
        <ActionButton
          label="🛡️ Guard"
          subtext={`+${8} SE`}
          onClick={onGuard}
          disabled={turnLock}
          color="from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
        />
      </div>

      {/* Turn lock indicator */}
      <AnimatePresence>
        {turnLock && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-gray-500 animate-pulse"
          >
            Enemy is responding...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
