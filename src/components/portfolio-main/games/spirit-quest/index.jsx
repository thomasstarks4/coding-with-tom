// ============================================================
// Spirit Quest: Spirit Sword — Main Entry Point
// Phase router that orchestrates the entire game flow.
//
// Phases:
//   menu → pathSelect → hub → zoneSelect → battle →
//     victory → loot/levelUp → hub
//     defeat → hub
//   hub → inventory | skills (sub-screens, same phase)
// ============================================================

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Data & state
import { BATTLE_MODIFIERS } from "./constants";
import { createPlayer, applyPath, gainXp, createCombatPlayer, equipItem, unequipItem, addToInventory, removeFromInventory } from "./state/playerState";
import { pickRandomEnemy, createEnemyInstance } from "./data/enemies";
import { rollLoot, rollCurrencyRewards } from "./state/lootEngine";

// Hooks
import { usePersistence } from "./hooks/usePersistence";

// Screens
import MenuScreen from "./components/MenuScreen";
import PathSelectScreen from "./components/PathSelectScreen";
import HubScreen from "./components/HubScreen";
import ZoneSelectScreen from "./components/ZoneSelectScreen";
import BattleScreen from "./components/BattleScreen";
import ResultScreen from "./components/ResultScreen";
import InventoryPanel from "./components/InventoryPanel";
import SkillTreePanel from "./components/SkillTreePanel";

// ─── Default save-game shape ────────────────────────────────
const DEFAULT_SAVE = {
  player: null, // null = new game not started
  phase: "menu",
};

// ─── Wrapper: dark atmospheric background ───────────────────
function Wrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex items-center justify-center p-3 md:p-4 font-mono">
      <div className="w-full max-w-xl md:max-w-2xl">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Game Component
