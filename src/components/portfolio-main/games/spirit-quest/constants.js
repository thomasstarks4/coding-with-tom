// ============================================================
// Spirit Quest: Spirit Sword — Constants & Configuration
// All tuning numbers, enums, and lookup tables live here.
// ============================================================

// ─── Utility helpers ────────────────────────────────────────
export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ─── Player base stats ─────────────────────────────────────
export const PLAYER_BASE = {
  hp: 120,
  maxHp: 120,
  se: 80,
  maxSe: 80,
  atk: 14,
  def: 8,
  spd: 8,
  focus: 5, // crit chance factor
};

// ─── Combat tuning ──────────────────────────────────────────
export const COMBAT = {
  BASE_CRIT_CHANCE: 0.05, // 5%
  CRIT_MULTIPLIER: 1.75,
  FOCUS_CRIT_FACTOR: 0.005, // each focus point adds 0.5% crit
  DEFEND_REDUCTION: 0.5,
  GUARD_SE_REGEN: 8,
  BASIC_ATK_VARIANCE: [0.85, 1.15], // min/max multiplier
  ENEMY_TURN_DELAY: 750, // ms
};

// ─── XP & Leveling ─────────────────────────────────────────
export const XP = {
  BASE_TO_NEXT: 100,
  SCALE_FACTOR: 1.15, // xpToNext = BASE * SCALE^level
  MAX_LEVEL: 50,
};

// Stat gains per level, keyed by level range
export const LEVEL_STAT_GAINS = [
  { maxLevel: 10, hp: 8, se: 4, atk: 2, def: 1, spd: 1, focus: 0 },
  { maxLevel: 25, hp: 6, se: 3, atk: 2, def: 2, spd: 1, focus: 1 },
  { maxLevel: 50, hp: 5, se: 3, atk: 1, def: 2, spd: 2, focus: 2 },
];

// ─── Spirit Paths (classes) ─────────────────────────────────
export const PATHS = {
  brawler: {
    id: "brawler",
    name: "Spirit Brawler",
    description: "Raw physical force amplified by spirit energy. High attack and speed, fragile against magic.",
    icon: "👊",
    color: "from-orange-500 to-red-600",
    textColor: "text-orange-400",
    borderColor: "border-orange-600",
    statMod: { atk: 1.2, spd: 1.1, def: 0.9, hp: 1.0, se: 0.95, focus: 1.0 },
    element: "fire",
  },
  sorcerer: {
    id: "sorcerer",
    name: "Spirit Sorcerer",
    description: "Elemental mastery and energy manipulation. Devastating spirit attacks but fragile constitution.",
    icon: "🔮",
    color: "from-purple-500 to-indigo-600",
    textColor: "text-purple-400",
    borderColor: "border-purple-600",
    statMod: { atk: 0.9, spd: 1.0, def: 0.85, hp: 0.85, se: 1.2, focus: 1.15 },
    element: "shadow",
  },
  armor: {
    id: "armor",
    name: "Spirit Armor",
    description: "Unyielding defense and energy redirection. A fortress on the battlefield, slow but nearly unstoppable.",
    icon: "🛡️",
    color: "from-cyan-500 to-teal-600",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-600",
    statMod: { atk: 0.8, spd: 0.9, def: 1.25, hp: 1.15, se: 1.0, focus: 0.95 },
    element: "light",
  },
};

// ─── Elements ───────────────────────────────────────────────
export const ELEMENTS = ["fire", "water", "wind", "earth", "shadow", "light"];

