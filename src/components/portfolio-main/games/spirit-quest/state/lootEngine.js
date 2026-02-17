// ============================================================
// Loot Engine — drop generation, rarity rolls, crafting
// ============================================================

import {
  RARITIES, RARITY_ORDER, EQUIP_SLOTS, CRAFT_COSTS,
  UPGRADE_MAX, UPGRADE_COST_PER_LEVEL, randInt, pick,
} from "../constants";
import { generateItem } from "../data/equipment";

/**
 * Roll for loot after a battle.
 *
 * @param {number} lootTier    - enemy loot tier (1–5), shifts rarity upward
 * @param {number} lootBonus   - bonus from battle mode (0–0.25)
 * @param {number} performance - 0–1, based on remaining HP%, speed, etc.
 * @returns {object[]} array of generated items (usually 1–3)
 */
export function rollLoot(lootTier = 1, lootBonus = 0, performance = 0.5) {
  const items = [];

  // Number of drops: 1 guaranteed, chance for 2nd and 3rd
  let dropCount = 1;
  if (Math.random() < 0.3 + lootTier * 0.05 + performance * 0.1) dropCount++;
  if (Math.random() < 0.1 + lootTier * 0.03) dropCount++;

  for (let i = 0; i < dropCount; i++) {
    const rarity = rollRarity(lootTier, lootBonus, performance);
    const slot = pick(EQUIP_SLOTS);
    const item = generateItem(slot, rarity);
    if (item) items.push(item);
  }

  return items;
}

/**
 * Roll a rarity based on tier, bonus, and performance.
 * Higher tiers shift the weight curve toward rarer items.
 */
function rollRarity(lootTier, lootBonus, performance) {
  // Build weighted pool
  const weights = {};
  let totalWeight = 0;

  for (const [key, data] of Object.entries(RARITIES)) {
    // Shift weights: reduce common, boost rarer with tier
    let w = data.weight;
    const rarityIdx = RARITY_ORDER.indexOf(key);

    // Tier shifts: each tier above 1 moves 5% weight from common to rarer
    const shift = (lootTier - 1) * 5;
    if (rarityIdx === 0) {
      w = Math.max(5, w - shift);
    } else {
      w += shift * (rarityIdx * 0.3);
    }

    // Performance bonus: >75% HP remaining doubles rare+ weight
    if (performance > 0.75 && rarityIdx >= 1) {
      w *= 1.3;
    }

    // Loot bonus (from battle modifier)
    if (rarityIdx >= 1) {
      w *= (1 + lootBonus);
    }

    weights[key] = w;
    totalWeight += w;
  }

  // Weighted random pick
  let roll = Math.random() * totalWeight;
  for (const key of RARITY_ORDER) {
    roll -= weights[key];
    if (roll <= 0) return key;
  }

  return "common"; // fallback
}

/**
 * Roll spirit shard and gold rewards.
 */
export function rollCurrencyRewards(enemy, modifier = null) {
  const goldBase = enemy.goldReward || 10;
  const shardBase = Math.round(goldBase * 0.4);

  const goldMul = modifier?.xpMul || 1; // reuse xp multiplier for gold too

  return {
    gold: randInt(Math.round(goldBase * 0.8 * goldMul), Math.round(goldBase * 1.2 * goldMul)),
    shards: randInt(Math.max(1, shardBase - 2), shardBase + 3),
  };
}

/**
 * Craft: merge 3 items of same rarity → 1 item of next rarity.
 *
 * @param {object[]} items - exactly 3 items of same rarity
 * @param {number} playerShards - current spirit shards
 * @returns {{ item, shardCost } | null} null if invalid
 */
export function craftItems(items, playerShards) {
  if (items.length !== 3) return null;
  const rarity = items[0].rarity;
  if (!items.every((i) => i.rarity === rarity)) return null;

  const rarityIdx = RARITY_ORDER.indexOf(rarity);
  if (rarityIdx < 0 || rarityIdx >= RARITY_ORDER.length - 1) return null; // can't craft beyond mythic

  const nextRarity = RARITY_ORDER[rarityIdx + 1];
  const shardCost = CRAFT_COSTS[nextRarity] || 0;

  if (playerShards < shardCost) return null;

  // Pick a random slot from the input items
  const slot = pick(items.map((i) => i.slot));
  const newItem = generateItem(slot, nextRarity);

  return { item: newItem, shardCost };
}

/**
 * Upgrade an item's stats by 10% per level.
 *
 * @param {object} item - item to upgrade
 * @param {number} playerGold
 * @param {number} playerShards
 * @returns {{ item, goldCost, shardCost } | null}
 */
export function upgradeItem(item, playerGold, playerShards) {
  if (!item || item.upgradeLevel >= UPGRADE_MAX) return null;

  const nextLevel = item.upgradeLevel + 1;
  const goldCost = UPGRADE_COST_PER_LEVEL.gold * nextLevel;
  const shardCost = UPGRADE_COST_PER_LEVEL.shards * nextLevel;

  if (playerGold < goldCost || playerShards < shardCost) return null;

  const upgraded = {
    ...item,
    upgradeLevel: nextLevel,
    name: item.name.replace(/ \+\d+$/, "") + ` +${nextLevel}`,
    stats: { ...item.stats },
  };

  // Boost all stats by 10%
  for (const [key, val] of Object.entries(upgraded.stats)) {
    if (typeof val === "number") {
      upgraded.stats[key] = Math.round(val * 1.1);
    }
  }

  return { item: upgraded, goldCost, shardCost };
}
