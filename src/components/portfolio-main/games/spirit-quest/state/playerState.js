// ============================================================
// Player State — creation, leveling, stat calculation, persistence
// ============================================================

import {
  PLAYER_BASE, XP, LEVEL_STAT_GAINS, PATHS,
  MAX_INVENTORY,
} from "../constants";
import { getEquipmentBonuses } from "../data/equipment";
import { getUnlockedSkills } from "../data/skills";

/**
 * Create a fresh player state (new game).
 */
export function createPlayer(name = "Spirit Channeler") {
  return {
    name,
    path: null, // set during path selection
    level: 1,
    xp: 0,
    xpToNext: XP.BASE_TO_NEXT,
    ascension: 0,

    // Base stats (before equipment/path modifiers)
    baseStats: { ...PLAYER_BASE },

    // Equipment slots
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
      relic: null,
      charm: null,
    },

    // Inventory (bag)
    inventory: [],

    // Unlocked skill IDs
    unlockedSkills: [],
    // Currently equipped skills (max 4 for combat)
    activeSkills: [],

    // Currency
    gold: 0,
    spiritShards: 0,

    // Charm remaining battles
    charmBattlesLeft: 0,

    // Combat-only state (reset each battle)
    combatState: null,

    // Tracking
    battlesWon: 0,
    totalDamageDealt: 0,
    highestZone: "whispering_woods",
  };
}

/**
 * Calculate XP needed for a given level.
 */
export function xpForLevel(level) {
  return Math.floor(XP.BASE_TO_NEXT * Math.pow(XP.SCALE_FACTOR, level - 1));
}

/**
 * Get stat gains for leveling up at the given level.
 */
function getStatGains(level) {
  for (const tier of LEVEL_STAT_GAINS) {
    if (level <= tier.maxLevel) {
      return { hp: tier.hp, se: tier.se, atk: tier.atk, def: tier.def, spd: tier.spd, focus: tier.focus };
    }
  }
  // Fallback: last tier
  const last = LEVEL_STAT_GAINS[LEVEL_STAT_GAINS.length - 1];
  return { hp: last.hp, se: last.se, atk: last.atk, def: last.def, spd: last.spd, focus: last.focus };
}

/**
 * Apply XP gain. Returns { player, levelsGained, statGains, newSkills }.
 * Does NOT mutate the original object.
 */
export function gainXp(player, amount) {
  let p = { ...player, baseStats: { ...player.baseStats } };
  p.xp += amount;

  let levelsGained = 0;
  let totalStatGains = { hp: 0, se: 0, atk: 0, def: 0, spd: 0, focus: 0 };
  const newSkills = [];

  while (p.xp >= p.xpToNext && p.level < XP.MAX_LEVEL) {
    p.xp -= p.xpToNext;
    p.level += 1;
    levelsGained += 1;
    p.xpToNext = xpForLevel(p.level);

    // Apply stat gains
    const gains = getStatGains(p.level);
    p.baseStats.hp += gains.hp;
    p.baseStats.maxHp += gains.hp;
    p.baseStats.se += gains.se;
    p.baseStats.maxSe += gains.se;
    p.baseStats.atk += gains.atk;
    p.baseStats.def += gains.def;
    p.baseStats.spd += gains.spd;
    p.baseStats.focus += gains.focus;

    for (const key of Object.keys(totalStatGains)) {
      totalStatGains[key] += gains[key];
    }

    // Check for new skill unlocks
    if (p.path) {
      const available = getUnlockedSkills(p.path, p.level);
      for (const skill of available) {
        if (!p.unlockedSkills.includes(skill.id)) {
          p.unlockedSkills.push(skill.id);
          newSkills.push(skill);
          // Auto-equip if < 4 active skills
          if (p.activeSkills.length < 4) {
            p.activeSkills.push(skill.id);
          }
        }
      }
    }
  }

  // Cap XP at max level
  if (p.level >= XP.MAX_LEVEL) {
    p.xp = 0;
    p.xpToNext = 0;
  }

  return { player: p, levelsGained, statGains: totalStatGains, newSkills };
}

/**
 * Apply path selection. Modifies base stats with path multipliers
 * and unlocks starting skills.
 */
