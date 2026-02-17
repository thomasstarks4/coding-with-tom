// ============================================================
// Elemental Affinity Matrix
// Row = attacker element, Column = defender element
// Values > 1.0 = strong against, < 1.0 = weak against
// ============================================================

const ELEMENT_MATRIX = {
  //          fire  water wind  earth shadow light
  fire:   { fire: 1.0, water: 0.5, wind: 1.5,  earth: 1.0,  shadow: 1.0,  light: 0.75 },
  water:  { fire: 1.5, water: 1.0, wind: 0.75, earth: 0.5,  shadow: 1.0,  light: 1.0 },
  wind:   { fire: 0.5, water: 1.25, wind: 1.0, earth: 1.5,  shadow: 0.75, light: 1.0 },
  earth:  { fire: 1.0, water: 1.5, wind: 0.5,  earth: 1.0,  shadow: 1.0,  light: 0.75 },
  shadow: { fire: 1.0, water: 1.0, wind: 1.25, earth: 1.0,  shadow: 0.5,  light: 1.5 },
  light:  { fire: 1.25, water: 1.0, wind: 1.0, earth: 1.25, shadow: 1.5,  light: 0.5 },
};

/**
 * Get the elemental damage multiplier.
 * @param {string} attackerElement - Element of the attack/skill
 * @param {string} defenderElement - Element of the defender
 * @returns {number} multiplier (1.0 = neutral)
 */
export function getElementMultiplier(attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement) return 1.0;
  return ELEMENT_MATRIX[attackerElement]?.[defenderElement] ?? 1.0;
}

/**
 * Get a text description of elemental effectiveness.
 */
export function getEffectivenessLabel(multiplier) {
  if (multiplier >= 1.5) return { text: "Super effective!", color: "text-green-400" };
  if (multiplier >= 1.25) return { text: "Effective!", color: "text-green-300" };
  if (multiplier <= 0.5) return { text: "Resisted...", color: "text-red-400" };
  if (multiplier <= 0.75) return { text: "Not very effective", color: "text-red-300" };
  return null; // neutral, no label
}

export default ELEMENT_MATRIX;
