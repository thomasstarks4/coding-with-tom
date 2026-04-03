// ============================================================
// useBattleTurn — orchestrates turn flow, animations, and AI
// Manages: turn lock, enemy delay, status ticks, cooldowns
// ============================================================

import { useState, useCallback, useRef } from "react";
import { COMBAT, clamp, randInt } from "../constants";
import {
  calculateDamage, processStatusEffects, applyStatus,
  tickCooldowns, setCooldown, decideEnemyAction,
  checkBossPhases, applyBossPhase,
} from "../state/battleState";
import { getSkillById } from "../data/skills";
import { getEquipmentPassives } from "../data/equipment";

/**
 * Custom hook for managing a single battle's turn flow.
 *
 * @param {object}   initPlayer   - combat-ready player from createCombatPlayer()
 * @param {object}   initEnemy    - combat-ready enemy from createEnemyInstance()
 * @param {object}   equipment    - player's equipment (for passives)
 * @param {function} onVictory    - called when enemy HP <= 0
 * @param {function} onDefeat     - called when player HP <= 0
 * @param {function} onRun        - called when player successfully flees
 */
export function useBattleTurn(initPlayer, initEnemy, equipment, onVictory, onDefeat, onRun) {
  const [player, setPlayer] = useState(initPlayer);
  const [enemy, setEnemy] = useState(initEnemy);
  const [log, setLog] = useState([]);
  const [turnLock, setTurnLock] = useState(false);
  const [animState, setAnimState] = useState({ player: "idle", enemy: "idle" });
  const logIdRef = useRef(0);

  // ── Logging helper ──────────────────────────────────────
  const addLog = useCallback((text, type = "system") => {
    logIdRef.current += 1;
    setLog((prev) => [...prev, { id: logIdRef.current, text, type }]);
  }, []);

  // ── Helper: resolve passives ────────────────────────────
  const passives = getEquipmentPassives(equipment || {});
  const hasLifesteal = passives.find((p) => p.id === "lifesteal");
  const hasDoubleStrike = passives.find((p) => p.id === "double_strike");
  const hasRevive = passives.find((p) => p.id === "revive");

  // ── Player turn: process status effects + cooldowns ─────
  const startPlayerTurn = useCallback((currentPlayer) => {
    let p = tickCooldowns(currentPlayer);
    const { entity, logs, skipTurn } = processStatusEffects(p);
    p = entity;
    logs.forEach((l) => addLog(l.text, l.type));

    if (p.hp <= 0) {
      // Check revive
      if (hasRevive && !p.reviveUsed) {
        p = { ...p, hp: Math.round(p.maxHp * 0.3), reviveUsed: true };
        addLog("🪶 Phoenix Feather activates! You cling to life!", "special");
      } else {
        addLog("You have been defeated... Your spirit fades.", "system");
        setPlayer(p);
        onDefeat();
        return { player: p, skip: true };
      }
    }

    setPlayer(p);
    return { player: p, skip: skipTurn };
  }, [addLog, hasRevive, onDefeat]);

  // ── Enemy turn logic ────────────────────────────────────
  const resolveEnemyTurn = useCallback((currentPlayer, currentEnemy) => {
    // Process enemy status effects
    let en = tickCooldowns(currentEnemy);
    const { entity: enAfter, logs: enLogs, skipTurn: enSkip } = processStatusEffects(en);
    en = enAfter;
    enLogs.forEach((l) => addLog(l.text, l.type));

    if (en.hp <= 0) {
      addLog(`🏆 ${en.name} crumbles from status effects! Victory!`, "system");
      setEnemy(en);
      setAnimState((s) => ({ ...s, enemy: "defeat" }));
      onVictory();
      return;
    }

    if (enSkip) {
      setEnemy(en);
      return;
    }

    // Boss phase checks
    const phases = checkBossPhases(en);
    for (const phase of phases) {
      en = applyBossPhase(en, phase);
      if (phase.enrage) addLog(`💢 ${en.name} enters a rage! Power surges!`, "enemy");
      if (phase.heal) addLog(`💚 ${en.name} regenerates ${phase.heal} HP!`, "enemy");
    }

    // Decide action
    const decision = decideEnemyAction(en);
    let p = { ...currentPlayer, isDefending: false }; // reset player defend

    if (decision.action === "attack") {
      const result = calculateDamage(en, p, null, null);
      setAnimState((s) => ({ ...s, enemy: "attack" }));
      setTimeout(() => setAnimState((s) => ({ ...s, enemy: "idle" })), 400);

      if (p.isDefending) {
        addLog(`${en.icon} ${en.name} strikes! You brace and take only ${result.damage} damage.`, "enemy");
      } else {
        addLog(`${en.icon} ${en.name} attacks for ${result.damage} damage!${result.isCrit ? " CRITICAL!" : ""}`, "enemy");
      }

      p.hp = clamp(p.hp - result.damage, 0, p.maxHp);
      setAnimState((s) => ({ ...s, player: "hit" }));
      setTimeout(() => setAnimState((s) => ({ ...s, player: "idle" })), 400);

    } else if (decision.action === "defend") {
      en = { ...en, isDefending: true };
      addLog(`${en.icon} ${en.name} takes a defensive stance...`, "enemy");

    } else if (decision.action === "heal") {
      const healAmt = randInt(
        Math.round(en.maxHp * 0.06),
        Math.round(en.maxHp * 0.12)
      );
      en.hp = clamp(en.hp + healAmt, 0, en.maxHp);
      addLog(`${en.icon} ${en.name} regenerates ${healAmt} HP!`, "enemy");
      setAnimState((s) => ({ ...s, enemy: "heal" }));
      setTimeout(() => setAnimState((s) => ({ ...s, enemy: "idle" })), 400);
    }

    setEnemy(en);
    setPlayer(p);

    // Check player defeat
    if (p.hp <= 0) {
      if (hasRevive && !p.reviveUsed) {
        p = { ...p, hp: Math.round(p.maxHp * 0.3), reviveUsed: true };
        addLog("🪶 Phoenix Feather activates! You cling to life!", "special");
        setPlayer(p);
      } else {
        addLog("You have been defeated... Your spirit fades.", "system");
        onDefeat();
      }
    }
  }, [addLog, hasRevive, onVictory, onDefeat]);

  // ── Schedule enemy turn with delay ──────────────────────
  const scheduleEnemyTurn = useCallback((currentPlayer, currentEnemy) => {
    setTurnLock(true);
    setTimeout(() => {
      resolveEnemyTurn(currentPlayer, currentEnemy);
      setTurnLock(false);
    }, COMBAT.ENEMY_TURN_DELAY);
  }, [resolveEnemyTurn]);

  // ══════════════════════════════════════════════════════
  // PLAYER ACTIONS (exposed to UI)
  // ══════════════════════════════════════════════════════

  const basicAttack = useCallback(() => {
    if (turnLock) return;
    const { player: p, skip } = startPlayerTurn(player);
    if (skip || p.hp <= 0) return;

    const result = calculateDamage(p, enemy, null, equipment);

    setAnimState((s) => ({ ...s, player: "attack" }));
    setTimeout(() => setAnimState((s) => ({ ...s, player: "idle" })), 400);
    setAnimState((s) => ({ ...s, enemy: "hit" }));
    setTimeout(() => setAnimState((s) => ({ ...s, enemy: "idle" })), 500);

    addLog(`⚔️ You strike with your Spirit Blade for ${result.damage} damage!${result.isCrit ? " CRITICAL HIT!" : ""}`, "player");
    if (result.effectivenessLabel) {
      addLog(result.effectivenessLabel.text, "system");
    }

    // Lifesteal
    let updatedPlayer = { ...p };
    if (hasLifesteal) {
      const stolen = Math.round(result.damage * hasLifesteal.lifestealPct);
      updatedPlayer.hp = clamp(updatedPlayer.hp + stolen, 0, updatedPlayer.maxHp);
      if (stolen > 0) addLog(`🖤 Lifesteal restores ${stolen} HP.`, "heal");
    }

    // Double strike check
    let totalDmg = result.damage;
    if (hasDoubleStrike && Math.random() < hasDoubleStrike.doubleChance) {
      const result2 = calculateDamage(p, enemy, null, equipment);
      totalDmg += result2.damage;
      addLog(`⛓️ Double Strike! Extra ${result2.damage} damage!`, "special");
    }

    const en = { ...enemy, hp: clamp(enemy.hp - totalDmg, 0, enemy.maxHp) };
    setEnemy(en);
    setPlayer(updatedPlayer);

    if (en.hp <= 0) {
      addLog(`🏆 ${en.name} is vanquished! Victory is yours!`, "system");
      setAnimState((s) => ({ ...s, enemy: "defeat" }));
      onVictory();
      return;
    }
    scheduleEnemyTurn(updatedPlayer, en);
  }, [turnLock, player, enemy, equipment, startPlayerTurn, addLog,
      hasLifesteal, hasDoubleStrike, onVictory, scheduleEnemyTurn]);

  const guard = useCallback(() => {
    if (turnLock) return;
    const { player: p, skip } = startPlayerTurn(player);
    if (skip || p.hp <= 0) return;

    const guarding = { ...p, isDefending: true };
    const seGain = COMBAT.GUARD_SE_REGEN;
    guarding.se = clamp(guarding.se + seGain, 0, guarding.maxSe);

    addLog("🛡️ You raise your guard, bracing for impact.", "player");
    addLog(`✨ +${seGain} Spirit Energy recovered.`, "heal");

    setPlayer(guarding);
    scheduleEnemyTurn(guarding, enemy);
  }, [turnLock, player, enemy, startPlayerTurn, addLog, scheduleEnemyTurn]);

  const useSkill = useCallback((skillId) => {
    if (turnLock) return;
    const skill = getSkillById(skillId);
    if (!skill) return;

    const { player: p, skip } = startPlayerTurn(player);
    if (skip || p.hp <= 0) return;

    // Check cooldown
    if (p.cooldowns?.[skillId] > 0) {
      addLog(`❌ ${skill.name} is on cooldown (${p.cooldowns[skillId]} turns).`, "system");
      return;
    }

    // Check SE cost
    if (p.se < skill.seCost) {
      addLog(`❌ Not enough Spirit Energy for ${skill.name}! (Need ${skill.seCost})`, "system");
      return;
    }

    let updatedPlayer = { ...p, se: p.se - skill.seCost };
    updatedPlayer = setCooldown(updatedPlayer, skillId, skill.cooldown);

    // Animate
    setAnimState((s) => ({ ...s, player: "special" }));
    setTimeout(() => setAnimState((s) => ({ ...s, player: "idle" })), 600);

    let en = { ...enemy };

    if (skill.type === "damage") {
      const result = calculateDamage(updatedPlayer, en, skill, equipment);
      en.hp = clamp(en.hp - result.damage, 0, en.maxHp);

      setAnimState((s) => ({ ...s, enemy: "hit" }));
      setTimeout(() => setAnimState((s) => ({ ...s, enemy: "idle" })), 500);

      if (result.hits > 1) {
        addLog(`🔥 ${skill.name}! ${result.hits} hits for ${result.damage} total damage!${result.isCrit ? " CRITICAL!" : ""}`, "special");
      } else {
        addLog(`🔥 ${skill.name} deals ${result.damage} damage!${result.isCrit ? " CRITICAL!" : ""}`, "special");
      }
      if (result.effectivenessLabel) {
        addLog(result.effectivenessLabel.text, "system");
      }

      // Status application
      if (skill.statusApply && Math.random() < skill.statusApply.chance) {
        en = applyStatus(en, skill.statusApply.id);
        const fxName = skill.statusApply.id.replace(/_/g, " ");
        addLog(`${en.name} is afflicted with ${fxName}!`, "status");
      }

      // Self-heal component (e.g., bulwark pulse)
      if (skill.selfHeal) {
        const healAmt = Math.round(result.damage * skill.selfHeal);
        updatedPlayer.hp = clamp(updatedPlayer.hp + healAmt, 0, updatedPlayer.maxHp);
        addLog(`💚 You recover ${healAmt} HP from the strike.`, "heal");
      }

      // Lifesteal
      if (hasLifesteal) {
        const stolen = Math.round(result.damage * hasLifesteal.lifestealPct);
        updatedPlayer.hp = clamp(updatedPlayer.hp + stolen, 0, updatedPlayer.maxHp);
        if (stolen > 0) addLog(`🖤 Lifesteal restores ${stolen} HP.`, "heal");
      }

    } else if (skill.type === "heal") {
      const healAmt = Math.round(updatedPlayer.maxHp * skill.power * 0.3);
      updatedPlayer.hp = clamp(updatedPlayer.hp + healAmt, 0, updatedPlayer.maxHp);
      addLog(`💚 ${skill.name} restores ${healAmt} HP!`, "heal");
      setAnimState((s) => ({ ...s, player: "heal" }));
      setTimeout(() => setAnimState((s) => ({ ...s, player: "idle" })), 500);

    } else if (skill.type === "buff") {
      if (skill.statusApply) {
        updatedPlayer = applyStatus(updatedPlayer, skill.statusApply.id);
        addLog(`✨ ${skill.name} activated!`, "special");
      }
      if (skill.effect === "dodge") {
        updatedPlayer.dodgeNext = true;
        addLog(`💨 ${skill.name} — you'll dodge the next attack!`, "special");
      }
      if (skill.effect === "counter") {
        updatedPlayer.counterActive = true;
        addLog(`⚡ ${skill.name} — you'll counter the next attack!`, "special");
      }
      if (skill.effect === "fortress") {
        updatedPlayer.isDefending = true;
        updatedPlayer = applyStatus(updatedPlayer, "shield");
        addLog(`🏰 ${skill.name} — impenetrable defense!`, "special");
      }
      if (skill.effect === "def_up") {
        updatedPlayer.def = Math.round(updatedPlayer.def * 1.3);
        addLog(`🛡️ ${skill.name} — defense increased!`, "special");
      }

    } else if (skill.type === "shield") {
      updatedPlayer = applyStatus(updatedPlayer, "shield");
      addLog(`🔷 ${skill.name} — spirit shield activated!`, "special");
      setAnimState((s) => ({ ...s, player: "defend" }));
      setTimeout(() => setAnimState((s) => ({ ...s, player: "idle" })), 500);

    } else if (skill.type === "debuff") {
      if (skill.statusApply && Math.random() < skill.statusApply.chance) {
        en = applyStatus(en, skill.statusApply.id);
        addLog(`💜 ${skill.name} afflicts ${en.name}!`, "special");
      }
      if (skill.effect === "se_steal") {
        const stealAmt = skill.stealAmount || 15;
        const stolen = Math.min(stealAmt, en.se || 0);
        en.se = Math.max(0, (en.se || 0) - stolen);
        updatedPlayer.se = clamp(updatedPlayer.se + stolen, 0, updatedPlayer.maxSe);
        addLog(`💜 Stole ${stolen} SE from ${en.name}!`, "special");
      }
    }

    setPlayer(updatedPlayer);
    setEnemy(en);

    // Check victory
    if (en.hp <= 0) {
      addLog(`🏆 ${en.name} is obliterated! Flawless victory!`, "system");
      setAnimState((s) => ({ ...s, enemy: "defeat" }));
      onVictory();
      return;
    }

    scheduleEnemyTurn(updatedPlayer, en);
  }, [turnLock, player, enemy, equipment, startPlayerTurn, addLog,
      hasLifesteal, onVictory, scheduleEnemyTurn]);

  const run = useCallback(() => {
    if (turnLock) return;
    const { player: p, skip } = startPlayerTurn(player);
    if (skip || p.hp <= 0) return;

    const speedDiff = p.spd - enemy.spd;
    const fleeChance = clamp(0.45 + speedDiff * 0.03, 0.25, 0.9);
    const escaped = Math.random() < fleeChance;

    if (escaped) {
      addLog("🏃 You break away from combat and retreat safely.", "system");
      onRun?.();
      return;
    }

    addLog("❌ Escape failed! The enemy blocks your path.", "enemy");
    scheduleEnemyTurn(p, enemy);
  }, [turnLock, startPlayerTurn, player, enemy, addLog, onRun, scheduleEnemyTurn]);

  return {
    player, enemy, log, turnLock, animState,
    actions: { basicAttack, guard, run, useSkill },
    addLog,
  };
}
