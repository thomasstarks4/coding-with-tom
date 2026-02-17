// ============================================================
// BattleScreen — full combat UI with sprites, bars, log, actions
// ============================================================

import React from "react";
import { motion } from "framer-motion";
import { PATHS, BATTLE_MODIFIERS } from "../constants";
import { useBattleTurn } from "../hooks/useBattleTurn";
import CharacterSprite from "./CharacterSprite";
import { HpBar, SpiritBar } from "./HpBar";
import BattleLog from "./BattleLog";
import ActionBar from "./ActionBar";

export default function BattleScreen({
  combatPlayer,
  combatEnemy,
  playerData,   // persistent player (for path, activeSkills, equipment)
  modifier,
  onVictory,
  onDefeat,
}) {
  const path = PATHS[playerData.path] || {};

  const {
    player, enemy, log, turnLock, animState,
    actions: { basicAttack, guard, useSkill },
  } = useBattleTurn(
    combatPlayer,
    combatEnemy,
    playerData.equipment,
    onVictory,
    onDefeat,
  );

  const modLabel = BATTLE_MODIFIERS[modifier]?.label || "Normal";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 md:space-y-4 w-full"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Spirit Quest: Spirit Sword
        </h1>
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">
          Lv.{playerData.level} {path.name || "Channeler"} &bull; {modLabel}
        </p>
      </div>

      {/* Sprites arena */}
      <div className="flex justify-between items-center px-2 md:px-8 py-3">
        {/* Player sprite */}
        <div className="flex flex-col items-center gap-1">
          <CharacterSprite
            icon={path.icon || "🗡️"}
            element={path.element}
            animState={animState.player}
            isPlayer
            statusEffects={player.statusEffects}
            pathColor={path.borderColor}
          />
          <span className="text-xs text-cyan-300 font-bold mt-1">{playerData.name}</span>
        </div>

        {/* VS indicator */}
        <motion.span
          className="text-2xl md:text-3xl font-extrabold text-gray-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          VS
        </motion.span>

        {/* Enemy sprite */}
        <div className="flex flex-col items-center gap-1">
          <CharacterSprite
            icon={enemy.icon || "👻"}
            element={enemy.element}
            animState={animState.enemy}
            isPlayer={false}
            statusEffects={enemy.statusEffects}
          />
          <span className="text-xs text-red-400 font-bold mt-1">{enemy.name}</span>
          {enemy.isBoss && (
            <span className="text-[10px] text-yellow-400 uppercase tracking-wider">Boss</span>
          )}
        </div>
      </div>

      {/* Stat panels */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {/* Player panel */}
        <div className="bg-gray-800/60 border border-cyan-900/50 rounded-xl p-2 md:p-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>HP</span>
            <span>{player.hp} / {player.maxHp}</span>
          </div>
          <HpBar
            current={player.hp}
            max={player.maxHp}
            color="bg-gradient-to-r from-green-500 to-emerald-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>SE</span>
            <span>{player.se} / {player.maxSe}</span>
          </div>
          <SpiritBar current={player.se} max={player.maxSe} />
        </div>

        {/* Enemy panel */}
        <div className="bg-gray-800/60 border border-red-900/50 rounded-xl p-2 md:p-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>HP</span>
            <span>{enemy.hp} / {enemy.maxHp}</span>
          </div>
          <HpBar
            current={enemy.hp}
            max={enemy.maxHp}
            color="bg-gradient-to-r from-red-600 to-orange-500"
          />
          {enemy.se !== undefined && (
            <>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>SE</span>
                <span>{enemy.se} / {enemy.maxSe}</span>
              </div>
              <SpiritBar current={enemy.se} max={enemy.maxSe} />
            </>
          )}
        </div>
      </div>

      {/* Battle log */}
      <BattleLog log={log} />

      {/* Action bar */}
      <ActionBar
        activeSkills={playerData.activeSkills}
        onBasicAttack={basicAttack}
        onGuard={guard}
        onUseSkill={useSkill}
        turnLock={turnLock}
        playerSe={player.se}
        cooldowns={player.cooldowns}
      />
    </motion.div>
  );
}
