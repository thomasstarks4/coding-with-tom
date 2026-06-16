import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// xpPerAction = XP for a single resource gathered/action performed
const SKILLING_DATA = [
  // AGILITY
  { activity: "Edgeville Dungeon Monkeybars", skill: "Agility", levelReq: 15, levelRange: "15-51", wildyLevel: "1-5 (underground)", xpPerAction: 22, xpLow: 10000, xpHigh: 13200, riskLevel: "Low", notes: "22 XP per crossing. ~13,200 XP/hr. Can be attacked by PKers. Enter from Edgeville. Good low-Wilderness Agility XP." },
  { activity: "Wilderness Agility Course", skill: "Agility", levelReq: 52, levelRange: "47-62 (best)", wildyLevel: "52-56 (deep)", xpPerAction: 571, xpLow: 50000, xpHigh: 60000, riskLevel: "High", notes: "571 XP/lap. Boost from 47 with summer pie. No Marks of Grace. Pay 150k GP into dispenser to receive loot after each lap (alchables, blighted items, medium clue scrolls at 1/40 per lap). Fastest Agility method 47–62." },
  // WOODCUTTING
  { activity: "Ents - Normal/Oak/Willow Logs", skill: "Woodcutting", levelReq: 1, levelRange: "1-44 (combat kill required)", wildyLevel: "9-24 (N/E of Chaos Temple)", xpPerAction: 25, xpLow: 5000, xpHigh: 12000, riskLevel: "Low-Medium", notes: "25 XP per set of logs. Kill Ent (combat lv 101) then chop trunk. Gives 2x logs vs WC Guild ents. Log type by WC level: Normal lv 1-44, Oak lv 15+, Willow lv 30+. Bird nest 1/256. Med Wilderness Diary: +15% success." },
  { activity: "Ents - Maple/Yew/Magic Logs", skill: "Woodcutting", levelReq: 45, levelRange: "45-99 (combat kill required)", wildyLevel: "9-24 (N/E of Chaos Temple)", xpPerAction: 25, xpLow: 15000, xpHigh: 30000, riskLevel: "Low-Medium", notes: "25 XP per set (regardless of log type). Maple lv 45-60, Yew lv 61-74, Magic lv 75+. Wilderness ents give double logs vs WC Guild. Drop noted logs. Med Wilderness Diary: +15% success." },
  { activity: "Resource Area - Yew Trees", skill: "Woodcutting", levelReq: 60, levelRange: "60-74", wildyLevel: "51-53", xpPerAction: 175, xpLow: 20000, xpHigh: 28000, riskLevel: "High", notes: "175 XP/log. Entry fee 7,500 GP (free w/ Elite Wilderness Diary). Multiple yew trees. Piles NPC notes logs for 50 GP each. Furnace + anvil also on-site." },
  { activity: "Resource Area - Magic Trees", skill: "Woodcutting", levelReq: 75, levelRange: "75-99", wildyLevel: "51-53", xpPerAction: 250, xpLow: 20000, xpHigh: 30000, riskLevel: "High", notes: "250 XP/log. Entry fee 7,500 GP (free w/ Elite Diary). Multiple magic trees. Elite Diary task: cut and burn magic logs here (75 WC + 75 FM). Profitable logs." },
  // MINING
  { activity: "South Wilderness Mine - Iron/Coal", skill: "Mining", levelReq: 15, levelRange: "15-29", wildyLevel: "6-7", xpPerAction: 35, xpLow: 30000, xpHigh: 45000, riskLevel: "Low", notes: "Iron 35 XP/ore (lv 15), Coal 50 XP/ore (lv 30). Just north of Edgeville bank - very safe. Mage of Zamorak (Abyss entrance) is nearby. Good early ironman mining spot." },
  { activity: "SW Wilderness Mine - Coal", skill: "Mining", levelReq: 30, levelRange: "30-44", wildyLevel: "9", xpPerAction: 50, xpLow: 25000, xpHigh: 40000, riskLevel: "Low", notes: "50 XP/ore. 34 coal rocks - largest coal cluster in F2P. South of Dark Warriors' Fortress. Rarely visited; low PK risk." },
  { activity: "Bandit Camp Mine - All Ores", skill: "Mining", levelReq: 15, levelRange: "15-70", wildyLevel: "29-35", xpPerAction: 35, xpLow: 20000, xpHigh: 55000, riskLevel: "Medium", notes: "16 iron (35 XP), 31 coal (50 XP), 19 mithril (80 XP), 8 adamantite (95 XP). Most rocks of any F2P mine. East of the Forgotten Cemetery. Skeletons wander. Moderate PK risk." },
  { activity: "Resource Area - Iron (Power-mine)", skill: "Mining", levelReq: 15, levelRange: "15-60", wildyLevel: "51-53", xpPerAction: 35, xpLow: 50000, xpHigh: 70000, riskLevel: "High", notes: "35 XP/ore. 3 iron rocks in triangle - ideal power-mining without moving. Entry fee 7,500 GP. Furnace + anvil on-site for full cycle. Elite Diary for free entry." },
  { activity: "Resource Area - Coal/Gold/Mithril/Addy", skill: "Mining", levelReq: 30, levelRange: "30-84", wildyLevel: "51-53", xpPerAction: 80, xpLow: 25000, xpHigh: 50000, riskLevel: "High", notes: "Coal 50 XP (11 rocks), Gold 65 XP (4 rocks), Mithril 80 XP (1 rock), Adamantite 95 XP (6 rocks). Entry 7,500 GP. Diary tasks: gold helmet (50 Smith), addy scimitar (75 Smith). On-site furnace + anvil." },
  { activity: "Lava Maze Runite Mine", skill: "Mining", levelReq: 85, levelRange: "85-99", wildyLevel: "46", xpPerAction: 125, xpLow: 5000, xpHigh: 10000, riskLevel: "Very High", notes: "125 XP/ore. 2 rune rocks - ONLY F2P runite location in the game. Very popular PK hotspot. Minimal risk gear recommended." },
  { activity: "Frozen Waste Plateau - Runite", skill: "Mining", levelReq: 85, levelRange: "85-99 (members)", wildyLevel: "43-56", xpPerAction: 125, xpLow: 6000, xpHigh: 12000, riskLevel: "Very High", notes: "125 XP/ore. 3 rune rocks (members) - most rune rocks in Wilderness post-Rejuvenation update. Water/cosmic rune spawns nearby. Extreme depth and PK risk." },
  { activity: "Resource Area - Runite Golems", skill: "Mining", levelReq: 85, levelRange: "85-99", wildyLevel: "51-53", xpPerAction: 125, xpLow: 8000, xpHigh: 15000, riskLevel: "High", notes: "125 XP/ore. Kill 2 Runite Golems (combat), then mine for rune ore. Elite Diary task: smith rune scimitar from scratch (85 Mining + 90 Smithing). Entry fee 7,500 GP." },
  // FISHING
  { activity: "Bandit Camp - Small Net/Bait", skill: "Fishing", levelReq: 1, levelRange: "1-30", wildyLevel: "17-24", xpPerAction: 10, xpLow: 5000, xpHigh: 15000, riskLevel: "Medium", notes: "Shrimps (lv 1, 10 XP), Sardines (lv 5, 20 XP), Herring (lv 10, 30 XP), Anchovies (lv 15, 40 XP). Only Wilderness early fishing spot. Useful for early ironman. Moderate PK risk." },
  { activity: "Lava Maze - Lava Eels", skill: "Fishing", levelReq: 53, levelRange: "53-84", wildyLevel: "40-45", xpPerAction: 60, xpLow: 10000, xpHigh: 20000, riskLevel: "High", notes: "60 XP/eel. Members only. Oily fishing rod + fishing bait required. Single spot inside Lava Maze. Used in Baxtorian Falls quest. Unique ironman food source. Lava Maze has item spawns nearby." },
  { activity: "Dark Crabs - South of Fountain", skill: "Fishing", levelReq: 85, levelRange: "85-99", wildyLevel: "~33-47", xpPerAction: 130, xpLow: 30000, xpHigh: 40000, riskLevel: "Very High", notes: "130 XP/crab. Lobster pot + dark fishing bait (spawns on Lava Dragon Isle). Wilderness crabs teleport goes directly to lv 33 area. Dark crabs heal 22 HP. Extreme PK danger." },
  { activity: "Resource Area - Dark Crabs", skill: "Fishing", levelReq: 85, levelRange: "85-99", wildyLevel: "51-53", xpPerAction: 130, xpLow: 30000, xpHigh: 40000, riskLevel: "High", notes: "130 XP/crab. ~40,000 XP/hr. Static spots (never move - rare!). Entry 7,500 GP (free w/ Elite Diary). Elite Diary boosts catch rate significantly. Permanent fire on-site for cooking. Piles NPC notes fish." },
  // PRAYER
  { activity: "Bone Yard - Collecting Big Bones", skill: "Prayer", levelReq: 1, levelRange: "1-43 (bone gathering)", wildyLevel: "27-30", xpPerAction: 15, xpLow: 5000, xpHigh: 10000, riskLevel: "Medium", notes: "15 XP per big bone buried. Big bones and regular bones (4.5 XP) spawn freely. Collect and bury on-site or take to Chaos Temple. Useful early ironman bone source. Monsters present but manageable." },
  { activity: "Lava Dragon Bones - Bury on Isle", skill: "Prayer", levelReq: 1, levelRange: "1-99 (when killing lava dragons)", wildyLevel: "36-42", xpPerAction: 340, xpLow: 50000, xpHigh: 100000, riskLevel: "Very High", notes: "340 XP/bone buried ON Lava Dragon Isle vs 85 XP elsewhere (4x multiplier). Kill lava dragons (combat lv 252) for bones. Multi-combat, anti-fire required. Can also offer at Chaos Temple for ~297.5 effective XP/bone." },
  { activity: "Chaos Temple (Chaos Altar)", skill: "Prayer", levelReq: 1, levelRange: "1-99", wildyLevel: "38", xpPerAction: 252, xpLow: 31500, xpHigh: 1050000, riskLevel: "Extreme", notes: "3.5x base bury XP (gilded altar equivalent) + 50% bone not consumed = effective 7x XP per bone. Dragon bones: 252 XP/offering. XP/hr: Regular bones ~31,500, Dragon bones ~504,000, Superior dragon ~1,050,000. Elder Chaos Druid unnotes for 50 GP/bone. Suicide method recommended for low risk." },
  // RUNECRAFTING
  { activity: "Abyss Runecrafting (all altars)", skill: "Runecrafting", levelReq: 1, levelRange: "1-99", wildyLevel: "5 (Mage of Zamorak)", xpPerAction: 0, xpLow: 20000, xpHigh: 102000, riskLevel: "Medium", notes: "Mage of Zamorak at lv 5 Wilderness teleports to Abyss (gives skull). Bypasses maze to reach any runic altar. Enter the Abyss miniquest required. Pray Protect from Magic. Most used for: Chaos runes (lv 35, 8.5 XP), Nature runes (lv 44, 9 XP), Law runes (lv 54, 9.5 XP), Death runes (lv 65, 10 XP)." },
  { activity: "Chaos Altar - Chaos Runes", skill: "Runecrafting", levelReq: 35, levelRange: "35-99", wildyLevel: "9 (ruins entrance)", xpPerAction: 8.5, xpLow: 40000, xpHigh: 70000, riskLevel: "Low-Medium", notes: "8.5 XP per pure essence (12.7 with daeyalt). At lv 85+ with colossal pouch: 134 runes/run, ~569.5 XP/run. Via ruins (talisman/tiara) or Abyss or Tunnel of Chaos. Chaos cores give 85 XP each (11 runes, 2,635 XP max/run with 27 cores + colossal pouch)." },
  { activity: "Lava Rune Crafting (via Abyss)", skill: "Runecrafting", levelReq: 23, levelRange: "23-99 (best 50+)", wildyLevel: "5 (Abyss entrance)", xpPerAction: 9.5, xpLow: 43200, xpHigh: 102100, riskLevel: "Medium", notes: "9.5 XP/ess at lv 50+. Lv 23=43k/hr, lv 50=61k/hr, lv 75=77k/hr, lv 85=100k/hr, lv 99=102k/hr. Binding necklace required. Uses earth runes + pure essence at Fire Altar. Enter the Abyss miniquest required. Fastest solo RC method in game." },
  // HUNTER
  { activity: "Black Salamanders", skill: "Hunter", levelReq: 67, levelRange: "67-72", wildyLevel: "32-36", xpPerAction: 319, xpLow: 75000, xpHigh: 100000, riskLevel: "High", notes: "319.2 XP each. Rope snares at net-and-rope spots. Members only. +1 extra trap in Wilderness. Hard Wilderness Diary recommended for obelisk access. Safer alternative to black chinchompas but lower XP." },
  { activity: "Black Chinchompas", skill: "Hunter", levelReq: 73, levelRange: "73-99", wildyLevel: "32-36", xpPerAction: 258, xpLow: 145000, xpHigh: 300000, riskLevel: "Extreme", notes: "258.5 XP each. Fastest Hunter XP in game. Solo XP/hr: lv 73=145k, lv 80=167k, lv 90=197k, lv 99=225k. With alt: lv 73=157k, lv 99=265k (300k max). 3-tick manipulation recommended. Multi-combat PK hotspot. Eagles' Peak partial completion required." },
  // THIEVING
  { activity: "Rogues' Castle - Pickpocket", skill: "Thieving", levelReq: 32, levelRange: "32-83", wildyLevel: "50-51", xpPerAction: 36, xpLow: 20000, xpHigh: 40000, riskLevel: "Very High", notes: "36.5 XP (lv 15 rogue) to 125 XP (lv 135 rogue). Very deep multi-combat Wilderness. Usually combined with chest looting. High PK risk makes this rarely done for XP alone." },
  { activity: "Rogues' Castle - Chests", skill: "Thieving", levelReq: 84, levelRange: "84-99", wildyLevel: "51", xpPerAction: 0, xpLow: 260000, xpHigh: 300000, riskLevel: "Extreme", notes: "Fastest Thieving XP from lv 84+: 280–300k XP/hr. Search for traps first (take damage otherwise). Use Protect from Melee when rogues become aggressive. Hard Wilderness Diary: use obelisk to teleport to lv 50 for fast access. Multi-combat zone. Rogue equipment from chest adds to the rogue armour set." },
];

