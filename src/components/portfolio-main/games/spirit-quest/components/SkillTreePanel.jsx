// ============================================================
// SkillTreePanel — view skill tree, swap active skills
// ============================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PATHS, ELEMENT_COLORS } from "../constants";
import { getSkillTree } from "../data/skills";

export default function SkillTreePanel({
  path,
  level,
  unlockedSkills,
  activeSkills,
  onSetActiveSkills,
  onBack,
}) {
  const pathData = PATHS[path];
  const tree = getSkillTree(path);
  const [pendingActive, setPendingActive] = useState([...activeSkills]);
  const [inspecting, setInspecting] = useState(null);

  const toggleSkill = (skillId) => {
    if (!unlockedSkills.includes(skillId)) return;

    if (pendingActive.includes(skillId)) {
      // Remove
      setPendingActive((prev) => prev.filter((id) => id !== skillId));
    } else if (pendingActive.length < 4) {
      // Add
      setPendingActive((prev) => [...prev, skillId]);
    }
  };

  const saveAndBack = () => {
    onSetActiveSkills(pendingActive);
    onBack();
  };

  const hasChanges =
    JSON.stringify(pendingActive.sort()) !== JSON.stringify([...activeSkills].sort());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={saveAndBack} className="text-gray-500 hover:text-gray-300 transition-colors text-sm">
          ← Back{hasChanges ? " (save)" : ""}
        </button>
        <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          {pathData?.name || "Skills"}
        </h2>
        <div className="w-16" />
      </div>

      <p className="text-xs lg:text-sm text-gray-500 text-center">
        Tap unlocked skills to equip (max 4). Equipped skills glow.
      </p>

      {/* Active skill slots */}
      <div className="flex justify-center gap-2 lg:gap-3">
        {[0, 1, 2, 3].map((slotIdx) => {
          const skillId = pendingActive[slotIdx];
          const skill = tree.find((s) => s.id === skillId);
          return (
            <div
              key={slotIdx}
              className={`w-16 h-16 lg:w-20 lg:h-20 2xl:w-24 2xl:h-24 rounded-xl border-2 flex items-center justify-center text-xs lg:text-sm text-center font-bold transition-all ${
                skill
                  ? `${pathData?.borderColor || "border-cyan-500"} bg-gray-800/60 text-cyan-300 cursor-pointer`
                  : "border-gray-700 border-dashed bg-gray-900/30 text-gray-700"
              }`}
              onClick={() => skill && toggleSkill(skill.id)}
              title={skill ? `${skill.name} — click to unequip` : "Empty slot"}
            >
              {skill ? (
                <span className="leading-tight text-[10px]">{skill.name}</span>
              ) : (
                <span className="text-lg opacity-30">+</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Full skill tree */}
      <div className="space-y-2 lg:space-y-3 max-h-80 lg:max-h-[28rem] 2xl:max-h-[36rem] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 transparent" }}>
        {tree.map((skill, idx) => {
          const unlocked = unlockedSkills.includes(skill.id);
          const equipped = pendingActive.includes(skill.id);
          const elementColor = ELEMENT_COLORS[skill.element];

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: unlocked ? 1 : 0.35, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <button
                onClick={() => unlocked && toggleSkill(skill.id)}
                onContextMenu={(e) => { e.preventDefault(); setInspecting(inspecting === skill.id ? null : skill.id); }}
                disabled={!unlocked}
                className={`w-full text-left p-3 lg:p-4 rounded-xl border transition-all ${
                  equipped
                    ? `${pathData?.borderColor || "border-cyan-500"} bg-gray-800/80 ring-1 ring-cyan-500/30`
                    : unlocked
                    ? "border-gray-700 bg-gray-800/40 hover:border-gray-600"
                    : "border-gray-800/30 bg-gray-900/20 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Level indicator */}
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0
                    ${unlocked
                      ? equipped
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 text-gray-300"
                      : "bg-gray-900 text-gray-700"
                    }`}
                  >
                    {skill.levelReq}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm lg:text-base font-bold ${unlocked ? (equipped ? "text-cyan-300" : "text-gray-200") : "text-gray-600"}`}>
                        {skill.name}
                      </span>
                      {elementColor && (
                        <span className={`text-[10px] ${elementColor.text}`}>
                          {skill.element}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs lg:text-sm mt-0.5 ${unlocked ? "text-gray-400" : "text-gray-700"}`}>
                      {skill.desc}
                    </p>
                  </div>

                  {/* Cost/CD info */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[10px] ${unlocked ? "text-indigo-400" : "text-gray-700"}`}>
                      {skill.seCost} SE
                    </p>
                    {skill.cooldown > 0 && (
                      <p className={`text-[10px] ${unlocked ? "text-gray-500" : "text-gray-700"}`}>
                        CD: {skill.cooldown}t
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {inspecting === skill.id && unlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-500 space-y-1 overflow-hidden"
                    >
                      <p>Type: <span className="text-gray-300">{skill.type}</span></p>
                      {skill.power > 0 && <p>Power: <span className="text-gray-300">{skill.power}x</span></p>}
                      {skill.hits > 1 && <p>Hits: <span className="text-gray-300">{skill.hits}</span></p>}
                      {skill.statusApply && (
                        <p>Applies: <span className="text-purple-400">{skill.statusApply.id.replace(/_/g, " ")} ({Math.round(skill.statusApply.chance * 100)}%)</span></p>
                      )}
                      {skill.armorPierce && <p>Armor Pierce: <span className="text-yellow-400">{Math.round(skill.armorPierce * 100)}%</span></p>}
                      {skill.selfHeal && <p>Self Heal: <span className="text-green-400">{Math.round(skill.selfHeal * 100)}% of damage</span></p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-600 text-center">Right-click / long-press a skill for details</p>
    </motion.div>
  );
}
