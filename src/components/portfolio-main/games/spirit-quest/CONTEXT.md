# Spirit Quest: Spirit Sword — Project Context

> **Last updated:** February 17, 2026
> **Purpose:** Living context document for AI assistants. Feed this into new conversations to skip the ramp-up.

---

## What Is This?

**Spirit Quest: Spirit Sword** is a turn-based RPG built entirely in React (JSX + Tailwind CSS + Framer Motion). It lives inside a larger portfolio site at `src/components/portfolio-main/games/spirit-quest/`. The game has no backend — all state is persisted to `localStorage`.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React (Create React App) |
| Styling | Tailwind CSS (utility classes in JSX) |
| Animation | Framer Motion |
| State | React hooks (`useState`, `useCallback`) + custom `usePersistence` hook (localStorage) |
| Routing | No router — phase-based state machine in `index.jsx` |
| Audio | Custom `useMusic` hook with HTML5 Audio API |
| Build | `react-scripts` (CRA) |
| Deployment | Static build to `build/` |

---

## Architecture Overview

### Phase State Machine (`index.jsx`)

The entire game flow is driven by a `phase` string stored in the save state:

```
menu → pathSelect → hub → zoneSelect → battle → result → hub
                     ↕
              inventory | skills (sub-screens via subScreen state)
```

The `Wrapper` component provides the dark background + centered container. All screens are swapped via `<AnimatePresence mode="wait">`.

### File Structure

```
spirit-quest/
├── index.jsx                 # Main entry — phase router, Wrapper, all game logic
├── constants.js              # PATHS, ZONES, BATTLE_MODIFIERS, RARITIES, STATUS_EFFECTS, ELEMENT_COLORS
├── data/
│   ├── enemies.js            # Enemy definitions, pickRandomEnemy, createEnemyInstance
│   └── skills.js             # Skill trees per path, getSkillTree, getSkillById
├── state/
│   ├── playerState.js        # createPlayer, applyPath, gainXp, createCombatPlayer, equip/unequip, inventory helpers, getEffectiveStats
│   └── lootEngine.js         # rollLoot, rollCurrencyRewards
├── hooks/
│   ├── usePersistence.js     # localStorage save/load with hasSave, clearSave
│   ├── useBattleTurn.js      # Turn-based combat engine (actions, AI, status effects, cooldowns)
│   └── useMusic.js           # Background music with autoplay unlock, crossfade, volume persistence
├── components/
│   ├── MenuScreen.jsx        # Title screen — New Game / Continue / Clear Save
│   ├── PathSelectScreen.jsx  # Choose Spirit Brawler / Sorcerer / Armor
│   ├── HubScreen.jsx         # Central hub — stats, XP, currency, nav buttons
│   ├── ZoneSelectScreen.jsx  # Pick battle zone + difficulty modifier
│   ├── BattleScreen.jsx      # Full combat UI — sprites, HP/SE bars, log, actions
│   ├── ResultScreen.jsx      # Victory/Defeat — XP, loot reveal, level-up
│   ├── InventoryPanel.jsx    # Equipment slots + inventory management
│   ├── SkillTreePanel.jsx    # View/equip skills (max 4 active)
│   ├── ActionBar.jsx         # Combat buttons (skills + attack/guard)
│   ├── BattleLog.jsx         # Scrollable combat log
│   ├── HpBar.jsx             # HpBar, SpiritBar, XpBar components
│   ├── CharacterSprite.jsx   # Animated player/enemy sprites with auras, status icons
│   └── MusicControls.jsx     # Floating jukebox pill (volume + mute)
```

### Key Design Decisions

1. **No router** — The game is a single component (`SpiritQuest`) that switches views based on `phase`. This keeps it self-contained within the portfolio.

2. **Persistence** — `usePersistence` wraps `useState` with auto-save to localStorage on every change. The save object holds `{ player, phase }`.

3. **Combat system** — `useBattleTurn` is a custom hook that manages turn order, damage calculations, status effects (burn, poison, stun, etc.), cooldowns, and AI behavior. It returns `{ player, enemy, log, turnLock, animState, actions }`.

4. **3 paths** — Spirit Brawler (physical/fire), Spirit Sorcerer (magic/ice+lightning), Spirit Armor (tank/earth). Each has unique skill trees, stat distributions, and playstyles.

5. **Loot system** — Items have rarity tiers (Common → Legendary), stats, and equipment slots (weapon, armor, accessory). `rollLoot` uses weighted RNG.

6. **Responsive design** — All components use Tailwind breakpoints (`md`, `lg`, `xl`, `2xl`) to scale from mobile phones to 2160px+ monitors. The wrapper scales from `max-w-xl` to `max-w-5xl`.

---

## Music System (useMusic)