// Resource location tables
const WILDERNESS_TREES = [
  { tree: "Normal", wcLevel: 1, xpPerLog: 25, location: "Throughout low Wilderness", wildyLevel: "1-30", quantity: "Many", notes: "Common in low-level Wilderness. Standard chopping." },
  { tree: "Oak", wcLevel: 15, xpPerLog: 37.5, location: "Scattered in low Wilderness", wildyLevel: "1-20", quantity: "Some", notes: "Various low-level locations throughout the Wilderness." },
  { tree: "Willow", wcLevel: 30, xpPerLog: 67.5, location: "Near water in Wilderness", wildyLevel: "1-25", quantity: "Some", notes: "Less common than outside Wilderness." },
  { tree: "Ent Trunk (any logs)", wcLevel: 1, xpPerLog: 25, location: "N/E of Chaos Temple (Wilderness forests)", wildyLevel: "9-24", quantity: "10 Ent spawns", notes: "Must kill Ent (combat lv 101) first. 25 XP per set regardless of log type. Log type by your WC level. Gives 2x logs vs WC Guild ents. Med Diary: +15% success." },
  { tree: "Yew", wcLevel: 60, xpPerLog: 175, location: "Resource Area (east of Deserted Keep)", wildyLevel: "51-53", quantity: "Multiple", notes: "Entry fee 7,500 GP. Also from Ent trunks at 61+ WC. Piles NPC notes logs for 50 GP each." },
  { tree: "Magic", wcLevel: 75, xpPerLog: 250, location: "Resource Area (east of Deserted Keep)", wildyLevel: "51-53", quantity: "Multiple", notes: "Entry fee 7,500 GP. Elite Diary task: cut and burn magic logs here. Also from Ent trunks at 75+ WC." },
];

const WILDERNESS_ROCKS = [
  { rock: "Iron", miningLevel: 15, xpPerOre: 35, location: "South Wilderness Mine", wildyLevel: "6-7", quantity: 2, notes: "North of Edgeville bank. Also coal here." },
  { rock: "Coal", miningLevel: 30, xpPerOre: 50, location: "South Wilderness Mine", wildyLevel: "6-7", quantity: 3, notes: "Near Mage of Zamorak (Abyss entrance)." },
  { rock: "Coal", miningLevel: 30, xpPerOre: 50, location: "SW Wilderness Mine", wildyLevel: "9", quantity: 34, notes: "34 coal rocks - largest coal cluster in F2P. South of Dark Warriors' Fortress." },
  { rock: "Iron", miningLevel: 15, xpPerOre: 35, location: "Bandit Camp Mine", wildyLevel: "29-35", quantity: 16, notes: "Most F2P rocks in one mine." },
  { rock: "Coal", miningLevel: 30, xpPerOre: 50, location: "Bandit Camp Mine", wildyLevel: "29-35", quantity: 31, notes: "Large deposit alongside iron, mithril, addy." },
  { rock: "Mithril", miningLevel: 55, xpPerOre: 80, location: "Bandit Camp Mine", wildyLevel: "29-35", quantity: 19, notes: "Good mithril quantity. Med Wilderness Diary task." },
  { rock: "Adamantite", miningLevel: 70, xpPerOre: 95, location: "Bandit Camp Mine", wildyLevel: "29-35", quantity: 8, notes: "Highest ore available at Bandit Camp Mine." },
  { rock: "Iron", miningLevel: 15, xpPerOre: 35, location: "Resource Area", wildyLevel: "51-53", quantity: 6, notes: "3 in triangle - ideal power-mining. Entry 7,500 GP." },
  { rock: "Coal", miningLevel: 30, xpPerOre: 50, location: "Resource Area", wildyLevel: "51-53", quantity: 11, notes: "Entry 7,500 GP. Largest deep-Wilderness coal deposit." },
  { rock: "Gold", miningLevel: 40, xpPerOre: 65, location: "Resource Area", wildyLevel: "51-53", quantity: 4, notes: "Gold helmet diary task (50 Smithing). On-site furnace." },
  { rock: "Mithril", miningLevel: 55, xpPerOre: 80, location: "Resource Area", wildyLevel: "51-53", quantity: 1, notes: "Only 1 rock. Med Wilderness Diary task." },
  { rock: "Adamantite", miningLevel: 70, xpPerOre: 95, location: "Resource Area", wildyLevel: "51-53", quantity: 6, notes: "Addy scimitar diary task (75 Smithing). On-site anvil." },
  { rock: "Runite (Golem)", miningLevel: 85, xpPerOre: 125, location: "Resource Area", wildyLevel: "51-53", quantity: 2, notes: "Kill Runite Golem then mine. Rune scimitar elite diary task (85 Mining + 90 Smithing)." },
  { rock: "Runite", miningLevel: 85, xpPerOre: 125, location: "Lava Maze Runite Mine", wildyLevel: "46", quantity: 2, notes: "ONLY F2P runite rocks. Extremely popular PK hotspot." },
  { rock: "Runite", miningLevel: 85, xpPerOre: 125, location: "Lava Maze Dungeon", wildyLevel: "44-45", quantity: 1, notes: "Members only. Greater demons + Black dragons also here." },
  { rock: "Runite", miningLevel: 85, xpPerOre: 125, location: "Frozen Waste Plateau", wildyLevel: "43-56", quantity: 3, notes: "Members only. Most rune rocks in Wilderness. Water/cosmic rune spawns nearby." },
];

const WILDERNESS_FISHING = [
  { spot: "Small Net / Bait", levelReq: 1, catches: "Shrimps (lv 1, 10 XP), Sardines (lv 5, 20 XP), Herring (lv 10, 30 XP), Anchovies (lv 15, 40 XP)", location: "Bandit Camp area", wildyLevel: "17-24", equipment: "Small net or fishing rod + bait", notes: "Only Wilderness spot for early-level fishing." },
  { spot: "Lava Eel", levelReq: 53, catches: "Lava eel (60 XP, heals 7 HP)", location: "Lava Maze (single spot)", wildyLevel: "40-45", equipment: "Oily fishing rod + fishing bait", notes: "Members only. Used in Baxtorian Falls quest. Unique ironman food source." },
  { spot: "Dark Crabs (open Wilderness)", levelReq: 85, catches: "Raw dark crab (130 XP, heals 22 HP cooked)", location: "South of Fountain of Rune / lv 33 area", wildyLevel: "~33-47", equipment: "Lobster pot + dark fishing bait", notes: "Wilderness crabs teleport item goes directly to lv 33 area. Bait spawns on Lava Dragon Isle. Extremely dangerous." },
  { spot: "Dark Crabs (Resource Area)", levelReq: 85, catches: "Raw dark crab (130 XP, heals 22 HP cooked)", location: "Resource Area (east of Deserted Keep)", wildyLevel: "51-53", equipment: "Lobster pot + dark fishing bait", notes: "Static spots (never move). ~40,000 XP/hr. Permanent fire for cooking. Entry 7,500 GP (free w/ Elite Diary). Elite Diary boosts catch rate significantly." },
];

