// ============================================================
// Battle State — damage formulas, status effects, turn resolution
// All combat math lives here. Pure functions, no React dependency.
// ============================================================

import { COMBAT, STATUS_EFFECTS, clamp } from "../constants";
import { getElementMultiplier, getEffectivenessLabel } from "../data/elements";

// ─── Damage calculation ─────────────────────────────────────

/**
 * Calculate raw damage for an attack.
 * @param {object} attacker - combat entity (atk, focus, etc.)
 * @param {object} defender - combat entity (def, etc.)
 * @param {object|null} skill  - skill object or null for basic attack
 * @param {object|null} equipment - attacker's equipment (for passives)
 * @returns {{ damage, isCrit, elementMul, effectivenessLabel }}
 */
export function calculateDamage(attacker, defender, skill = null, equipment = null) {
  // Base damage
  const atkStat = getModifiedStat(attacker, "atk");
  const defStat = getModifiedStat(defender, "def");

  const [minVar, maxVar] = COMBAT.BASIC_ATK_VARIANCE;
  const variance = minVar + Math.random() * (maxVar - minVar);

  let baseDmg;
  if (skill && skill.type === "damage") {
    baseDmg = atkStat * skill.power * variance;
  } else {
    baseDmg = atkStat * variance;
  }

  // Defense reduction: dmg * atk / (atk + def)
  const defFactor = atkStat / (atkStat + defStat);
  baseDmg *= defFactor;

  // Armor pierce (some skills ignore a portion of defense)
  if (skill?.armorPierce) {
    const pierce = skill.armorPierce; // e.g., 0.4 = ignore 40% def
    const extraDmg = atkStat * skill.power * variance * pierce * (1 - defFactor);
    baseDmg += extraDmg;
  }

  // Elemental multiplier
  const attackElement = skill?.element || null;
  const defenderElement = defender.element || null;
  const elementMul = getElementMultiplier(attackElement, defenderElement);
  baseDmg *= elementMul;
  const effectivenessLabel = getEffectivenessLabel(elementMul);

  // Defending reduction
  if (defender.isDefending) {
    baseDmg *= COMBAT.DEFEND_REDUCTION;
  }

  // Critical hit
  const focusStat = getModifiedStat(attacker, "focus");
  const critChance = COMBAT.BASE_CRIT_CHANCE + focusStat * COMBAT.FOCUS_CRIT_FACTOR;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    baseDmg *= COMBAT.CRIT_MULTIPLIER;
  }

  // Multi-hit skills
  const hits = skill?.hits || 1;
  const damagePerHit = Math.round(baseDmg / hits);
  const totalDamage = damagePerHit * hits;

  return {
    damage: Math.max(1, totalDamage), // minimum 1 damage
    damagePerHit: Math.max(1, damagePerHit),
    hits,
    isCrit,
    elementMul,
    effectivenessLabel,
  };
}

/**
 * Calculate heal amount for a heal-type skill.
 */
export function calculateHeal(caster, skill) {
  const seStat = getModifiedStat(caster, "se");
  const healBase = seStat * (skill?.power || 1.0) * 0.5;
  return Math.round(healBase);
}

/**
 * Calculate shield absorb amount.
 */
export function calculateShield(caster, skill) {
  const defStat = getModifiedStat(caster, "def");
  return Math.round(defStat * (skill?.power || 1.0) * 1.5);
}

// ─── Status effect processing ───────────────────────────────

/**
 * Tick all status effects on an entity at the start of their turn.
 * Returns { entity, logs, skipTurn }.
 * Does NOT mutate — returns new objects.
 */
export function processStatusEffects(entity, source = null) {
  let e = { ...entity, statusEffects: [...entity.statusEffects] };
  const logs = [];
  let skipTurn = false;

  const remaining = [];

  for (let fx of e.statusEffects) {
    const template = STATUS_EFFECTS[fx.id];
    if (!template) { remaining.push(fx); continue; }

    const tick = template.tick?.(e, source);

    if (tick) {
      // HP loss
      if (tick.hpLoss) {
        e.hp = clamp(e.hp - tick.hpLoss, 0, e.maxHp);
        logs.push({ text: `${template.icon} ${template.name} deals ${tick.hpLoss} damage to ${e.name || "you"}!`, type: "status" });
      }
      // HP gain
      if (tick.hpGain) {
        e.hp = clamp(e.hp + tick.hpGain, 0, e.maxHp);
        logs.push({ text: `${template.icon} ${template.name} restores ${tick.hpGain} HP.`, type: "heal" });
      }
      // SE loss
      if (tick.seLoss) {
        e.se = clamp((e.se || 0) - tick.seLoss, 0, e.maxSe || 999);
        logs.push({ text: `${template.icon} ${template.name} drains ${tick.seLoss} SE!`, type: "status" });
      }
      // Skip chance (freeze)
      if (tick.skipChance && Math.random() < tick.skipChance) {
        skipTurn = true;
        logs.push({ text: `${template.icon} ${e.name || "You"} is frozen and can't move!`, type: "status" });
      }
    }

    // Decrement duration
    const updated = { ...fx, turnsLeft: fx.turnsLeft - 1 };
    if (updated.turnsLeft > 0) {
      remaining.push(updated);
    } else {
      logs.push({ text: `${template.icon} ${template.name} wore off.`, type: "system" });
    }
  }

  e.statusEffects = remaining;
  return { entity: e, logs, skipTurn };
}

