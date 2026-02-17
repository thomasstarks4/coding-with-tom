// ============================================================
// Enemy Templates — organized by zone
// Each enemy has stats, element, AI behavior, skills, and loot tier.
//
// ai types:
//   "aggressive" — favors attacking (70%)
//   "defensive"  — favors guard/heal (40%), debuffs (30%)
//   "balanced"   — context-aware, heals when low
//   "boss"       — scripted phase changes at HP thresholds
// ============================================================

const ENEMY_TEMPLATES = [
  // ─── Zone 1: Whispering Woods (Lv 1–5) ───────────────
  { id: "shade_wisp",    name: "Shade Wisp",      zone: "whispering_woods", level: 1,  baseHp: 50,  baseAtk: 8,  baseDef: 4,  baseSpd: 6,  element: "shadow", ai: "aggressive", skills: ["basic_attack"],       lootTier: 1, xpReward: 20,  goldReward: 10,  icon: "👻" },
  { id: "hollow_fox",    name: "Hollow Fox",      zone: "whispering_woods", level: 2,  baseHp: 60,  baseAtk: 10, baseDef: 5,  baseSpd: 9,  element: "wind",   ai: "aggressive", skills: ["basic_attack"],       lootTier: 1, xpReward: 25,  goldReward: 12,  icon: "🦊" },
  { id: "moss_wraith",   name: "Moss Wraith",     zone: "whispering_woods", level: 3,  baseHp: 75,  baseAtk: 9,  baseDef: 7,  baseSpd: 5,  element: "earth",  ai: "balanced",   skills: ["basic_attack"],       lootTier: 1, xpReward: 30,  goldReward: 15,  icon: "🌿" },
  { id: "elder_treant",  name: "Elder Treant",    zone: "whispering_woods", level: 5,  baseHp: 130, baseAtk: 14, baseDef: 12, baseSpd: 3,  element: "earth",  ai: "boss",       skills: ["basic_attack"],       lootTier: 2, xpReward: 80,  goldReward: 50,  icon: "🌳", isBoss: true, phases: [{ hpPct: 0.5, enrage: true }] },

  // ─── Zone 2: Ashen Wastes (Lv 6–12) ──────────────────
  { id: "ember_specter",   name: "Ember Specter",    zone: "ashen_wastes", level: 6,  baseHp: 90,  baseAtk: 16, baseDef: 8,  baseSpd: 8,  element: "fire",   ai: "aggressive", skills: ["basic_attack"],       lootTier: 2, xpReward: 45,  goldReward: 25,  icon: "🔥" },
  { id: "cinder_hound",   name: "Cinder Hound",     zone: "ashen_wastes", level: 8,  baseHp: 100, baseAtk: 18, baseDef: 10, baseSpd: 10, element: "fire",   ai: "aggressive", skills: ["basic_attack"],       lootTier: 2, xpReward: 55,  goldReward: 30,  icon: "🐕" },
  { id: "flame_revenant",  name: "Flame Revenant",   zone: "ashen_wastes", level: 10, baseHp: 120, baseAtk: 15, baseDef: 12, baseSpd: 7,  element: "fire",   ai: "balanced",   skills: ["basic_attack"],       lootTier: 2, xpReward: 65,  goldReward: 35,  icon: "💀" },
  { id: "inferno_warden",  name: "Inferno Warden",   zone: "ashen_wastes", level: 12, baseHp: 200, baseAtk: 22, baseDef: 15, baseSpd: 6,  element: "fire",   ai: "boss",       skills: ["basic_attack"],       lootTier: 3, xpReward: 150, goldReward: 100, icon: "🔱", isBoss: true, phases: [{ hpPct: 0.5, enrage: true }, { hpPct: 0.25, heal: 30 }] },

  // ─── Zone 3: Abyssal Depths (Lv 13–20) ───────────────
  { id: "void_leech",     name: "Void Leech",       zone: "abyssal_depths", level: 13, baseHp: 140, baseAtk: 18, baseDef: 14, baseSpd: 7,  element: "water",  ai: "defensive",  skills: ["basic_attack"],       lootTier: 3, xpReward: 80,  goldReward: 45,  icon: "🪱" },
  { id: "deep_phantom",   name: "Deep Phantom",     zone: "abyssal_depths", level: 16, baseHp: 160, baseAtk: 22, baseDef: 16, baseSpd: 9,  element: "shadow", ai: "aggressive", skills: ["basic_attack"],       lootTier: 3, xpReward: 100, goldReward: 55,  icon: "👤" },
  { id: "tidal_horror",   name: "Tidal Horror",     zone: "abyssal_depths", level: 18, baseHp: 180, baseAtk: 20, baseDef: 18, baseSpd: 6,  element: "water",  ai: "balanced",   skills: ["basic_attack"],       lootTier: 3, xpReward: 120, goldReward: 65,  icon: "🐙" },
  { id: "leviathan_shade", name: "Leviathan Shade",  zone: "abyssal_depths", level: 20, baseHp: 300, baseAtk: 28, baseDef: 22, baseSpd: 5,  element: "water",  ai: "boss",       skills: ["basic_attack"],       lootTier: 4, xpReward: 250, goldReward: 180, icon: "🐉", isBoss: true, phases: [{ hpPct: 0.6, enrage: true }, { hpPct: 0.3, heal: 50 }] },

  // ─── Zone 4: Spirit Realm (Lv 21–35) ─────────────────
  { id: "soul_reaper",       name: "Soul Reaper",       zone: "spirit_realm", level: 22, baseHp: 200, baseAtk: 26, baseDef: 18, baseSpd: 11, element: "shadow", ai: "aggressive", skills: ["basic_attack"], lootTier: 4, xpReward: 160, goldReward: 90,  icon: "⚰️" },
  { id: "corrupt_channeler", name: "Corrupt Channeler", zone: "spirit_realm", level: 28, baseHp: 230, baseAtk: 24, baseDef: 22, baseSpd: 8,  element: "shadow", ai: "balanced",   skills: ["basic_attack"], lootTier: 4, xpReward: 200, goldReward: 110, icon: "🧙" },
  { id: "ethereal_knight",   name: "Ethereal Knight",   zone: "spirit_realm", level: 32, baseHp: 260, baseAtk: 30, baseDef: 26, baseSpd: 9,  element: "light",  ai: "defensive",  skills: ["basic_attack"], lootTier: 4, xpReward: 240, goldReward: 130, icon: "⚔️" },
  { id: "hollow_king",       name: "The Hollow King",   zone: "spirit_realm", level: 35, baseHp: 450, baseAtk: 36, baseDef: 30, baseSpd: 7,  element: "shadow", ai: "boss",       skills: ["basic_attack"], lootTier: 5, xpReward: 500, goldReward: 350, icon: "👑", isBoss: true, phases: [{ hpPct: 0.7, enrage: true }, { hpPct: 0.4, heal: 80 }, { hpPct: 0.15, enrage: true }] },

  // ─── Zone 5: Celestial Peak (Lv 36–50) ────────────────
  { id: "astral_sentinel",  name: "Astral Sentinel",   zone: "celestial_peak", level: 38, baseHp: 300, baseAtk: 32, baseDef: 28, baseSpd: 10, element: "light", ai: "balanced",   skills: ["basic_attack"], lootTier: 5, xpReward: 300, goldReward: 200, icon: "✨" },
  { id: "light_eater",      name: "Light Eater",       zone: "celestial_peak", level: 42, baseHp: 340, baseAtk: 36, baseDef: 26, baseSpd: 12, element: "shadow", ai: "aggressive", skills: ["basic_attack"], lootTier: 5, xpReward: 380, goldReward: 250, icon: "🕳️" },
  { id: "storm_herald",     name: "Storm Herald",      zone: "celestial_peak", level: 46, baseHp: 380, baseAtk: 34, baseDef: 30, baseSpd: 11, element: "wind",  ai: "balanced",   skills: ["basic_attack"], lootTier: 5, xpReward: 450, goldReward: 300, icon: "⛈️" },
  { id: "the_nameless_one", name: "The Nameless One",  zone: "celestial_peak", level: 50, baseHp: 600, baseAtk: 44, baseDef: 38, baseSpd: 9,  element: "light",  ai: "boss",       skills: ["basic_attack"], lootTier: 5, xpReward: 1000, goldReward: 700, icon: "🌟", isBoss: true, phases: [{ hpPct: 0.75, enrage: true }, { hpPct: 0.5, heal: 100 }, { hpPct: 0.25, enrage: true }] },
];