const WILDERNESS_HUNTER = [
  { prey: "Black Salamander", hunterLevel: 67, xpEach: 319, location: "Wilderness Salamander Area", wildyLevel: "32-36", trapType: "Net trap + rope snare", xpHrLow: 75000, xpHrHigh: 100000, notes: "Members only. Requires rope + small fishing net per trap. +1 extra trap in Wilderness. Hard Wilderness Diary recommended. Safer than black chinchompas." },
  { prey: "Black Chinchompa", hunterLevel: 73, xpEach: 258, location: "Black Chinchompa Hunter Area", wildyLevel: "32-36", trapType: "Box trap", xpHrLow: 145000, xpHrHigh: 300000, notes: "Fastest Hunter XP in game. Members only. +1 extra trap in Wilderness. 3-tick manipulation greatly increases rates. Very popular PK hotspot. Eagles' Peak partial completion required. Hard Wilderness Diary strongly recommended." },
];

const WILDERNESS_TRAP_BONUS = [
  { hunterLevel: "1-19", normalTraps: 1, wildernessTraps: 2 },
  { hunterLevel: "20-39", normalTraps: 2, wildernessTraps: 3 },
  { hunterLevel: "40-59", normalTraps: 3, wildernessTraps: 4 },
  { hunterLevel: "60-79", normalTraps: 4, wildernessTraps: 5 },
  { hunterLevel: "80-99", normalTraps: 5, wildernessTraps: 6 },
];


