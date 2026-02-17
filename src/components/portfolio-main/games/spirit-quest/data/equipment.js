// ============================================================
// Equipment Database
// Items organized by slot. Each item has stats, rarity, element,
// optional passive effect, and flavor lore.
//
// Slots: weapon, armor, accessory, relic, charm
// ============================================================

import { randInt, pick, RARITIES, EQUIP_SLOTS } from "../constants";

// ─── Base item templates (used by loot engine to generate drops) ──

const WEAPON_BASES = [
  { name: "Spirit Blade",     icon: "🗡️", element: "light",  statFocus: "atk" },
  { name: "Soul Gauntlets",   icon: "🥊", element: "fire",   statFocus: "atk" },
  { name: "Phantom Wand",     icon: "🪄", element: "shadow", statFocus: "se" },
  { name: "Storm Halberd",    icon: "🔱", element: "wind",   statFocus: "atk" },
  { name: "Tidal Trident",    icon: "🔱", element: "water",  statFocus: "atk" },
  { name: "Earth Maul",       icon: "🔨", element: "earth",  statFocus: "atk" },
  { name: "Void Dagger",      icon: "🗡️", element: "shadow", statFocus: "spd" },
  { name: "Radiant Staff",    icon: "✨", element: "light",  statFocus: "focus" },
];

const ARMOR_BASES = [
  { name: "Iron Spirit Vest", icon: "🦺", element: "earth",  statFocus: "def" },
  { name: "Ethereal Robe",    icon: "👘", element: "shadow", statFocus: "se" },
  { name: "Flame Guard Mail", icon: "🔥", element: "fire",   statFocus: "def" },
  { name: "Tide Scale Armor", icon: "🐚", element: "water",  statFocus: "hp" },
  { name: "Windweave Cloak",  icon: "🧥", element: "wind",   statFocus: "spd" },
  { name: "Radiant Plate",    icon: "🛡️", element: "light",  statFocus: "def" },
];

const ACCESSORY_BASES = [
  { name: "Crit Ring",         icon: "💍", passive: { id: "crit_boost",  desc: "+8% Crit Chance",      focus: 4 } },
  { name: "Spirit Anklet",     icon: "⛓️", passive: { id: "se_regen",    desc: "+3 SE per turn",       sePerTurn: 3 } },
  { name: "Vitality Pendant",  icon: "📿", passive: { id: "hp_regen",    desc: "+3% HP regen per turn", hpRegenPct: 0.03 } },
  { name: "Swiftness Band",    icon: "💨", passive: { id: "speed_boost", desc: "+3 Speed",             spd: 3 } },
  { name: "Guard Charm",       icon: "🔰", passive: { id: "def_boost",   desc: "+3 Defense",           def: 3 } },
];

const RELIC_BASES = [
  { name: "Heart of the Void",   icon: "🖤", passive: { id: "lifesteal",    desc: "Heal 10% of damage dealt",   lifestealPct: 0.10 }, lore: "Torn from the chest of an ancient spirit lord." },
  { name: "Phoenix Feather",     icon: "🪶", passive: { id: "revive",       desc: "Survive a killing blow once (resets per battle)", revive: true }, lore: "The feather burns but never turns to ash." },
  { name: "Eye of Eternity",     icon: "👁️", passive: { id: "xp_boost",     desc: "+25% XP from battles",      xpMul: 1.25 }, lore: "It sees all timelines at once." },
  { name: "Spirit Chain Links",  icon: "⛓️", passive: { id: "double_strike", desc: "15% chance to strike twice", doubleChance: 0.15 }, lore: "Chains that bind the living to the dead." },
];

const CHARM_BASES = [
  { name: "Flame Charm",     icon: "🔥", effect: { atkBoost: 5 },  duration: 3, desc: "+5 ATK for 3 battles" },
  { name: "Shield Charm",    icon: "🛡️", effect: { defBoost: 5 },  duration: 3, desc: "+5 DEF for 3 battles" },
  { name: "Haste Charm",     icon: "💨", effect: { spdBoost: 5 },  duration: 3, desc: "+5 SPD for 3 battles" },
  { name: "Spirit Charm",    icon: "💜", effect: { seBoost: 15 },  duration: 3, desc: "+15 SE for 3 battles" },
  { name: "Fortune Charm",   icon: "🍀", effect: { luckBoost: 10 }, duration: 3, desc: "+10% Loot Bonus for 3 battles" },
];