This was the hardest feature to get right. Browser autoplay policies block `audio.play()` until a user gesture occurs.

### How It Works

1. **On mount:** Create an `Audio` element, set `loop=true`, `muted=true` (bypass autoplay)
2. **Load track:** Set `src` to `/games/spirit-quest/music/{trackName}.mp3`, call `.load()`
3. **On first user gesture** (click/touch/key via document listeners): Unmute, reload current track, call `.play()`
4. **Track switching:** Fade out current (240ms) → swap src → fade in new (320ms)
5. **Volume/mute:** Persisted to localStorage (`sq-vol`, `sq-mute`). Respected on unlock.

### Music Files

Located in `public/games/spirit-quest/music/`:
- `main_theme.mp3` — Menu, hub, path select, zone select, result screens
- `during_battle.mp3` — Combat encounters
- `during_dialogue.mp3` — Available but not currently wired up

### MusicControls UI

- **Collapsed:** Small pill button (bottom-right) — `♫ 40%` or `🔇 Muted`
- **Expanded:** Panel with volume slider + mute toggle, closes on outside tap
- **Mobile-friendly:** All tap targets 44px+, no hover-dependent behavior

---

## Responsive Scaling

Breakpoints used throughout:

| Breakpoint | Width | Target |
|---|---|---|
| default | 0px+ | Small phones |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops |
| `xl` | 1280px+ | Desktops |
| `2xl` | 1536px+ | Large/4K monitors |

**What scales:** Text sizes, padding, gaps, icon sizes, sprite dimensions, bar heights, container widths, scrollable area heights.

---

## Player State Shape

```js
{
  name: "Spirit Channeler",
  path: "brawler" | "sorcerer" | "armor",
  level: 1,
  xp: 0,
  xpToNext: 100,
  ascension: 0,
  gold: 0,
  spiritShards: 0,
  battlesWon: 0,
  baseStats: { maxHp, maxSe, atk, def, spd, focus },
  equipment: { weapon: null, armor: null, accessory: null },
  inventory: [],
  unlockedSkills: [...],
  activeSkills: [/* up to 4 skill IDs */],
}
```

---

## Combat State Shape

```js
// createCombatPlayer returns:
{
  hp, maxHp, se, maxSe, atk, def, spd, focus,
  statusEffects: [],
  cooldowns: {},
  isGuarding: false,
}

// Enemy instance:
{
  name, icon, element, isBoss,
  hp, maxHp, se, maxSe, atk, def, spd, focus,
  skills: [...],
  statusEffects: [],
}
```

---

## Known Quirks & Gotchas

1. **`phase` must be declared before `useMusic`** — The music hook reads `phase` to pick the track. If you add code between save state and the music hook, watch the ordering.

2. **Music won't play without files** — The hook silently fails if MP3s are missing. No error UI shown (by design — keeps it clean).

3. **`useBattleTurn` is complex** — It handles turn order, multi-hit attacks, status tick/expire, cooldown decrement, AI skill selection, and animation states. Tread carefully when modifying.

4. **Tailwind classes must be complete strings** — Don't try to dynamically construct class names (e.g., `text-${size}`). Tailwind purges anything it can't statically analyze.

5. **`usePersistence` saves on every state change** — This means any `setSave()` call immediately writes to localStorage. No debouncing.

6. **CRA limitations** — No custom webpack config without ejecting. Public folder files are served as-is at the root URL.

---

## Development History (Condensed)

1. **Initial build** — Full game engine: menu, path selection, hub, zones, combat, results, inventory, skills — all in one session.
2. **Music system v1** — Created `useMusic` + `MusicControls`. Had hover-based UI (bad for mobile), broke due to `phase` used before declaration.
3. **Music system v2** — Fixed variable ordering. Added error/interaction states. UI still hover-dependent.
4. **Music system v3** — Full rewrite. Click-to-expand panel. Browser autoplay handled via muted-then-unlock strategy. Still had issues with initial track not playing.
5. **Music system v4 (current)** — Simplified to ~170 lines. Uses document-level gesture listeners. Reloads track fresh on first interaction. `isPlaying` driven by native audio events.
6. **Responsive scaling** — Scaled all 12+ components across 5 breakpoints. Wrapper grows from 576px to 1024px max-width.

---

## How to Run

```bash
cd coding-with-tom
npm start
# Navigate to: http://localhost:3000/games/spirit-quest
# (or wherever CodingWithTom routes to it)
```

## How to Build

```bash
npm run build
# Output in build/ — static files, deploy anywhere
```

---

## What's Next (Potential)

- Wire up `during_dialogue.mp3` for path select / result screens
- Add more zones, enemies, items
- Boss encounters with special mechanics
- Ascension system (prestige)
- Save export/import
- Sound effects (separate from music)
- Achievements system
- Mobile PWA support