// recCB = recommended minimum player combat level to fight this monster comfortably
const TRAINING_DATA = [
  // ── Very Low Level (Rec CB 1–30) ──────────────────────────────────────────
  {
    monster: "Goblins",
    monsterCB: "2",
    recCB: "1+",
    wildyLevel: "1–5 (near Edgeville ditch)",
    combatStyle: "Melee",
    xpKill: "8 Slayer XP",
    multiCombat: false,
    ironDrops: "Bones, goblin mail",
    riskLevel: "Low",
    notes: "Found just north of Edgeville near the Wilderness ditch. Entry-level combat. Can be done in very low-level gear.",
  },
  {
    monster: "Scorpions",
    monsterCB: "14",
    recCB: "15+",
    wildyLevel: "5–9 (south Wilderness), 39–42 (Lava Maze), 53–54 (Scorpion Pit)",
    combatStyle: "Melee (Poison)",
    xpKill: "17 Slayer XP",
    multiCombat: false,
    ironDrops: "Coins, various items",
    riskLevel: "Low–Medium",
    notes: "Poison attack — bring antipoison. Multiple Wilderness locations. King Scorpions at Lava Maze are stronger.",
  },
  {
    monster: "Dark Warriors",
    monsterCB: "8, 145",
    recCB: "20+",
    wildyLevel: "12–16 (Dark Warriors' Fortress)",
    combatStyle: "Melee",
    xpKill: "17 / 181 Slayer XP",
    multiCombat: false,
    ironDrops: "Black equipment, rune items (lv 145 variant), coins",
    riskLevel: "Low",
    notes: "Low-level fortress at level 12–16 Wilderness. A rune full helm spawns inside on the top floor. Popular early Wilderness destination.",
  },
  {
    monster: "Chaos Druids",
    monsterCB: "13",
    recCB: "20+",
    wildyLevel: "1–5 (Edgeville Dungeon, Wilderness section)",
    combatStyle: "Melee (Magic)",
    xpKill: "20 Slayer XP",
    multiCombat: false,
    ironDrops: "Grimy herbs (ranarr, toadflax, irit, avantoe, kwuarm, snapdragon), law runes, limpwurt roots",
    riskLevel: "Low",
    notes: "Best early herb source for ironmen in the game. Located in the northern Wilderness section of Edgeville Dungeon. Very low Wilderness level — minimal PK risk. Require Agility shortcut or running from the trapdoor entrance.",
  },
  {
    monster: "Skeletons",
    monsterCB: "22, 25, 45",
    recCB: "25+",
    wildyLevel: "Varies (Bone Yard 27–30, Agility Course 52–56, Wilderness mines)",
    combatStyle: "Melee",
    xpKill: "17–59 Slayer XP",
    multiCombat: false,
    ironDrops: "Bones, runes, coins",
    riskLevel: "Low–Medium",
    notes: "Bone Yard is a popular location — big bones also spawn on the ground here. Skeletons along the Wilderness Agility Course are more dangerous due to deep Wilderness.",
  },
  {
    monster: "Zombies",
    monsterCB: "18–24",
    recCB: "25+",
    wildyLevel: "18–21 (Graveyard of Shadows), 25–28 (Eastern Ruins)",
    combatStyle: "Melee",
    xpKill: "24–30 Slayer XP",
    multiCombat: false,
    ironDrops: "Grimy herbs, runes, bones",
    riskLevel: "Low–Medium",
    notes: "Graveyard of Shadows has many zombies and is relatively low Wilderness. Good early training. Zombie Pirates at Chaos Temple are variants.",
  },
  {
    monster: "Bears",
    monsterCB: "21",
    recCB: "25+",
    wildyLevel: "18–22 (west of Graveyard of Shadows)",
    combatStyle: "Melee",
    xpKill: "17 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, coins",
    riskLevel: "Low–Medium",
    notes: "Regular bears at level 21. Artio/Callisto (bear boss variants) are also in the same task family. Low-Wilderness location good for new players.",
  },
  // ── Low–Mid Level (Rec CB 30–60) ─────────────────────────────────────────
  {
    monster: "Hill Giants",
    monsterCB: "28",
    recCB: "30+",
    wildyLevel: "~50 (Deep Wilderness Dungeon)",
    combatStyle: "Melee",
    xpKill: "35 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, limpwurt roots, giant key (Obor access outside Wilderness)",
    riskLevel: "Very High",
    notes: "Deep Wilderness Dungeon (level ~50) is very risky. Hill Giants are much safer in the southern non-Wilderness Edgeville Dungeon — go there instead for safe training.",
  },
  {
    monster: "Hobgoblins",
    monsterCB: "28, 42",
    recCB: "35+",
    wildyLevel: "1–5 (Edgeville Dungeon south section — NOT Wilderness)",
    combatStyle: "Melee",
    xpKill: "30–51 Slayer XP",
    multiCombat: false,
    ironDrops: "Coins, runes, herbs",
    riskLevel: "None (south section is not Wilderness)",
    notes: "Southern Edgeville Dungeon is not Wilderness but it's right next to it. Hobgoblins give decent mid-level combat XP without PK risk.",
  },
  {
    monster: "Mammoths",
    monsterCB: "80",
    recCB: "50+",
    wildyLevel: "7–14 (west of Chaos Temple)",
    combatStyle: "Melee",
    xpKill: "130 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, coins, runes",
    riskLevel: "Low–Medium",
    notes: "Relatively low Wilderness level for their combat level. High HP. Popular Slayer task. Big bone drops useful for Prayer XP.",
  },
  {
    monster: "Earth Warriors",
    monsterCB: "51",
    recCB: "50+",
    wildyLevel: "7–10 (Edgeville Dungeon Wilderness section)",
    combatStyle: "Melee",
    xpKill: "54 Slayer XP",
    multiCombat: false,
    ironDrops: "Runes, coins, staff of earth (notable for ironmen), herbs",
    riskLevel: "Low",
    notes: "Requires 15 Agility to reach via shortcut in Edgeville Dungeon. Very low Wilderness level. Staff of earth is a useful drop for early ironmen.",
  },
  {
    monster: "Bandits (Bandit Camp)",
    monsterCB: "22, 34, 130",
    recCB: "50+",
    wildyLevel: "17–24 (Bandit Camp)",
    combatStyle: "Melee",
    xpKill: "27, 37, 159 Slayer XP",
    multiCombat: false,
    ironDrops: "Coins, iron/steel items, herbs",
    riskLevel: "Medium",
    notes: "Bandit Camp has a fishing spot nearby. Level 130 bandits are significantly harder. Moderate Wilderness depth.",
  },
  {
    monster: "Moss Giants",
    monsterCB: "42",
    recCB: "55+",
    wildyLevel: "~35 (south-east of Lava Maze)",
    combatStyle: "Melee",
    xpKill: "60 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, runes, herbs, mossy key (Bryophyta access outside Wilderness)",
    riskLevel: "High",
    notes: "Moderate Wilderness depth. Mossy key drops Bryophyta boss access outside Wilderness. Big bones are useful for Prayer.",
  },
  {
    monster: "Magic Axes",
    monsterCB: "42",
    recCB: "55+",
    wildyLevel: "54–56 (Magic Axe Hut)",
    combatStyle: "Melee",
    xpKill: "45 Slayer XP",
    multiCombat: true,
    ironDrops: "Magic logs (always drop — 10 noted), rune axe",
    riskLevel: "Very High",
    notes: "Magic Axe Hut requires a lockpick to enter. Magic logs are the guaranteed always-drop — excellent for an ironman's magic log supply. Extremely deep Wilderness.",
  },
  {
    monster: "Black Knights",
    monsterCB: "33",
    recCB: "55+",
    wildyLevel: "~35 (south of Silk Chasm), ~40 (Lava Maze)",
    combatStyle: "Melee",
    xpKill: "42 Slayer XP",
    multiCombat: false,
    ironDrops: "Black equipment, runes, coins",
    riskLevel: "High",
    notes: "Deep Wilderness location makes these higher risk than their combat level suggests.",
  },
  // ── Mid Level (Rec CB 60–90) ──────────────────────────────────────────────
  {
    monster: "Ents",
    monsterCB: "101",
    recCB: "60+",
    wildyLevel: "9–14, 20–24 (forests north/east of Chaos Temple)",
    combatStyle: "Melee",
    xpKill: "107.5 Slayer XP",
    multiCombat: false,
    ironDrops: "Noted logs (type based on WC level: normal/oak/willow/maple/yew/magic), bird nests (1/256)",
    riskLevel: "Low–Medium",
    notes: "Kill the Ent (combat level 101) then chop the trunk for logs. Log type depends on your Woodcutting level. Double logs vs WC Guild ents. Bird nest drops give seeds. Great combined combat + WC training.",
  },
  {
    monster: "Green Dragons",
    monsterCB: "79, 88",
    recCB: "65+",
    wildyLevel: "12–14 (west of Dark Warriors' Fortress), 24–26 (north of Graveyard), 35–38 (south of Lava Maze)",
    combatStyle: "Melee + Dragonfire",
    xpKill: "75 / 100 Slayer XP",
    multiCombat: false,
    ironDrops: "Green dragonhide (3 always), dragon bones (always), nature runes, coins",
    riskLevel: "Medium–High",
    notes: "Anti-dragon shield or dragonfire protection required. Multiple locations at varying Wilderness depths. Best early dragon bone and green hide source for ironmen. Frequently PKed.",
  },
  {
    monster: "Ankous",
    monsterCB: "86, 98",
    recCB: "70+",
    wildyLevel: "27–31 (Forgotten Cemetery), 19–22 (Wilderness Slayer Cave)",
    combatStyle: "Melee + Magic",
    xpKill: "70 / 100 Slayer XP",
    multiCombat: false,
    ironDrops: "Death runes, blood runes, law runes, coins, ensouled ankou head",
    riskLevel: "Medium–High",
    notes: "Forgotten Cemetery is a popular location. Excellent rune drops for ironmen. Can also be found in the Wilderness Slayer Cave (levels 19–22).",
  },
  {
    monster: "Ice Giants",
    monsterCB: "53, 67",
    recCB: "65+",
    wildyLevel: "17–19 (Wilderness Slayer Cave), 46–55 (Frozen Waste Plateau)",
    combatStyle: "Melee",
    xpKill: "70 / 100 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, runes, coins, herbs",
    riskLevel: "Medium–Very High",
    notes: "Frozen Waste Plateau is extremely deep Wilderness. Wilderness Slayer Cave variant is much safer at level 17–19. Big bone drops useful for Prayer.",
  },
  {
    monster: "Ice Warriors",
    monsterCB: "57",
    recCB: "65+",
    wildyLevel: "44–55 (Frozen Waste Plateau)",
    combatStyle: "Melee",
    xpKill: "59 Slayer XP",
    multiCombat: false,
    ironDrops: "Runes, coins, herbs",
    riskLevel: "Very High",
    notes: "Frozen Waste Plateau is very deep Wilderness (44–55). Primarily done as a Slayer task. High teleport block risk.",
  },
  {
    monster: "Hellhounds",
    monsterCB: "122, 136",
    recCB: "75+",
    wildyLevel: "18–20 (Wilderness Slayer Cave), 49–54 (north-east of Deserted Keep)",
    combatStyle: "Melee",
    xpKill: "116 / 150 Slayer XP",
    multiCombat: false,
    ironDrops: "Hard clue scrolls (1/64 — best source in-game!), bones, coins",
    riskLevel: "Medium–Very High",
    notes: "Best hard clue scroll drop rate in the game at 1/64. Wilderness Slayer Cave location (level 18–20) is relatively safe. Outside location (level 49–54) is much riskier.",
  },
  {
    monster: "Jellies",
    monsterCB: "78",
    recCB: "75+",
    wildyLevel: "23–25 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "75 Slayer XP",
    multiCombat: false,
    ironDrops: "Coins, runes, herbs, caskets",
    riskLevel: "Medium",
    notes: "Task-only in the Wilderness Slayer Cave (requires Slayer assignment from Krystilia or another master; 52 Slayer required). Multi-cannon usable in cave.",
  },
  {
    monster: "Dust Devils",
    monsterCB: "93",
    recCB: "75+",
    wildyLevel: "25–28 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "105 Slayer XP",
    multiCombat: false,
    ironDrops: "Runes, herbs, coins, mystic robes pieces",
    riskLevel: "Medium",
    notes: "Task-only in the Wilderness Slayer Cave (50 Slayer + Priest in Peril quest required). Smoke devil drops apply. Multi-cannon usable. Face mask or slayer helmet required.",
  },
  // ── High Level (Rec CB 90–110) ────────────────────────────────────────────
  {
    monster: "Pirates / Zombie Pirates",
    monsterCB: "22, 26, 28, 34",
    recCB: "30+ (pirates); 80+ (zombie pirates)",
    wildyLevel: "~54 (Pirates' Hideout), ~12 (Chaos Temple Zombie Pirates)",
    combatStyle: "Melee",
    xpKill: "23 Slayer XP",
    multiCombat: true,
    ironDrops: "Coins, runes, iron/steel/mithril items",
    riskLevel: "Very High (Pirates' Hideout is deep); Low (Zombie Pirates at Chaos Temple)",
    notes: "Pirates' Hideout requires a lockpick to enter and is at level 54 Wilderness — very high risk. Zombie Pirates at Chaos Temple (level ~12) are more accessible.",
  },
  {
    monster: "Lesser Demons",
    monsterCB: "82, 94",
    recCB: "80+",
    wildyLevel: "42–44 (south of Demonic Ruins, near KBD lair), 24–26 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "79 / 110 Slayer XP",
    multiCombat: false,
    ironDrops: "Rune full helm (common), ensouled demon head, runes, coins",
    riskLevel: "High–Very High",
    notes: "Rune full helm is an excellent ironman drop. Wilderness Slayer Cave (level 24–26) is the safer option. Demonic Ruins and KBD area are deeper Wilderness.",
  },
  {
    monster: "Elder Chaos Druids",
    monsterCB: "129",
    recCB: "85+",
    wildyLevel: "11–12 (Chaos Temple / Edgeville Dungeon deeper section)",
    combatStyle: "Melee + Magic (Teleblock!)",
    xpKill: "150 Slayer XP",
    multiCombat: true,
    ironDrops: "1–4 grimy herbs per kill (ranarr, toadflax, avantoe, kwuarm, snapdragon, torstol — best herb source in-game), law runes, pure essence",
    riskLevel: "Medium–High",
    notes: "Can cast Teleblock — bring antimagic or Protect from Magic. Multi-combat area. Drop 1–4 grimy herbs per kill including torstol. Best herb source in the game for ironmen. Looting bag essential.",
  },
  {
    monster: "Fire Giants",
    monsterCB: "86",
    recCB: "85+",
    wildyLevel: "53 (Deep Wilderness Dungeon)",
    combatStyle: "Melee",
    xpKill: "111 Slayer XP",
    multiCombat: false,
    ironDrops: "Big bones, rune items, herbs, coins, mystic robe tops",
    riskLevel: "Very High",
    notes: "Deep Wilderness Dungeon at level 53. Safespots available. Worth doing as Slayer task for Krystilia points despite the risk. Bring extended antifire.",
  },
  {
    monster: "Greater Demons",
    monsterCB: "92, 104",
    recCB: "85+",
    wildyLevel: "41–43 (Demonic Ruins, multi), 44–45 (Lava Maze Dungeon), 29–32 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "87 / 120 Slayer XP",
    multiCombat: true,
    ironDrops: "Rune full helm (common), ensouled demon head, rune items, coins",
    riskLevel: "High–Very High",
    notes: "Demonic Ruins is multi-combat — excellent for cannon use on Slayer task. Ashes can be scattered for Herblore XP. Wilderness Slayer Cave variant (level 29–32) is safer.",
  },
  {
    monster: "Rogues",
    monsterCB: "15, 135",
    recCB: "85+",
    wildyLevel: "50–54 (Rogues' Castle, east of Mage Arena)",
    combatStyle: "Melee",
    xpKill: "17 / 125 Slayer XP",
    multiCombat: false,
    ironDrops: "Coins, rune items, rogue equipment pieces (full rogue set for Thieving)",
    riskLevel: "Very High",
    notes: "Rogues' Castle at level 50–54 Wilderness. Rogue equipment drops can complete the rogue set for double Thieving loot. Usually combined with chest pickpocketing (84 Thieving).",
  },
  {
    monster: "Black Demons",
    monsterCB: "172, 188",
    recCB: "90+",
    wildyLevel: "5–6 (Edgeville Dungeon Wilderness section), 24–27 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "157 / 200 Slayer XP",
    multiCombat: false,
    ironDrops: "Rune full helm, ensouled demon head, runes, coins",
    riskLevel: "Low (Edgeville Dungeon) – Medium (Slayer Cave)",
    notes: "Edgeville Dungeon variant is very low Wilderness level — relatively safe. Good Slayer task XP. Wilderness Slayer Cave variant at level 24–27 drops better loot.",
  },
  {
    monster: "Nechryael / Greater Nechryael",
    monsterCB: "115 / 200",
    recCB: "90+",
    wildyLevel: "22–25 (Wilderness Slayer Cave)",
    combatStyle: "Melee",
    xpKill: "105 Slayer XP",
    multiCombat: false,
    ironDrops: "Death runes (always 2–4), runes, herbs, rune equipment, ensouled head",
    riskLevel: "Medium",
    notes: "Task-only (80 Slayer required). Found as Greater Nechryael in the Wilderness Slayer Cave — stronger variant with better drops. Death runes are always dropped — excellent for ironmen. 77 Agility shortcut nearby.",
  },
  {
    monster: "Black Dragons",
    monsterCB: "227, 247",
    recCB: "90+",
    wildyLevel: "44–45 (Lava Maze Dungeon), 30–32 (Wilderness Slayer Cave)",
    combatStyle: "Melee + Dragonfire",
    xpKill: "199 Slayer XP",
    multiCombat: false,
    ironDrops: "Dragon bones (always), black dragonhide (always 2), draconic visage (rare), rune items, coins",
    riskLevel: "Very High (Lava Maze) / Medium (Slayer Cave)",
    notes: "Anti-dragon shield or dragonfire shield required. Lava Maze Dungeon is extremely risky. Wilderness Slayer Cave (level 30–32) is the recommended location. Dragon bones and hides are the key ironman resource.",
  },
  {
    monster: "Lava Dragons",
    monsterCB: "252",
    recCB: "90+",
    wildyLevel: "36–43 (Lava Dragon Isle)",
    combatStyle: "Magic + Melee (Dragonfire)",
    xpKill: "248 Slayer XP",
    multiCombat: true,
    ironDrops: "Lava dragon bones (340 XP on isle, 85 elsewhere), rune items (helm, platebody, platelegs), coins",
    riskLevel: "Very High",
    notes: "Anti-dragon shield or dragonfire protection required. Lava dragon bones give 340 Prayer XP when buried on the isle itself (4× normal). Multi-combat, safespots available. Frequently PKed. Looting bag essential.",
  },
  {
    monster: "Revenants",
    monsterCB: "7–135 (revenant imp to revenant dragon)",
    recCB: "90+",
    wildyLevel: "17–40 (Revenant Caves)",
    combatStyle: "All styles (varies by type)",
    xpKill: "10–140 Slayer XP (varies by revenant type)",
    multiCombat: true,
    ironDrops: "Bracelet of ethereum (required to reduce damage), ancient emblems/statuette/crystal/medallion/totem (ether charge), blighted supplies, rune items",
    riskLevel: "Extreme",
    notes: "Bracelet of ethereum must be worn — reduces revenant damage by 75%. Caves are multi-combat and a prime PK hotspot. Ancient emblems are tradeable and can be charged by ironmen. Bring minimal supplies.",
  },
  {
    monster: "Spiritual Creatures",
    monsterCB: "120–123 (mage/ranger/warrior)",
    recCB: "90+",
    wildyLevel: "24–29 (Wilderness God Wars Dungeon)",
    combatStyle: "Melee / Magic / Ranged",
    xpKill: "75–106 Slayer XP",
    multiCombat: true,
    ironDrops: "Dragon boots (spiritual mage, very rare), dragon med helm (spiritual warrior), rune items, herbs, seeds",
    riskLevel: "High",
    notes: "63 Slayer required. Wilderness GWD requires 60 Agility OR 60 Strength. Dragon boots (from Spiritual Mage) are a key ironman drop. Multi-cannon usable here.",
  },
  {
    monster: "Aviansie",
    monsterCB: "69–137",
    recCB: "90+",
    wildyLevel: "26–29 (Wilderness God Wars Dungeon)",
    combatStyle: "Ranged",
    xpKill: "70–139 Slayer XP",
    multiCombat: true,
    ironDrops: "Noted adamantite bars (always), noted mithril bars, rune items, ecumenical keys, Armadyl armour pieces",
    riskLevel: "High",
    notes: "60 Agility or Strength to enter GWD. Noted adamantite bars are an excellent ironman resource — 5 bars per kill from Armadylean Guardians. Ecumenical keys drop here. Watch the Birdie unlock needed (80 Slayer pts).",
  },
  {
    monster: "Abyssal Demons",
    monsterCB: "124",
    recCB: "95+",
    wildyLevel: "29–33 (Wilderness Slayer Cave)",
    combatStyle: "Melee (Teleport attack)",
    xpKill: "150 Slayer XP",
    multiCombat: false,
    ironDrops: "Abyssal whip (1/512), abyssal dagger (1/32,768), rune chainbody (common), ensouled head, coins",
    riskLevel: "Medium",
    notes: "Task-only (85 Slayer + Priest in Peril quest required). Abyssal whip is a critical ironman drop (best 1-handed melee weapon pre-Scythe). Multi-cannon usable. 77 Agility shortcut available.",
  },
  {
    monster: "Bloodveld",
    monsterCB: "81",
    recCB: "90+",
    wildyLevel: "26–29 (Wilderness God Wars Dungeon)",
    combatStyle: "Magic-based melee (unusual)",
    xpKill: "134 Slayer XP",
    multiCombat: true,
    ironDrops: "Coins, runes, herbs, blighted supplies",
    riskLevel: "High",
    notes: "60 Agility or Strength to enter GWD. High Slayer XP relative to combat level. Bloodveld's melee attacks are Magic-based — use Protect from Magic. Multi-cannon very effective here.",
  },
];