/**
 * Apply a status effect to an entity.
 */
export function applyStatus(entity, statusId, stacks = 1) {
  const template = STATUS_EFFECTS[statusId];
  if (!template) return entity;

  const e = { ...entity, statusEffects: [...entity.statusEffects] };

  // Check if already has this status
  const existingIdx = e.statusEffects.findIndex((fx) => fx.id === statusId);

  if (existingIdx >= 0) {
    // Stackable?
    if (template.stackable) {
      const existing = e.statusEffects[existingIdx];
      if ((existing.stacks || 1) < (template.maxStacks || 1)) {
        e.statusEffects[existingIdx] = {
          ...existing,
          stacks: (existing.stacks || 1) + 1,
          turnsLeft: template.duration, // refresh duration
        };
      } else {
        // Max stacks — just refresh duration
        e.statusEffects[existingIdx] = { ...existing, turnsLeft: template.duration };
      }
    } else {
      // Not stackable — just refresh duration
      e.statusEffects[existingIdx] = { ...e.statusEffects[existingIdx], turnsLeft: template.duration };
    }
  } else {
    // Apply new
    e.statusEffects.push({
      id: statusId,
      turnsLeft: template.duration,
      stacks: 1,
    });
  }

  return e;
}

// ─── Get modified stat (base + status mods) ─────────────────

/**
 * Get a stat with all active status modifiers applied.
 */
export function getModifiedStat(entity, statName) {
  let base = entity[statName] || 0;

  for (const fx of entity.statusEffects || []) {
    const template = STATUS_EFFECTS[fx.id];
    if (!template?.tick) continue;
    const tick = template.tick(entity);
    const modKey = `${statName}Mod`;
    if (tick[modKey]) {
      base = Math.round(base * (1 + tick[modKey]) * (fx.stacks || 1));
    }
  }

  return Math.max(0, base);
}

// ─── Reduce cooldowns ───────────────────────────────────────

/**
 * Decrement all cooldowns by 1 at the start of a turn.
 */
export function tickCooldowns(combatEntity) {
  const cd = { ...combatEntity.cooldowns };
  for (const key of Object.keys(cd)) {
    cd[key] = Math.max(0, cd[key] - 1);
    if (cd[key] === 0) delete cd[key];
  }
  return { ...combatEntity, cooldowns: cd };
}

/**
 * Set a cooldown for a skill after use.
 */
export function setCooldown(combatEntity, skillId, cooldownTurns) {
  if (!cooldownTurns || cooldownTurns <= 0) return combatEntity;
  return {
    ...combatEntity,
    cooldowns: { ...combatEntity.cooldowns, [skillId]: cooldownTurns },
  };
}

// ─── Enemy AI ───────────────────────────────────────────────

/**
 * Decide the enemy's action based on AI type.
 * Returns { action: "attack" | "defend" | "heal", skill?: object }
 */
export function decideEnemyAction(enemy) {
  const hpPct = enemy.hp / enemy.maxHp;
  const roll = Math.random();

  switch (enemy.ai) {
    case "aggressive":
      if (roll < 0.75) return { action: "attack" };
      if (roll < 0.90) return { action: "defend" };
      return { action: "heal" };

    case "defensive":
      if (hpPct < 0.4) return { action: "heal" };
      if (roll < 0.35) return { action: "attack" };
      if (roll < 0.70) return { action: "defend" };
      return { action: "heal" };

    case "balanced":
      if (hpPct < 0.3) return { action: "heal" };
      if (roll < 0.55) return { action: "attack" };
      if (roll < 0.80) return { action: "defend" };
      return { action: "heal" };

    case "boss":
      // Boss: aggressive when healthy, self-heal when hurt
      if (hpPct < 0.25) return Math.random() < 0.6 ? { action: "heal" } : { action: "attack" };
      if (hpPct < 0.5) return roll < 0.5 ? { action: "attack" } : { action: "heal" };
      if (roll < 0.70) return { action: "attack" };
      return { action: "defend" };

    default:
      return { action: "attack" };
  }
}

/**
 * Check if a boss should trigger a phase change based on current HP.
 * Returns array of triggered phases (each has enrage/heal).
 */
export function checkBossPhases(enemy) {
  if (!enemy.isBoss || !enemy.phases) return [];
  const hpPct = enemy.hp / enemy.maxHp;
  const triggered = [];

  for (const phase of enemy.phases) {
    if (hpPct <= phase.hpPct && !enemy.phaseTriggered.includes(phase.hpPct)) {
      triggered.push(phase);
    }
  }

  return triggered;
}

/**
 * Apply boss phase effect.
 */
export function applyBossPhase(enemy, phase) {
  let e = { ...enemy, phaseTriggered: [...enemy.phaseTriggered, phase.hpPct] };

  if (phase.enrage) {
    e = applyStatus(e, "enrage");
  }
  if (phase.heal) {
    e.hp = clamp(e.hp + phase.heal, 0, e.maxHp);
  }

  return e;
}