// ─── Lookup tables ──────────────────────────────────────────
const BASES_BY_SLOT = {
  weapon: WEAPON_BASES,
  armor: ARMOR_BASES,
  accessory: ACCESSORY_BASES,
  relic: RELIC_BASES,
  charm: CHARM_BASES,
};

/**
 * Generate a random equipment item for a given slot and rarity.
 * @param {string} slot - equipment slot
 * @param {string} rarity - rarity key
 * @returns {object} fully-formed item
 */
export function generateItem(slot, rarity) {
  const bases = BASES_BY_SLOT[slot];
  if (!bases || bases.length === 0) return null;

  const base = pick(bases);
  const rarityData = RARITIES[rarity];
  const [minStat, maxStat] = rarityData.statRange;

  const item = {
    id: `${base.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}_${randInt(0, 999)}`,
    name: `${rarityData.label} ${base.name}`,
    slot,
    rarity,
    icon: base.icon,
    stats: {},
    passive: base.passive || null,
    lore: base.lore || null,
    element: base.element || null,
    upgradeLevel: 0,
  };

  // Generate stats based on slot type
  if (slot === "weapon") {
    item.stats.atk = randInt(minStat, maxStat);
    if (base.statFocus === "se") item.stats.se = randInt(minStat, maxStat);
    if (base.statFocus === "spd") item.stats.spd = randInt(Math.max(1, minStat - 1), Math.max(2, maxStat - 2));
    if (base.statFocus === "focus") item.stats.focus = randInt(Math.max(1, minStat - 1), Math.max(2, maxStat - 2));
  } else if (slot === "armor") {
    item.stats.def = randInt(minStat, maxStat);
    if (base.statFocus === "hp") item.stats.hp = randInt(minStat * 3, maxStat * 3);
    if (base.statFocus === "se") item.stats.se = randInt(minStat, maxStat);
    if (base.statFocus === "spd") item.stats.spd = randInt(Math.max(1, minStat - 1), Math.max(2, maxStat - 2));
  } else if (slot === "accessory") {
    // Accessories give passive-defined stats
    Object.entries(base.passive || {}).forEach(([k, v]) => {
      if (typeof v === "number" && k !== "id") item.stats[k] = v;
    });
  } else if (slot === "relic") {
    // Relics have unique passives, minimal raw stats
    item.stats.atk = randInt(0, Math.round(maxStat * 0.3));
    item.stats.def = randInt(0, Math.round(maxStat * 0.3));
  } else if (slot === "charm") {
    // Charms are consumable — store duration
    item.charmEffect = base.effect;
    item.charmDuration = base.duration;
    item.charmDesc = base.desc;
  }

  return item;
}

/**
 * Get the total stat bonuses from all equipped items.
 * @param {object} equipment - { weapon, armor, accessory, relic, charm }
 * @returns {object} { atk, def, hp, se, spd, focus }
 */
export function getEquipmentBonuses(equipment) {
  const bonuses = { atk: 0, def: 0, hp: 0, se: 0, spd: 0, focus: 0 };
  for (const slot of EQUIP_SLOTS) {
    const item = equipment[slot];
    if (!item) continue;
    for (const [stat, val] of Object.entries(item.stats || {})) {
      if (bonuses.hasOwnProperty(stat)) {
        bonuses[stat] += val;
      }
    }
  }
  return bonuses;
}

/**
 * Get all passives from equipped items.
 * @returns {object[]} array of passive objects
 */
export function getEquipmentPassives(equipment) {
  const passives = [];
  for (const slot of EQUIP_SLOTS) {
    const item = equipment[slot];
    if (item?.passive) passives.push(item.passive);
  }
  return passives;
}

export { WEAPON_BASES, ARMOR_BASES, ACCESSORY_BASES, RELIC_BASES, CHARM_BASES };