const BOSSES_DATA = [
  {
    boss: "Artio",
    variant: "Callisto — safer solo variant",
    wildyLevel: "21 (Hunter's End)",
    combatLevel: 320,
    combatType: "Singles-plus",
    diaryReq: "Hard Wilderness Diary OR active Callisto boss Slayer task",
    keyDrops: "Dragon pickaxe (1/358), Voidwaker hilt (1/912), Tyrannical ring (1/716), Claws of Callisto (1/618), Callisto cub (1/2,800)",
    strategy: "Ice Barrage + Ranged",
    notes: "Min hit 15 through Protect from Melee. First Ice Barrage freeze is guaranteed if Magic acc > 0. Safer and more accessible than Callisto. Hard Diary removes teleport block delay on entry.",
  },
  {
    boss: "Callisto",
    variant: "Multi variant — higher drop quantities, more risk",
    wildyLevel: "57 (south of Demonic Ruins)",
    combatLevel: 470,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Dragon pickaxe, Voidwaker hilt, Tyrannical ring, Claws of Callisto, Callisto cub (1/2,800)",
    strategy: "Ice Barrage + Ranged",
    notes: "Min hit 35 through Protect from Melee. Same unique table as Artio but higher drop quantities. Extremely deep Wilderness — extreme PK risk. Artio recommended for most players.",
  },
  {
    boss: "Spindel",
    variant: "Venenatis — safer solo variant",
    wildyLevel: "21 (south-east of Dark Warriors' Fortress)",
    combatLevel: 309,
    combatType: "Singles-plus",
    diaryReq: "Hard Wilderness Diary OR active Venenatis boss Slayer task",
    keyDrops: "Dragon 2h sword (1/358), Voidwaker blade (1/912), Treasonous ring (1/716), Venenatis spiderling (1/2,800)",
    strategy: "Protect from Magic, Ranged",
    notes: "Web-throwing special attack can bind the player. Protect from Magic is the primary prayer. Hard Diary removes teleport block delay.",
  },
  {
    boss: "Venenatis",
    variant: "Multi variant — higher drop quantities, more risk",
    wildyLevel: "26–30 (east of Bone Yard)",
    combatLevel: 464,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Dragon 2h sword, Voidwaker blade, Treasonous ring, Venenatis spiderling (1/2,800)",
    strategy: "Protect from Magic, Ranged",
    notes: "Protect from Magic primarily. Multi-combat area increases PK risk significantly. Spindel recommended for solo players.",
  },
  {
    boss: "Calvar'ion",
    variant: "Vet'ion — safer solo variant",
    wildyLevel: "21 (Vet'ion's Shrines)",
    combatLevel: 238,
    combatType: "Singles-plus",
    diaryReq: "Hard Wilderness Diary OR active Vet'ion boss Slayer task",
    keyDrops: "Dragon pickaxe (1/358), Voidwaker gem (1/912), Ring of the gods (1/716), Vet'ion jr. (1/2,800)",
    strategy: "Switch Protect from Magic / Melee per phase",
    notes: "Spawns Skeleton Hellhounds during fight — kill them to prevent healing. Two phases (orange → purple). Protect from Magic during Magic phase, Protect from Melee otherwise.",
  },
  {
    boss: "Vet'ion",
    variant: "Multi variant — higher drop quantities, more risk",
    wildyLevel: "34–36 (north of Bone Yard)",
    combatLevel: 454,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Dragon pickaxe, Voidwaker gem, Ring of the gods, Vet'ion jr. (1/2,800)",
    strategy: "Switch Protect from Magic / Melee per phase",
    notes: "Two phases (orange and purple). Spawns Greater Skeleton Hellhounds. Full restore on phase change. Multi-combat increases PK danger.",
  },
  {
    boss: "Scorpia",
    variant: "Unique overworld boss",
    wildyLevel: "54 (Scorpia's Lair, under Scorpion Pit)",
    combatLevel: 225,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Odium shard 3 (1/128), Malediction shard 3 (1/128), Scorpia's offspring (1/2,016)",
    strategy: "Protect from Magic",
    notes: "Scorpia's guardians attack alongside her and she can heal by attacking them — kill guardians quickly. Antipoison and antifire recommended. 1/3 of Odium/Malediction ward components.",
  },
  {
    boss: "Chaos Elemental",
    variant: "Overworld boss",
    wildyLevel: "50–56 (west of Rogues' Castle)",
    combatLevel: 305,
    combatType: "Multi-combat",
    diaryReq: "None (Elite diary task: kill without protection prayers)",
    keyDrops: "Dragon 2h sword (1/128), Dragon pickaxe (1/256), Ancient staff (1/128), Chaos elemental pet (1/300)",
    strategy: "Protect from Magic, extra equipment in inventory",
    notes: "Special attack randomly unequips worn items — bring spare weapons/armour. Degrades food by 1. Frequently PKed at this location. Elite diary task requires no protection prayers.",
  },
  {
    boss: "Chaos Fanatic",
    variant: "Overworld boss",
    wildyLevel: "38 (west of Lava Maze)",
    combatLevel: 202,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Ancient staff pieces (all three shards available), Malediction shard 1, Odium shard 1 (~1/120 each)",
    strategy: "Protect from Magic, Ranged",
    notes: "Weak to Ranged. Fires purple balls that explode in a 3×3 AoE — move to avoid. Very close to Chaos Temple hut — excellent to combine with Prayer training. Malediction/Odium shard 1 of 3.",
  },
  {
    boss: "Crazy Archaeologist",
    variant: "Overworld boss",
    wildyLevel: "21–24 (Western Ruins)",
    combatLevel: 204,
    combatType: "Multi-combat",
    diaryReq: "None",
    keyDrops: "Fedora (1/200), Ancient staff pieces, Malediction shard 1 (1/120)",
    strategy: "Protect from Magic, Ranged",
    notes: "Fires a book spread attack covering many tiles — move diagonally. Relatively low Wilderness level makes him one of the most accessible Wilderness bosses. Malediction shard 1 of 3.",
  },
  {
    boss: "King Black Dragon (KBD)",
    variant: "Dragon boss — lever access from level 42 Wilderness",
    wildyLevel: "42 Wilderness to reach lever (lair itself is instanced)",
    combatLevel: 276,
    combatType: "Multi (lair is safe from other players, but they can follow)",
    diaryReq: "None",
    keyDrops: "Draconic visage (1/5,000), Dragon pickaxe (1/1,500), KBD heads (1/128), Dragon med helm (1/256)",
    strategy: "Dragonfire shield / anti-dragon shield + Ranged or Melee",
    notes: "Lever to enter lair is at level 42 Wilderness — PKers can attack while pulling it. Inside the lair other players can follow. Anti-dragon shield or dragonfire shield REQUIRED to protect from dragonfire.",
  },
];

