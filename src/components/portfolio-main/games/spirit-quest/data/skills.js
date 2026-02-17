// ============================================================
// Skill Trees — one per Spirit Path
// Each skill: { id, name, desc, seCost, cooldown, levelReq,
//   element, type, power, effect?, statusApply? }
//
// type: "damage" | "heal" | "buff" | "debuff" | "shield"
// power: base multiplier against ATK stat (damage/heal types)
// ============================================================

const SKILL_TREES = {
  // ─── Spirit Brawler ─────────────────────────────────────
  brawler: [
    { id: "cinder_strike",    name: "Cinder Strike",    desc: "A blazing punch that scorches the enemy.",                          seCost: 12, cooldown: 0, levelReq: 1,  element: "fire",  type: "damage", power: 1.4, statusApply: { id: "burn", chance: 0.3 } },
    { id: "spirit_surge",     name: "Spirit Surge",     desc: "Channel raw energy into a devastating rush.",                       seCost: 18, cooldown: 1, levelReq: 5,  element: "fire",  type: "damage", power: 1.8 },
    { id: "counter_aura",     name: "Counter Aura",     desc: "Enter a counter stance — reflects a portion of damage taken.",       seCost: 15, cooldown: 2, levelReq: 8,  element: "fire",  type: "buff",   power: 0, effect: "counter" },
    { id: "meteor_fist",      name: "Meteor Fist",      desc: "A fist cloaked in spirit fire, hits like a falling star.",           seCost: 22, cooldown: 1, levelReq: 10, element: "fire",  type: "damage", power: 2.2, statusApply: { id: "burn", chance: 0.5 } },
    { id: "blazing_rush",     name: "Blazing Rush",     desc: "A flurry of strikes burning with spirit energy.",                    seCost: 20, cooldown: 2, levelReq: 15, element: "fire",  type: "damage", power: 1.5, hits: 3 },
    { id: "afterimage",       name: "Afterimage",       desc: "Move so fast you leave a phantom — dodge next attack guaranteed.",    seCost: 16, cooldown: 3, levelReq: 20, element: "wind",  type: "buff",   power: 0, effect: "dodge" },
    { id: "titan_breaker",    name: "Titan Breaker",    desc: "A charged blow that ignores a portion of enemy defense.",             seCost: 28, cooldown: 2, levelReq: 25, element: "earth", type: "damage", power: 2.5, armorPierce: 0.4 },
    { id: "spirit_overdrive", name: "Spirit Overdrive", desc: "Push beyond your limits — massively boost ATK for 2 turns.",          seCost: 30, cooldown: 4, levelReq: 30, element: "fire",  type: "buff",   power: 0, effect: "enrage", statusApply: { id: "enrage", chance: 1.0 } },
    { id: "inferno_barrage",  name: "Inferno Barrage",  desc: "Unleash a storm of burning strikes.",                                 seCost: 35, cooldown: 3, levelReq: 40, element: "fire",  type: "damage", power: 1.8, hits: 5, statusApply: { id: "burn", chance: 0.6 } },
    { id: "ethereal_annihilation", name: "Ethereal Annihilation", desc: "The ultimate brawler technique — channel all spirit into one world-shattering blow.", seCost: 50, cooldown: 5, levelReq: 50, element: "fire", type: "damage", power: 4.0 },
  ],

  // ─── Spirit Sorcerer ────────────────────────────────────
  sorcerer: [
    { id: "soul_flame",      name: "Soul Flame",       desc: "Project a bolt of spirit fire at the enemy.",                          seCost: 10, cooldown: 0, levelReq: 1,  element: "shadow", type: "damage", power: 1.5 },
    { id: "essence_bomb",    name: "Essence Bomb",     desc: "Concentrate spirit energy into an explosive sphere.",                   seCost: 20, cooldown: 1, levelReq: 5,  element: "shadow", type: "damage", power: 2.0 },
    { id: "barrier_dome",    name: "Barrier Dome",     desc: "Erect a spirit barrier that absorbs damage.",                           seCost: 18, cooldown: 2, levelReq: 8,  element: "light",  type: "shield", power: 1.5 },
    { id: "void_pulse",      name: "Void Pulse",       desc: "A wave of void energy that drains enemy spirit.",                      seCost: 15, cooldown: 1, levelReq: 10, element: "shadow", type: "debuff", power: 1.2, statusApply: { id: "spirit_drain", chance: 0.6 } },
    { id: "chain_lightning",  name: "Chain Lightning",  desc: "Crackling bolts arc through the enemy.",                               seCost: 22, cooldown: 2, levelReq: 15, element: "wind",   type: "damage", power: 1.8, hits: 2 },
    { id: "phantom_rift",    name: "Phantom Rift",     desc: "Tear open a rift that damages and freezes.",                            seCost: 25, cooldown: 2, levelReq: 20, element: "shadow", type: "damage", power: 2.0, statusApply: { id: "freeze", chance: 0.5 } },
    { id: "gravity_well",    name: "Gravity Well",     desc: "Crush the enemy under immense gravitational force.",                    seCost: 30, cooldown: 2, levelReq: 25, element: "earth",  type: "damage", power: 2.8, statusApply: { id: "bleed", chance: 0.4 } },
    { id: "spirit_storm",    name: "Spirit Storm",     desc: "Summon a raging tempest of raw spirit energy.",                         seCost: 35, cooldown: 3, levelReq: 30, element: "wind",   type: "damage", power: 2.2, hits: 3 },
    { id: "eclipse_wave",    name: "Eclipse Wave",     desc: "A wave of darkness that poisons and weakens.",                          seCost: 40, cooldown: 3, levelReq: 40, element: "shadow", type: "damage", power: 2.5, statusApply: { id: "poison", chance: 0.8 } },
    { id: "astral_oblivion", name: "Astral Oblivion",  desc: "Channel the void itself into an all-consuming blast.",                  seCost: 55, cooldown: 5, levelReq: 50, element: "shadow", type: "damage", power: 4.2 },
  ],

  // ─── Spirit Armor ───────────────────────────────────────
  armor: [
    { id: "reflect_guard",   name: "Reflect Guard",    desc: "Guard and reflect a portion of damage back.",                           seCost: 10, cooldown: 0, levelReq: 1,  element: "light", type: "shield", power: 1.0, effect: "reflect" },
    { id: "energy_fortify",  name: "Energy Fortify",   desc: "Harden spirit energy into protective layers.",                          seCost: 14, cooldown: 1, levelReq: 5,  element: "light", type: "buff",   power: 0, statusApply: { id: "shield", chance: 1.0 } },
    { id: "titan_aura",      name: "Titan Aura",       desc: "Emit an overwhelming presence that boosts defense.",                    seCost: 16, cooldown: 2, levelReq: 8,  element: "earth", type: "buff",   power: 0, effect: "def_up" },
    { id: "iron_spirit",     name: "Iron Spirit",      desc: "A heavy, spirit-charged strike that staggers.",                         seCost: 18, cooldown: 1, levelReq: 10, element: "earth", type: "damage", power: 1.6, statusApply: { id: "freeze", chance: 0.3 } },
    { id: "bulwark_pulse",   name: "Bulwark Pulse",    desc: "Release a shockwave that damages and heals you.",                       seCost: 22, cooldown: 2, levelReq: 15, element: "light", type: "damage", power: 1.4, selfHeal: 0.3 },
    { id: "spirit_absorb",   name: "Spirit Absorb",    desc: "Absorb enemy energy to restore your own SE.",                           seCost: 0,  cooldown: 3, levelReq: 20, element: "light", type: "debuff", power: 0,   effect: "se_steal", stealAmount: 20 },
    { id: "fortress_mode",   name: "Fortress Mode",    desc: "Enter an impenetrable stance — massive def for 2 turns.",               seCost: 28, cooldown: 3, levelReq: 25, element: "earth", type: "buff",   power: 0, effect: "fortress" },
    { id: "eternal_guard",   name: "Eternal Guard",    desc: "A sustained barrier and regen over 3 turns.",                           seCost: 30, cooldown: 4, levelReq: 30, element: "light", type: "buff",   power: 0, statusApply: { id: "regen", chance: 1.0 } },
    { id: "radiant_shield",  name: "Radiant Shield",   desc: "A blinding shield that damages attackers.",                             seCost: 35, cooldown: 3, levelReq: 40, element: "light", type: "shield", power: 2.0, effect: "thorns" },
    { id: "immortal_bastion", name: "Immortal Bastion", desc: "Become nearly invulnerable — absorb all damage for 2 turns.",          seCost: 55, cooldown: 6, levelReq: 50, element: "light", type: "shield", power: 3.0 },
  ],
};

/**
 * Get all skills available to a player given their path and level.
 * @param {string} path - "brawler" | "sorcerer" | "armor"
 * @param {number} level - current player level
 * @returns {object[]} array of unlocked skill objects
 */
export function getUnlockedSkills(path, level) {
  const tree = SKILL_TREES[path];
  if (!tree) return [];
  return tree.filter((s) => s.levelReq <= level);
}

/**
 * Get the full skill tree for a path.
 */
export function getSkillTree(path) {
  return SKILL_TREES[path] || [];
}

/**
 * Look up a single skill by ID across all trees.
 */
export function getSkillById(skillId) {
  for (const path of Object.values(SKILL_TREES)) {
    const found = path.find((s) => s.id === skillId);
    if (found) return found;
  }
  return null;
}

export default SKILL_TREES;