/**
 * Get enemies for a specific zone.
 */
export function getEnemiesByZone(zoneId) {
  return ENEMY_TEMPLATES.filter((e) => e.zone === zoneId);
}

/**
 * Pick a random non-boss enemy from a zone.
 */
export function pickRandomEnemy(zoneId) {
  const pool = ENEMY_TEMPLATES.filter((e) => e.zone === zoneId && !e.isBoss);
  if (pool.length === 0) return ENEMY_TEMPLATES[0]; // fallback
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get the boss of a zone.
 */
export function getZoneBoss(zoneId) {
  return ENEMY_TEMPLATES.find((e) => e.zone === zoneId && e.isBoss) || null;
}

/**
 * Create a combat-ready enemy instance from a template.
 * Scales stats slightly around the enemy's base level.
 */
export function createEnemyInstance(template) {
  const variance = 0.9 + Math.random() * 0.2; // 0.9–1.1
  return {
    ...template,
    hp: Math.round(template.baseHp * variance),
    maxHp: Math.round(template.baseHp * variance),
    atk: Math.round(template.baseAtk * variance),
    def: Math.round(template.baseDef * variance),
    spd: Math.round(template.baseSpd * variance),
    se: 50, // enemies have a simpler SE pool
    maxSe: 50,
    statusEffects: [],
    isDefending: false,
    phaseTriggered: [], // track which boss phases have fired
  };
}

export default ENEMY_TEMPLATES;