const ITEM_SPAWNS_DATA = [
  {
    item: "Wine of Zamorak",
    location: "Chaos Temple (hut) — table inside",
    wildyLevel: "38",
    respawn: "~20 seconds",
    notes: "Must be taken with Telekinetic Grab (cannot be walked to). Noted form after completing Hard Wilderness Diary.",
  },
  {
    item: "Rune full helm",
    location: "Dark Warriors' Fortress",
    wildyLevel: "12–17",
    respawn: "~30 seconds",
    notes: "Spawns inside the upper floor of the fortress. Requires navigating through the castle.",
  },
  {
    item: "Rune platelegs",
    location: "Bone Yard (ground spawn)",
    wildyLevel: "29–35",
    respawn: "~30 seconds",
    notes: "Notable free Rune item at the Bone Yard. Also a Slayer task area.",
  },
  {
    item: "Rune platebody",
    location: "Lava Maze (inside fenced area)",
    wildyLevel: "41–46",
    respawn: "~30 seconds",
    notes: "Requires a knife or slash weapon to cut through the web to enter the fenced area.",
  },
  {
    item: "Adamant full helm",
    location: "Demonic Ruins",
    wildyLevel: "44–47",
    respawn: "~30 seconds",
    notes: "Spawns among the ruins. Deep Wilderness — high PK risk.",
  },
  {
    item: "Adamant platebody",
    location: "Demonic Ruins",
    wildyLevel: "44–47",
    respawn: "~30 seconds",
    notes: "Spawns among the ruins alongside the full helm and platelegs.",
  },
  {
    item: "Adamant platelegs",
    location: "Demonic Ruins",
    wildyLevel: "44–47",
    respawn: "~30 seconds",
    notes: "Full adamant armour set can be collected from this single location.",
  },
  {
    item: "Dark fishing bait",
    location: "Lava Dragon Isle (ground spawn, various)",
    wildyLevel: "36–43",
    respawn: "~30 seconds",
    notes: "Required for fishing Dark Crabs at the Resource Area. Multiple spawns around Lava Dragon Isle.",
  },
  {
    item: "Steel items (various)",
    location: "Frozen Waste Plateau",
    wildyLevel: "53–54",
    respawn: "~30 seconds",
    notes: "Low-value steel gear. Extremely deep Wilderness — not worth the trip solo for these items.",
  },
  {
    item: "Muddy key",
    location: "Chaos Dwarves / Muddy Chest loot",
    wildyLevel: "~46",
    respawn: "N/A (monster drop)",
    notes: "Dropped by chaos dwarves (1/12.5). Opens the Muddy Chest at the centre of the Lava Maze for moderate loot.",
  },
  {
    item: "Looting bag",
    location: "Dropped by any Wilderness monster",
    wildyLevel: "Any",
    respawn: "N/A (monster drop)",
    notes: "1/3 drop rate from any Wilderness monster. Essential for bringing extra loot out. Can hold 28 items.",
  },
  {
    item: "Larran's key (small/big)",
    location: "Wilderness Slayer tasks",
    wildyLevel: "Any (Slayer task required)",
    respawn: "N/A (Slayer drop)",
    notes: "Small key from non-boss Krystilia tasks; big key from boss tasks. Open Larran's Chest (level 42/49 Wilderness) for valuable loot.",
  },
  {
    item: "Wilderness sword (1–4)",
    location: "Wilderness Diary reward",
    wildyLevel: "N/A",
    respawn: "N/A (diary reward)",
    notes: "Tier 1–4 rewarded from Easy–Elite Wilderness Diary completion. Tier 4 provides free noted dragon bones from dark crests.",
  },
];

const SLAYER_DATA = [
  { monster: "Abyssal demons", amount: "75–125 (ext: 200–250)", combatLevel: "124", slayerXp: "150", location: "Wilderness Slayer Cave", wildyLevel: "35–39", weight: 5, slayerReq: "85 Slayer, Priest in Peril" },
  { monster: "Ankou", amount: "75–125 (ext: 91–150)", combatLevel: "86, 98", slayerXp: "70, 100", location: "Forgotten Cemetery, Wilderness Slayer Cave", wildyLevel: "27–31, 34–36", weight: 6, slayerReq: "None" },
  { monster: "Aviansie", amount: "75–125 (ext: 200–250)", combatLevel: "69–137", slayerXp: "70–139", location: "Wilderness God Wars Dungeon", wildyLevel: "26–29", weight: 7, slayerReq: "60 Agility or 60 Strength; Watch the birdie unlock (80 pts)" },
  { monster: "Bandits", amount: "75–125", combatLevel: "22, 34, 130", slayerXp: "27, 37, 159", location: "Bandit Camp", wildyLevel: "17–24", weight: 4, slayerReq: "None" },
  { monster: "Bears", amount: "65–100", combatLevel: "21 (+ Artio 320 / Callisto 470)", slayerXp: "17–21", location: "North-west of Ferox Enclave, west of Graveyard of Shadows", wildyLevel: "18–22", weight: 6, slayerReq: "None (Artio/Callisto require like a boss unlock)" },
  { monster: "Black demons", amount: "100–150 (ext: 200–250)", combatLevel: "172, 188", slayerXp: "157, 200", location: "Edgeville Dungeon, Wilderness Slayer Cave", wildyLevel: "5–6, 28–31", weight: 7, slayerReq: "None" },
  { monster: "Black dragons", amount: "8–16 (ext: 40–60)", combatLevel: "227, 247", slayerXp: "199.4", location: "Lava Maze Dungeon, Wilderness Slayer Cave", wildyLevel: "44–45; 30–31", weight: 4, slayerReq: "None" },
  { monster: "Black Knights", amount: "75–125", combatLevel: "33", slayerXp: "42", location: "South of Silk Chasm, Lava Maze", wildyLevel: "~35, ~40", weight: 3, slayerReq: "None" },
  { monster: "Bloodveld", amount: "70–110 (ext: 200–250)", combatLevel: "81", slayerXp: "134", location: "Wilderness God Wars Dungeon", wildyLevel: "26–29", weight: 4, slayerReq: "60 Agility or 60 Strength" },
  { monster: "Chaos druids", amount: "50–90", combatLevel: "13 (Elder: 129)", slayerXp: "20, 150", location: "Edgeville Dungeon, Chaos Temple (Elder Chaos druids)", wildyLevel: "1–5, 11–12", weight: 5, slayerReq: "None" },
  { monster: "Dark warriors", amount: "75–125", combatLevel: "8, 145", slayerXp: "17, 181.4", location: "Dark Warriors' Fortress", wildyLevel: "12–16", weight: 4, slayerReq: "None" },
  { monster: "Dust devils", amount: "75–125 (ext: 200–250)", combatLevel: "93", slayerXp: "105", location: "Wilderness Slayer Cave", wildyLevel: "18–24", weight: 5, slayerReq: "50 Slayer, Priest in Peril" },
  { monster: "Earth warriors", amount: "75–125", combatLevel: "51", slayerXp: "54", location: "Edgeville Dungeon", wildyLevel: "7–10", weight: 6, slayerReq: "None" },
  { monster: "Ents", amount: "35–60", combatLevel: "101", slayerXp: "107.5", location: "Forests north & east of Chaos Temple", wildyLevel: "9–14, 20–24", weight: 5, slayerReq: "None" },
  { monster: "Fire giants", amount: "75–125", combatLevel: "86", slayerXp: "111", location: "Deep Wilderness Dungeon", wildyLevel: "53", weight: 7, slayerReq: "None" },
  { monster: "Greater demons", amount: "100–150 (ext: 200–250)", combatLevel: "92, 104", slayerXp: "87, 120", location: "Demonic Ruins, Lava Maze Dungeon, Wilderness Slayer Cave", wildyLevel: "25–48", weight: 8, slayerReq: "None" },
  { monster: "Green dragons", amount: "65–100", combatLevel: "79, 88", slayerXp: "75, 100", location: "West of Dark Warriors' Fortress, north of Graveyard of Shadows, Wilderness Slayer Cave", wildyLevel: "12–38", weight: 4, slayerReq: "None" },
  { monster: "Hellhounds", amount: "75–125", combatLevel: "122, 136", slayerXp: "116, 150", location: "North-east of Deserted Keep, Wilderness Slayer Cave", wildyLevel: "18–54", weight: 7, slayerReq: "None" },
  { monster: "Hill giants", amount: "75–125", combatLevel: "28", slayerXp: "35", location: "Near Boneyard Hunter area, Deep Wilderness Dungeon", wildyLevel: "~20, ~50", weight: 3, slayerReq: "None" },
  { monster: "Ice giants", amount: "100–150", combatLevel: "53, 67", slayerXp: "70, 100", location: "Frozen Waste Plateau, Wilderness Slayer Cave", wildyLevel: "~18, 46–55", weight: 6, slayerReq: "None" },
  { monster: "Ice warriors", amount: "100–150", combatLevel: "57", slayerXp: "59", location: "Frozen Waste Plateau", wildyLevel: "44–55", weight: 7, slayerReq: "None" },
  { monster: "Jellies", amount: "100–150", combatLevel: "78", slayerXp: "75", location: "Wilderness Slayer Cave", wildyLevel: "19–22", weight: 5, slayerReq: "52 Slayer" },
  { monster: "Lava dragons", amount: "35–60", combatLevel: "252", slayerXp: "248", location: "Lava Dragon Isle", wildyLevel: "36–43", weight: 3, slayerReq: "None" },
  { monster: "Lesser demons", amount: "80–120", combatLevel: "82, 94", slayerXp: "79, 110", location: "Muddy chest area, KBD Lair cage, south of Demonic Ruins, Wilderness Slayer Cave", wildyLevel: "24–44", weight: 6, slayerReq: "None" },
  { monster: "Magic axes", amount: "75–125", combatLevel: "42", slayerXp: "45", location: "Magic Axe Hut (bring lockpick)", wildyLevel: "54–56", weight: 7, slayerReq: "None" },
  { monster: "Mammoths", amount: "75–125", combatLevel: "80", slayerXp: "130", location: "West of Chaos Temple", wildyLevel: "7–14", weight: 6, slayerReq: "None" },
  { monster: "Moss giants", amount: "100–150", combatLevel: "42", slayerXp: "60", location: "South-east of Lava Maze", wildyLevel: "~35", weight: 4, slayerReq: "None" },
  { monster: "Nechryael", amount: "75–125 (ext: 200–250)", combatLevel: "200", slayerXp: "105", location: "Wilderness Slayer Cave", wildyLevel: "19–22", weight: 5, slayerReq: "80 Slayer" },
  { monster: "Pirates", amount: "62–75", combatLevel: "22, 26, 28, 34", slayerXp: "23", location: "Pirates' Hideout (lockpick needed), Chaos Temple (Zombie Pirates)", wildyLevel: "~54", weight: 3, slayerReq: "None" },
  { monster: "Revenants", amount: "40–100 (ext: 100–150)", combatLevel: "7–135", slayerXp: "10–140", location: "Revenant Caves", wildyLevel: "17–40", weight: 5, slayerReq: "None" },
  { monster: "Rogues", amount: "75–125", combatLevel: "15, 135", slayerXp: "17, 125", location: "Rogues' Castle, east of Mage Arena", wildyLevel: "50–54", weight: 5, slayerReq: "None" },
  { monster: "Scorpions", amount: "65–100", combatLevel: "14", slayerXp: "17", location: "West of Air Obelisk, Scorpion Pit, Lava Maze (King Scorpions)", wildyLevel: "5–54", weight: 6, slayerReq: "None" },
  { monster: "Skeletons", amount: "65–100", combatLevel: "22, 25, 45", slayerXp: "17–59", location: "S. Wilderness mine, Bone Yard, Edgeville Dungeon, Agility Course", wildyLevel: "Varies", weight: 5, slayerReq: "None" },
  { monster: "Spiders", amount: "65–100", combatLevel: "2, 27, 34, 61, 64", slayerXp: "2–64", location: "North-west of Lava Dragon Isle, Eastern Ruins, Edgeville Dungeon", wildyLevel: "Varies", weight: 6, slayerReq: "None" },
  { monster: "Spiritual creatures", amount: "100–150 (ext: 181–250)", combatLevel: "120–123", slayerXp: "75, 85, 106", location: "Wilderness God Wars Dungeon", wildyLevel: "24–29", weight: 6, slayerReq: "60 Agility or 60 Strength; 63 Slayer (Death Plateau quest)" },
  { monster: "Wilderness bosses / demi-bosses", amount: "3–35 (ext: N/A)", combatLevel: "202–470", slayerXp: "225–454", location: "Various (Callisto, Chaos Elemental, Chaos Fanatic, Crazy Arch, Scorpia, Venenatis, Vet'ion)", wildyLevel: "22–57", weight: 8, slayerReq: "Like a boss unlock (200 pts)" },
  { monster: "Zombies", amount: "75–125", combatLevel: "18, 22, 24, 28, 34", slayerXp: "24, 30", location: "Graveyard of Shadows, Eastern Ruins, Chaos Temple (Zombie Pirates)", wildyLevel: "18–28", weight: 3, slayerReq: "None" },
];