export const ELEMENT_COLORS = {
  fire: { text: "text-red-400", bg: "bg-red-500", border: "border-red-500", glow: "shadow-red-500/50" },
  water: { text: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500", glow: "shadow-blue-500/50" },
  wind: { text: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500", glow: "shadow-emerald-500/50" },
  earth: { text: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500", glow: "shadow-amber-500/50" },
  shadow: { text: "text-purple-400", bg: "bg-purple-500", border: "border-purple-500", glow: "shadow-purple-500/50" },
  light: { text: "text-yellow-300", bg: "bg-yellow-400", border: "border-yellow-400", glow: "shadow-yellow-400/50" },
};

// ─── Rarity tiers ───────────────────────────────────────────
export const RARITIES = {
  common:    { label: "Common",    weight: 50, color: "text-gray-400",   border: "border-gray-500",   statRange: [1, 3] },
  rare:      { label: "Rare",      weight: 30, color: "text-blue-400",   border: "border-blue-500",   statRange: [4, 7] },
  epic:      { label: "Epic",      weight: 13, color: "text-purple-400", border: "border-purple-500", statRange: [8, 12] },
  legendary: { label: "Legendary", weight: 5,  color: "text-yellow-400", border: "border-yellow-500", statRange: [13, 18] },
  mythic:    { label: "Mythic",    weight: 2,  color: "text-red-400",    border: "border-red-500",    statRange: [19, 25] },
};

export const RARITY_ORDER = ["common", "rare", "epic", "legendary", "mythic"];

// ─── Equipment slots ────────────────────────────────────────
export const EQUIP_SLOTS = ["weapon", "armor", "accessory", "relic", "charm"];

// ─── Status effects ─────────────────────────────────────────
export const STATUS_EFFECTS = {
  burn:         { name: "Burn",         icon: "🔥", duration: 3, color: "text-red-400",    tick: (target) => ({ hpLoss: Math.round(target.maxHp * 0.05), defMod: -0.1 }) },
  freeze:       { name: "Freeze",       icon: "❄️", duration: 2, color: "text-blue-300",   tick: () => ({ skipChance: 0.5, spdMod: -0.2 }) },
  poison:       { name: "Poison",       icon: "☠️", duration: 4, color: "text-green-400",  tick: (target) => ({ hpLoss: Math.round(target.maxHp * 0.03) }), stackable: true, maxStacks: 3 },
  bleed:        { name: "Bleed",        icon: "🩸", duration: 3, color: "text-red-300",    tick: (_, source) => ({ hpLoss: Math.round((source?.atk || 10) * 0.25) }) },
  spirit_drain: { name: "Spirit Drain", icon: "💜", duration: 2, color: "text-purple-300", tick: () => ({ seLoss: 8 }) },
  regen:        { name: "Regen",        icon: "💚", duration: 3, color: "text-green-300",  tick: (target) => ({ hpGain: Math.round(target.maxHp * 0.05) }) },
  shield:       { name: "Shield",       icon: "🔷", duration: 2, color: "text-cyan-300",   absorb: true },
  enrage:       { name: "Enrage",       icon: "💢", duration: 2, color: "text-red-500",    tick: () => ({ atkMod: 0.3, defMod: -0.15 }) },
  focus_buff:   { name: "Focus",        icon: "🎯", duration: 3, color: "text-yellow-300", tick: () => ({ focusMod: 0.25 }) },
};

// ─── Zones ──────────────────────────────────────────────────
export const ZONES = [
  { id: "whispering_woods", name: "Whispering Woods",  levelRange: [1, 5],   icon: "🌲", color: "from-green-800 to-emerald-900",  unlockLevel: 1 },
  { id: "ashen_wastes",     name: "Ashen Wastes",      levelRange: [6, 12],  icon: "🌋", color: "from-orange-800 to-red-900",      unlockLevel: 6 },
  { id: "abyssal_depths",   name: "Abyssal Depths",    levelRange: [13, 20], icon: "🌊", color: "from-blue-800 to-indigo-900",     unlockLevel: 13 },
  { id: "spirit_realm",     name: "Spirit Realm",       levelRange: [21, 35], icon: "👁️", color: "from-purple-800 to-fuchsia-900",  unlockLevel: 21 },
  { id: "celestial_peak",   name: "Celestial Peak",     levelRange: [36, 50], icon: "⛰️", color: "from-yellow-700 to-amber-900",    unlockLevel: 36 },
];

// ─── Battle modifiers (optional difficulty toggles) ─────────
export const BATTLE_MODIFIERS = {
  none:      { label: "Normal",       enemyMul: 1.0, xpMul: 1.0, lootBonus: 0 },
  trial:     { label: "Spirit Trial", enemyMul: 1.25, xpMul: 1.5, lootBonus: 0.1 },
  nightmare: { label: "Nightmare",    enemyMul: 1.5, xpMul: 2.0, lootBonus: 0.25 },
};

// ─── Inventory limits ───────────────────────────────────────
export const MAX_INVENTORY = 20;

// ─── Crafting costs (spirit shards) by rarity output ────────
export const CRAFT_COSTS = {
  rare: 50,
  epic: 150,
  legendary: 400,
  mythic: 1000,
};

// ─── Upgrade costs per level ────────────────────────────────
export const UPGRADE_MAX = 5;
export const UPGRADE_COST_PER_LEVEL = { gold: 100, shards: 30 }; // multiplied by upgrade level
