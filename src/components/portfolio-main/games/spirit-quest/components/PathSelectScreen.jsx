// ============================================================
// PathSelectScreen — choose Spirit Brawler / Sorcerer / Armor
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { PATHS } from "../constants";
import { getSkillTree } from "../data/skills";

export default function PathSelectScreen({ onSelectPath }) {
  const paths = Object.values(PATHS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 lg:space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Choose Your Path
        </h2>
        <p className="text-gray-400 text-sm lg:text-base 2xl:text-lg mt-2 lg:mt-3">
          This choice shapes your abilities, strengths, and destiny.
        </p>
      </div>

      <div className="space-y-4 lg:space-y-5">
        {paths.map((path, idx) => {
          const tree = getSkillTree(path.id);
          const previewSkills = tree.slice(0, 3);

          return (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.12, duration: 0.35 }}
              whileHover={{ scale: 1.02, x: 6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPath(path.id)}
              className={`w-full text-left p-4 md:p-5 lg:p-6 2xl:p-7 rounded-2xl border ${path.borderColor}/40 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${path.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />

              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${path.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl`} />

              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <motion.span
                  className="text-4xl lg:text-5xl 2xl:text-6xl flex-shrink-0 mt-1"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {path.icon}
                </motion.span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg lg:text-xl 2xl:text-2xl font-bold ${path.textColor} group-hover:brightness-125 transition-all`}>
                    {path.name}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-400 mt-1 lg:mt-2 leading-relaxed">
                    {path.description}
                  </p>

                  {/* Stat modifiers */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(path.statMod).map(([stat, mod]) => {
                      if (mod === 1.0) return null;
                      const isUp = mod > 1;
                      return (
                        <span
                          key={stat}
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            isUp
                              ? "text-green-400 border-green-800/50 bg-green-900/20"
                              : "text-red-400 border-red-800/50 bg-red-900/20"
                          }`}
                        >
                          {stat.toUpperCase()} {isUp ? "+" : ""}{Math.round((mod - 1) * 100)}%
                        </span>
                      );
                    })}
                  </div>

                  {/* Preview skills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {previewSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {tree.length > 3 && (
                      <span className="text-[10px] text-gray-600">+{tree.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <span className="text-gray-600 group-hover:text-gray-400 transition-colors mt-2 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