const QUESTS_DATA = [
  {
    name: "Desert Treasure I",
    type: "Quest",
    wildyInvolvement: "High — multiple Ancient Pyramid visits; final boss fight in the Pyramid",
    reward: "Access to Ancient Magicks spellbook (Ice Barrage, Blood Barrage, etc.)",
    notes: "One of the most impactful quests for Wilderness content. Unlocks freezing spells essential for PvP and bossing.",
  },
  {
    name: "Mage Arena",
    type: "Miniquest",
    wildyInvolvement: "Required — fight Kolodion in level 56 Wilderness arena",
    reward: "God capes (Saradomin/Guthix/Zamorak), ability to cast God spells",
    notes: "Required before Mage Arena II. God spells require 60 Magic minimum (up to 80 for highest).",
  },
  {
    name: "Mage Arena II",
    type: "Miniquest",
    wildyInvolvement: "Required — charge God spells at 3 altars in deep Wilderness",
    reward: "Imbued God capes (+75 Magic stats — best in slot for Magic attack)",
    notes: "Must imbue each God cape by casting its spell 100× at the relevant Wilderness altar. High PK risk during charging.",
  },
  {
    name: "Enter the Abyss",
    type: "Miniquest",
    wildyInvolvement: "Abyss entrance is level 5 Wilderness near Edgeville",
    reward: "Access to the Abyss for fast Runecrafting; small Runecrafting XP lamp",
    notes: "Low PK risk. Required for efficient Runecrafting via the Abyss. Pray Protect from Magic in the Abyss.",
  },
  {
    name: "Defender of Varrock",
    type: "Quest",
    wildyInvolvement: "Visit several Wilderness locations during the quest",
    reward: "Access to Armoured Zombies in Chaos Tunnels; Varrock armour tier upgrade",
    notes: "Medium-length quest. Armoured Zombies are excellent combat training.",
  },
  {
    name: "While Guthix Sleeps",
    type: "Quest",
    wildyInvolvement: "Access Chaos Temple upper floor (level 38 Wilderness)",
    reward: "Tormented demons, access to ancient armour/weapons",
    notes: "Elite quest with high requirements. Upper floor of Chaos Temple is free of Wilderness PvP rules.",
  },
  {
    name: "The General's Shadow",
    type: "Miniquest",
    wildyInvolvement: "Enter the Wilderness for shadow creature fights",
    reward: "Improved Iban's staff (Iban's staff (u)) — doubles charges",
    notes: "Short miniquest following Underground Pass. Iban's staff (u) holds 2,500 charges vs 1,000.",
  },
];

const DIARY_DATA = [
  {
    tier: "Easy",
    task: "Enter the Wilderness",
    reward: "Wilderness sword 1 — functions as slash weapon; can cut webs",
    notes: "Simplest diary entry — just cross the ditch north of Edgeville.",
  },
  {
    tier: "Easy",
    task: "Pray at the Chaos altar in the Wilderness",
    reward: "Wilderness sword 1",
    notes: "The altar is at the Chaos Temple hut, level 38 Wilderness.",
  },
  {
    tier: "Easy",
    task: "Kill a zombie in the Graveyard of Shadows",
    reward: "Wilderness sword 1",
    notes: "Graveyard is level 18–21 Wilderness. Low risk.",
  },
  {
    tier: "Easy",
    task: "Mine some iron ore in the Wilderness",
    reward: "Wilderness sword 1",
    notes: "Multiple iron rock locations in low Wilderness levels.",
  },
  {
    tier: "Medium",
    task: "Steal from the Rogues' Castle chest",
    reward: "Wilderness sword 2 — 50% chance of double Wilderness loot",
    notes: "Level 84 Thieving required. Rogues' Castle is level 50–54 Wilderness.",
  },
  {
    tier: "Medium",
    task: "Activate the Chaos Temple altar with a dragon bone",
    reward: "Wilderness sword 2",
    notes: "Requires bringing a dragon bone to the Chaos Temple hut.",
  },
  {
    tier: "Medium",
    task: "Teleport using a Wilderness obelisk",
    reward: "Wilderness sword 2",
    notes: "Obelisks are scattered across the Wilderness at levels 13, 19, 27, 35, 44.",
  },
  {
    tier: "Hard",
    task: "Charge a Zamorak staff at the Chaos altar",
    reward: "Wilderness sword 3 — can teleport to Fountain of Rune; obelisk targeting",
    notes: "Requires completing the Mage Arena miniquest first.",
  },
  {
    tier: "Hard",
    task: "Enter the Wilderness God Wars Dungeon",
    reward: "Wilderness sword 3 — target specific obelisk teleport destination",
    notes: "Requires 60 Agility or 60 Strength.",
  },
  {
    tier: "Hard",
    task: "Steal from the Magic chest at the Wilderness Resource Area",
    reward: "Wilderness sword 3",
    notes: "500 GP entry fee. Level 84 Thieving recommended.",
  },
  {
    tier: "Elite",
    task: "Kill the Chaos Elemental without any protection prayers",
    reward: "Wilderness sword 4 — noted dragon bones from Larran's Big Chest; doubled ecumenical key cap",
    notes: "High skill check. The Chaos Elemental randomly unequips gear — bring spare items.",
  },
  {
    tier: "Elite",
    task: "Craft 56 or more chaos runes from a single inventory",
    reward: "Wilderness sword 4",
    notes: "Requires 99 Runecrafting or use of pouches at high RC level.",
  },
  {
    tier: "Elite",
    task: "Complete a lap of the Wilderness Agility Course without failing",
    reward: "Wilderness sword 4",
    notes: "Even at 99 Agility it is possible to fail. May take multiple attempts.",
  },
];

// ─── Risk Badge ──────────────────────────────────────────────

function RiskBadge({ level }) {
  const map = {
    Low: "bg-green-900/60 text-green-300 border-green-700",
    "Low–Medium": "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    Medium: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    "Medium–High": "bg-orange-900/60 text-orange-300 border-orange-700",
    High: "bg-orange-900/60 text-orange-300 border-orange-700",
    "Very High": "bg-red-900/60 text-red-300 border-red-700",
    Extreme: "bg-red-950/80 text-red-200 border-red-600",
  };
  const cls = map[level] || "bg-stone-800 text-stone-300 border-stone-600";
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold border rounded-full ${cls}`}>
      {level}
    </span>
  );
}

function TierBadge({ tier }) {
  const map = {
    Easy: "bg-green-900/60 text-green-300 border-green-700",
    Medium: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    Hard: "bg-orange-900/60 text-orange-300 border-orange-700",
    Elite: "bg-red-900/60 text-red-300 border-red-700",
  };
  const cls = map[tier] || "bg-stone-800 text-stone-300 border-stone-600";
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-full ${cls}`}>
      {tier}
    </span>
  );
}

// ─── Sort Icon ───────────────────────────────────────────────

function SortIcon({ direction }) {
  if (!direction)
    return (
      <span className="ml-1 text-stone-600 text-xs">⇅</span>
    );
  return (
    <span className="ml-1 text-red-400 text-xs">{direction === "asc" ? "↑" : "↓"}</span>
  );
}

// ─── Wilderness Table ─────────────────────────────────────────

function WildernessTable({ columns, data, searchKeys }) {
  const [query, setQuery] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(colKey);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [query, data, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortCol] ?? "";
      const vb = b[sortCol] ?? "";
      const na = parseFloat(String(va).replace(/,/g, ""));
      const nb = parseFloat(String(vb).replace(/,/g, ""));
      if (!isNaN(na) && !isNaN(nb)) {
        return sortDir === "asc" ? na - nb : nb - na;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortCol, sortDir]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4 max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full bg-stone-900/80 border border-stone-700 focus:border-red-600 text-stone-200 placeholder-stone-500 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none transition-colors"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-700/60">
        <table className="w-full text-sm text-left text-stone-300 border-collapse">
          <thead>
            <tr className="bg-stone-900/90 border-b border-stone-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                  className={`px-4 py-3 font-semibold text-stone-400 uppercase tracking-wide text-xs whitespace-nowrap select-none ${col.sortable !== false ? "cursor-pointer hover:text-red-400 transition-colors" : ""}`}
                >
                  {col.label}
                  {col.sortable !== false && <SortIcon direction={sortCol === col.key ? sortDir : null} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-stone-500 italic">
                  No results for "{query}"
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-stone-800/60 ${i % 2 === 0 ? "bg-stone-900/30" : "bg-stone-950/30"} hover:bg-red-950/20 transition-colors`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-top ${col.className || ""}`}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-2 bg-stone-900/50 border-t border-stone-800 text-xs text-stone-500">
          {sorted.length} {sorted.length === 1 ? "result" : "results"}
          {query && ` for "${query}"`}
        </div>
      </div>
    </div>
  );
}