// ═══════════════════════════════════════════════════════════
export default function SpiritQuest() {
  // ── Persistent state (player + phase survive refresh) ──
  const { state: save, setState: setSave, hasSave, clearSave } = usePersistence(DEFAULT_SAVE);

  // ── Transient state (reset each navigation) ────────────
  const [subScreen, setSubScreen] = useState(null); // "inventory" | "skills" | null
  const [selectedModifier, setSelectedModifier] = useState("none");
  const [combatEnemy, setCombatEnemy] = useState(null);
  const [combatPlayer, setCombatPlayer] = useState(null);
  const [battleResult, setBattleResult] = useState(null); // { outcome, xp, gold, shards, loot, levelsGained, statGains, newSkills }

  // ── Convenience aliases ─────────────────────────────────
  const player = save.player;
  const phase = save.phase;

  const setPhase = useCallback((newPhase) => {
    setSave((prev) => ({ ...prev, phase: newPhase }));
  }, [setSave]);

  const setPlayer = useCallback((updater) => {
    setSave((prev) => ({
      ...prev,
      player: typeof updater === "function" ? updater(prev.player) : updater,
    }));
  }, [setSave]);

  // ══════════════════════════════════════════════════════
  // PHASE HANDLERS
  // ══════════════════════════════════════════════════════

  // ── Menu ────────────────────────────────────────────────
  const handleNewGame = useCallback(() => {
    const p = createPlayer("Spirit Channeler");
    setSave({ player: p, phase: "pathSelect" });
    setSubScreen(null);
    setBattleResult(null);
  }, [setSave]);

  const handleContinue = useCallback(() => {
    // If player exists, go to hub (or wherever they left off)
    if (player) {
      setPhase(player.path ? "hub" : "pathSelect");
    }
  }, [player, setPhase]);

  // ── Path selection ──────────────────────────────────────
  const handleSelectPath = useCallback((pathId) => {
    const updated = applyPath(player, pathId);
    setPlayer(updated);
    setPhase("hub");
  }, [player, setPlayer, setPhase]);

  // ── Hub navigation ──────────────────────────────────────
  const handleOpenInventory = () => setSubScreen("inventory");
  const handleOpenSkills = () => setSubScreen("skills");
  const handleOpenZones = () => setPhase("zoneSelect");
  const handleBackToHub = () => { setSubScreen(null); setPhase("hub"); };
  const handleReturnToMenu = () => setPhase("menu");

  // ── Inventory actions ───────────────────────────────────
  const handleEquip = useCallback((idx) => {
    setPlayer((p) => equipItem(p, idx));
  }, [setPlayer]);

  const handleUnequip = useCallback((slot) => {
    setPlayer((p) => unequipItem(p, slot));
  }, [setPlayer]);

  const handleDiscard = useCallback((idx) => {
    setPlayer((p) => removeFromInventory(p, idx));
  }, [setPlayer]);

  // ── Skill management ────────────────────────────────────
  const handleSetActiveSkills = useCallback((skills) => {
    setPlayer((p) => ({ ...p, activeSkills: skills }));
  }, [setPlayer]);

  // ── Zone selection → Battle ─────────────────────────────
  const handleSelectZone = useCallback((zoneId) => {
    // Pick an enemy from the zone (boss if first time clearing at high enough level, else random)
    const template = pickRandomEnemy(zoneId);
    const enemyInstance = createEnemyInstance(template);

    // Apply battle modifier to enemy
    const mod = BATTLE_MODIFIERS[selectedModifier];
    if (mod.enemyMul !== 1) {
      enemyInstance.hp = Math.round(enemyInstance.hp * mod.enemyMul);
      enemyInstance.maxHp = enemyInstance.hp;
      enemyInstance.atk = Math.round(enemyInstance.atk * mod.enemyMul);
      enemyInstance.def = Math.round(enemyInstance.def * mod.enemyMul);
    }

    setCombatEnemy(enemyInstance);
    setCombatPlayer(createCombatPlayer(player));
    setBattleResult(null);
    setPhase("battle");
  }, [player, selectedModifier, setPhase]);

  // ── Battle outcome ──────────────────────────────────────
  const handleVictory = useCallback(() => {
    if (!combatEnemy || !player) return;

    const mod = BATTLE_MODIFIERS[selectedModifier];

    // Calculate XP
    const baseXp = combatEnemy.xpReward || 30;
    const xpAmount = Math.round(baseXp * (mod.xpMul || 1));

    // Apply XP to player
    const { player: leveledPlayer, levelsGained, statGains, newSkills } = gainXp(player, xpAmount);

    // Roll currency
    const { gold, shards } = rollCurrencyRewards(combatEnemy, mod);

    // Roll loot
    const hpPct = (combatPlayer?.hp || 1) / (combatPlayer?.maxHp || 1);
    const loot = rollLoot(combatEnemy.lootTier || 1, mod.lootBonus || 0, hpPct);

    // Update player with rewards
    let updatedPlayer = {
      ...leveledPlayer,
      gold: (leveledPlayer.gold || 0) + gold,
      spiritShards: (leveledPlayer.spiritShards || 0) + shards,
      battlesWon: (leveledPlayer.battlesWon || 0) + 1,
    };

    // Add loot to inventory (respect max)
    for (const item of loot) {
      const { player: p } = addToInventory(updatedPlayer, item);
      updatedPlayer = p;
    }

    // Update highest zone
    if (combatEnemy.zone) {
      updatedPlayer.highestZone = combatEnemy.zone;
    }

    setPlayer(updatedPlayer);
    setBattleResult({
      outcome: "victory",
      xpGained: xpAmount,
      goldGained: gold,
      shardsGained: shards,
      lootItems: loot,
      levelsGained,
      statGains,
      newSkills,
    });
    setPhase("result");
  }, [combatEnemy, combatPlayer, player, selectedModifier, setPlayer, setPhase]);

  const handleDefeat = useCallback(() => {
    if (!player) return;

    // Defeat penalty: lose 10% gold
    const goldLost = Math.round((player.gold || 0) * 0.1);
    setPlayer((p) => ({ ...p, gold: Math.max(0, (p.gold || 0) - goldLost) }));

    setBattleResult({
      outcome: "defeat",
      xpGained: 0,
      goldGained: -goldLost,
      shardsGained: 0,
      lootItems: [],
      levelsGained: 0,
      statGains: null,
      newSkills: [],
    });
    setPhase("result");
  }, [player, setPlayer, setPhase]);

  const handleResultContinue = useCallback(() => {
    setPhase("hub");
    setBattleResult(null);
    setCombatEnemy(null);
    setCombatPlayer(null);
  }, [setPhase]);

  // ══════════════════════════════════════════════════════
  // RENDER — phase router
  // ══════════════════════════════════════════════════════

  const renderPhase = () => {
    // ── Sub-screens (overlay on hub) ────────────────────
    if (phase === "hub" && subScreen === "inventory") {
      return (
        <InventoryPanel
          equipment={player.equipment}
          inventory={player.inventory}
          gold={player.gold}
          spiritShards={player.spiritShards}
          baseStats={player.baseStats}
          level={player.level}
          path={player.path}
          onEquip={handleEquip}
          onUnequip={handleUnequip}
          onDiscard={handleDiscard}
          onBack={() => setSubScreen(null)}
        />
      );
    }

    if (phase === "hub" && subScreen === "skills") {
      return (
        <SkillTreePanel
          path={player.path}
          level={player.level}
          unlockedSkills={player.unlockedSkills}
          activeSkills={player.activeSkills}
          onSetActiveSkills={handleSetActiveSkills}
          onBack={() => setSubScreen(null)}
        />
      );
    }

    switch (phase) {
      case "menu":
        return (
          <MenuScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            hasSave={hasSave && !!player}
            onClearSave={clearSave}
          />
        );

      case "pathSelect":
        return <PathSelectScreen onSelectPath={handleSelectPath} />;

      case "hub":
        return (
          <HubScreen
            player={player}
            onOpenInventory={handleOpenInventory}
            onOpenSkills={handleOpenSkills}
            onOpenZones={handleOpenZones}
            onReturnToMenu={handleReturnToMenu}
          />
        );

      case "zoneSelect":
        return (
          <ZoneSelectScreen
            playerLevel={player.level}
            highestZone={player.highestZone}
            selectedModifier={selectedModifier}
            onSelectModifier={setSelectedModifier}
            onSelectZone={handleSelectZone}
            onBack={handleBackToHub}
          />
        );

      case "battle":
        if (!combatPlayer || !combatEnemy) {
          setPhase("hub");
          return null;
        }
        return (
          <BattleScreen
            combatPlayer={combatPlayer}
            combatEnemy={combatEnemy}
            playerData={player}
            modifier={selectedModifier}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
          />
        );

      case "result":
        return (
          <ResultScreen
            outcome={battleResult?.outcome || "defeat"}
            enemyName={combatEnemy?.name || "Unknown"}
            xpGained={battleResult?.xpGained || 0}
            goldGained={battleResult?.goldGained || 0}
            shardsGained={battleResult?.shardsGained || 0}
            lootItems={battleResult?.lootItems || []}
            levelsGained={battleResult?.levelsGained || 0}
            statGains={battleResult?.statGains}
            newSkills={battleResult?.newSkills || []}
            player={player}
            onContinue={handleResultContinue}
          />
        );

      default:
        return (
          <MenuScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
            hasSave={hasSave && !!player}
            onClearSave={clearSave}
          />
        );
    }
  };

  return (
    <Wrapper>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${phase}-${subScreen}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>
    </Wrapper>
  );
}