export function applyPath(player, pathId) {
  const path = PATHS[pathId];
  if (!path) return player;

  const p = { ...player, baseStats: { ...player.baseStats } };
  p.path = pathId;

  // Apply path stat modifiers to base stats
  p.baseStats.hp = Math.round(p.baseStats.hp * path.statMod.hp);
  p.baseStats.maxHp = p.baseStats.hp;
  p.baseStats.se = Math.round(p.baseStats.se * path.statMod.se);
  p.baseStats.maxSe = p.baseStats.se;
  p.baseStats.atk = Math.round(p.baseStats.atk * path.statMod.atk);
  p.baseStats.def = Math.round(p.baseStats.def * path.statMod.def);
  p.baseStats.spd = Math.round(p.baseStats.spd * path.statMod.spd);
  p.baseStats.focus = Math.round(p.baseStats.focus * path.statMod.focus);

  // Unlock starting skills (level 1 requirement)
  const starting = getUnlockedSkills(pathId, p.level);
  for (const skill of starting) {
    if (!p.unlockedSkills.includes(skill.id)) {
      p.unlockedSkills.push(skill.id);
      if (p.activeSkills.length < 4) {
        p.activeSkills.push(skill.id);
      }
    }
  }

  return p;
}

/**
 * Compute effective stats (base + equipment + ascension bonuses).
 */
export function getEffectiveStats(player) {
  const base = { ...player.baseStats };
  const equipBonus = getEquipmentBonuses(player.equipment);
  const ascensionBonus = 1 + player.ascension * 0.05; // +5% per ascension

  return {
    hp: Math.round((base.hp + (equipBonus.hp || 0)) * ascensionBonus),
    maxHp: Math.round((base.maxHp + (equipBonus.hp || 0)) * ascensionBonus),
    se: Math.round((base.se + (equipBonus.se || 0)) * ascensionBonus),
    maxSe: Math.round((base.maxSe + (equipBonus.se || 0)) * ascensionBonus),
    atk: Math.round((base.atk + (equipBonus.atk || 0)) * ascensionBonus),
    def: Math.round((base.def + (equipBonus.def || 0)) * ascensionBonus),
    spd: Math.round((base.spd + (equipBonus.spd || 0)) * ascensionBonus),
    focus: Math.round((base.focus + (equipBonus.focus || 0)) * ascensionBonus),
  };
}

/**
 * Create combat-ready player state from persistent player.
 */
export function createCombatPlayer(player) {
  const stats = getEffectiveStats(player);
  return {
    ...stats,
    hp: stats.maxHp, // full heal at battle start
    se: stats.maxSe,
    isDefending: false,
    statusEffects: [],
    cooldowns: {}, // skillId → turns remaining
    dodgeNext: false,
    reviveUsed: false,
  };
}

/**
 * Equip an item from inventory.
 * Returns updated player (item moved from inventory → equipment slot).
 */
export function equipItem(player, itemIndex) {
  const item = player.inventory[itemIndex];
  if (!item) return player;

  const p = {
    ...player,
    equipment: { ...player.equipment },
    inventory: [...player.inventory],
  };

  // If something is already equipped in that slot, unequip it to inventory
  const existing = p.equipment[item.slot];
  if (existing) {
    if (p.inventory.length >= MAX_INVENTORY) return player; // no room
    p.inventory.push(existing);
  }

  // Equip new item
  p.equipment[item.slot] = item;
  p.inventory.splice(itemIndex, 1);

  return p;
}

/**
 * Unequip an item from a slot back to inventory.
 */
export function unequipItem(player, slot) {
  const item = player.equipment[slot];
  if (!item) return player;
  if (player.inventory.length >= MAX_INVENTORY) return player;

  const p = {
    ...player,
    equipment: { ...player.equipment },
    inventory: [...player.inventory],
  };
  p.equipment[slot] = null;
  p.inventory.push(item);
  return p;
}

/**
 * Add item to inventory if space available.
 * Returns { player, added: boolean }.
 */
export function addToInventory(player, item) {
  if (player.inventory.length >= MAX_INVENTORY) {
    return { player, added: false };
  }
  return {
    player: { ...player, inventory: [...player.inventory, item] },
    added: true,
  };
}

/**
 * Remove item from inventory by index.
 */
export function removeFromInventory(player, index) {
  const inv = [...player.inventory];
  inv.splice(index, 1);
  return { ...player, inventory: inv };
}