// ─── Tab definitions ─────────────────────────────────────────

const TABS = [
  { id: "skilling", label: "Skilling Methods", icon: "⛏️" },
  { id: "training", label: "Training Methods", icon: "⚔️" },
  { id: "bosses", label: "Bosses", icon: "💀" },
  { id: "spawns", label: "Item Spawns", icon: "📦" },
  { id: "slayer", label: "Slayer", icon: "🗡️" },
  { id: "diaries", label: "Quests & Diaries", icon: "📜" },
];

// ─── Column definitions ───────────────────────────────────────

const SKILLING_COLS = [
  { key: "activity", label: "Activity", sortable: true },
  { key: "skill", label: "Skill", sortable: true },
  { key: "levelReq", label: "Level Req", sortable: true },
  { key: "wildyLevel", label: "Wildy Level", sortable: false },
  { key: "xpLow", label: "XP/hr (Low)", sortable: true, render: (v) => v.toLocaleString() },
  { key: "xpHigh", label: "XP/hr (High)", sortable: true, render: (v) => v.toLocaleString() },
  { key: "riskLevel", label: "Risk", sortable: true, render: (v) => <RiskBadge level={v} /> },
  { key: "notes", label: "Notes", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
];

const TRAINING_COLS = [
  { key: "monster", label: "Monster / Location", sortable: true },
  { key: "monsterCB", label: "Monster CB", sortable: false },
  { key: "recCB", label: "Rec. Player CB", sortable: false },
  { key: "wildyLevel", label: "Wildy Level", sortable: false },
  { key: "combatStyle", label: "Monster Style", sortable: true },
  { key: "xpKill", label: "XP / Kill", sortable: false },
  { key: "multiCombat", label: "Multi?", sortable: false, render: (v) => v ? <span className="text-yellow-400 text-xs font-semibold">Multi</span> : <span className="text-stone-500 text-xs">Single</span> },
  { key: "riskLevel", label: "Risk", sortable: true, render: (v) => <RiskBadge level={v} /> },
  { key: "ironDrops", label: "Key Ironman Drops", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
  { key: "notes", label: "Notes", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
];

const BOSSES_COLS = [
  { key: "boss", label: "Boss", sortable: true },
  { key: "variant", label: "Type / Variant", sortable: false, className: "text-xs text-stone-400" },
  { key: "wildyLevel", label: "Wildy Level", sortable: false },
  { key: "combatLevel", label: "Combat", sortable: true },
  { key: "combatType", label: "Combat Zone", sortable: true },
  { key: "strategy", label: "Strategy", sortable: false, className: "text-xs" },
  { key: "keyDrops", label: "Key Drops (Ironman Priority)", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
  { key: "diaryReq", label: "Diary Req.", sortable: false, className: "text-xs" },
  { key: "notes", label: "Notes", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
];

const SPAWNS_COLS = [
  { key: "item", label: "Item", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "wildyLevel", label: "Wildy Level", sortable: false },
  { key: "respawn", label: "Respawn Time", sortable: false },
  { key: "notes", label: "Notes", sortable: false, className: "max-w-xs text-stone-400 text-xs" },
];

const SLAYER_COLS = [
  { key: "monster", label: "Monster", sortable: true },
  { key: "amount", label: "Task Amount", sortable: false },
  { key: "combatLevel", label: "Combat Level", sortable: false },
  { key: "slayerXp", label: "Slayer XP/kill", sortable: false },
  { key: "wildyLevel", label: "Wildy Level", sortable: false },
  { key: "location", label: "Location", sortable: false, className: "text-xs text-stone-400 max-w-xs" },
  { key: "weight", label: "Task Weight", sortable: true },
  { key: "slayerReq", label: "Requirements", sortable: false, className: "text-xs text-stone-400" },
];

const QUEST_TYPE_COLS = [
  { key: "name", label: "Quest / Miniquest", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "wildyInvolvement", label: "Wilderness Involvement", sortable: false, className: "text-xs text-stone-400 max-w-xs" },
  { key: "reward", label: "Reward", sortable: false, className: "text-xs max-w-xs" },
  { key: "notes", label: "Notes", sortable: false, className: "text-xs text-stone-400 max-w-xs" },
];

const DIARY_COLS = [
  { key: "tier", label: "Tier", sortable: true, render: (v) => <TierBadge tier={v} /> },
  { key: "task", label: "Task", sortable: false },
  { key: "reward", label: "Reward Unlock", sortable: false, className: "text-xs text-stone-400 max-w-xs" },
  { key: "notes", label: "Notes", sortable: false, className: "text-xs text-stone-400 max-w-xs" },
];

// ─── Main Component ───────────────────────────────────────────

function OSRSWildernessHelper() {
  const [activeTab, setActiveTab] = useState("skilling");
  const [diarySubtab, setDiarySubtab] = useState("quests");

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-red-950/30 to-stone-950 text-stone-200">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-red-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl mb-3 select-none">☠️</div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-red-400 via-orange-300 to-red-400 text-transparent bg-clip-text">
                Old School Runescape
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-300 mb-4">
              Wilderness Helper
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mx-auto">
              All data sourced directly from the{" "}
              <a
                href="https://oldschool.runescape.wiki/w/Wilderness"
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
              >
                Old School RuneScape Wiki
              </a>
              . XP/hr ranges reflect low (distracted/low level) to high (focused/high level).
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-sm border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2">
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-red-300 bg-red-950/50 border border-red-800/60"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/40"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="wildy-tab-indicator"
                    className="absolute inset-0 rounded-lg border-2 border-red-600/60"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Skilling ── */}
            {activeTab === "skilling" && (
              <section>
                <SectionHeader
                  icon="⛏️"
                  title="Skilling Methods"
                  subtitle="Non-combat training activities within the Wilderness. Sort by XP/hr or filter by skill."
                />
                <WildernessTable
                  columns={SKILLING_COLS}
                  data={SKILLING_DATA}
                  searchKeys={["activity", "skill", "wildyLevel", "notes"]}
                />
              </section>
            )}

            {/* ── Training ── */}
            {activeTab === "training" && (
              <section>
                <SectionHeader
                  icon="⚔️"
                  title="Training Methods"
                  subtitle="All Wilderness combat training locations from level 1 onward. Sorted roughly low-to-high by recommended player combat level. Filter by monster name, location, or drops."
                />
                <WildernessTable
                  columns={TRAINING_COLS}
                  data={TRAINING_DATA}
                  searchKeys={["monster", "combatStyle", "wildyLevel", "ironDrops", "notes", "recCB"]}
                />
              </section>
            )}

            {/* ── Bosses ── */}
            {activeTab === "bosses" && (
              <section>
                <SectionHeader
                  icon="💀"
                  title="Bosses"
                  subtitle="All Wilderness bosses with ironman-relevant drop priorities, strategy notes, and diary requirements. Drop rates sourced from the OSRS Wiki."
                />
                <WildernessTable
                  columns={BOSSES_COLS}
                  data={BOSSES_DATA}
                  searchKeys={["boss", "variant", "wildyLevel", "keyDrops", "diaryReq", "notes", "strategy"]}
                />
              </section>
            )}

            {/* ── Item Spawns ── */}
            {activeTab === "spawns" && (
              <section>
                <SectionHeader
                  icon="📦"
                  title="Item Spawns"
                  subtitle="Ground spawns, always-drops, and reward items confirmed via the OSRS Wiki."
                />
                <WildernessTable
                  columns={SPAWNS_COLS}
                  data={ITEM_SPAWNS_DATA}
                  searchKeys={["item", "location", "wildyLevel", "notes"]}
                />
              </section>
            )}

            {/* ── Slayer ── */}
            {activeTab === "slayer" && (
              <section>
                <SectionHeader
                  icon="🗡️"
                  title="Slayer — Krystilia Tasks"
                  subtitle="All monsters assignable by Krystilia (Edgeville jail). Higher task weight = more frequently assigned. Points: 25/task, 125 every 10th, 375 every 50th, 625 every 100th, 875 every 250th, 1,250 every 1,000th."
                />
                <WildernessTable
                  columns={SLAYER_COLS}
                  data={SLAYER_DATA}
                  searchKeys={["monster", "location", "wildyLevel", "slayerReq"]}
                />
              </section>
            )}

            {/* ── Quests & Diaries ── */}
            {activeTab === "diaries" && (
              <section>
                <SectionHeader
                  icon="📜"
                  title="Quests & Wilderness Diary"
                  subtitle="Quests with significant Wilderness involvement and all Wilderness Achievement Diary tasks."
                />
                {/* Sub-tabs */}
                <div className="flex gap-2 mb-6">
                  {["quests", "diary"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setDiarySubtab(sub)}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        diarySubtab === sub
                          ? "bg-red-900/40 border-red-700 text-red-300"
                          : "bg-stone-900/40 border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500"
                      }`}
                    >
                      {sub === "quests" ? "📜 Quests & Miniquests" : "🏆 Wilderness Diary"}
                    </button>
                  ))}
                </div>
                {diarySubtab === "quests" ? (
                  <WildernessTable
                    columns={QUEST_TYPE_COLS}
                    data={QUESTS_DATA}
                    searchKeys={["name", "type", "wildyInvolvement", "reward", "notes"]}
                  />
                ) : (
                  <WildernessTable
                    columns={DIARY_COLS}
                    data={DIARY_DATA}
                    searchKeys={["tier", "task", "reward", "notes"]}
                  />
                )}
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-800/40 mt-8 py-6 text-center text-xs text-stone-600">
        Data verified against the{" "}
        <a
          href="https://oldschool.runescape.wiki/w/Wilderness"
          target="_blank"
          rel="noreferrer"
          className="text-stone-500 hover:text-stone-300 underline underline-offset-2 transition-colors"
        >
          Old School RuneScape Wiki
        </a>
        . Old School RuneScape is a trademark of Jagex Ltd.
      </footer>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-stone-100 flex items-center gap-2 mb-1">
        <span>{icon}</span>
        {title}
      </h2>
      {subtitle && <p className="text-stone-400 text-sm">{subtitle}</p>}
    </div>
  );
}

export default OSRSWildernessHelper;