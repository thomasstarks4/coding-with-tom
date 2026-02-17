import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// Spirit Quest: Spirit Sword — Turn-Based RPG
// A single-file React component with Tailwind + Framer Motion.
// Dark theme inspired by Yu Yu Hakusho.
//
// Architecture notes (for future expansion):
//   • ENEMY_TEMPLATES — add entries here for new enemy types.
//   • DIFFICULTY_SETTINGS — tweak multipliers per difficulty.
//   • Player / enemy state is plain objects; easy to extend
//     with inventory, XP, equipment, status effects, etc.
// ============================================================

// ─── Difficulty presets ─────────────────────────────────────
const DIFFICULTY_SETTINGS = {
  easy: { label: "Easy", enemyAtkMul: 0.7, enemyHpMul: 0.8 },
  normal: { label: "Normal", enemyAtkMul: 1.0, enemyHpMul: 1.0 },
  hard: { label: "Hard", enemyAtkMul: 1.4, enemyHpMul: 1.3 },
};

// ─── Enemy templates (extend this array for more enemies) ───
const ENEMY_TEMPLATES = [
  { name: "Shadow Demon", baseHp: 100, baseAtk: 12, spirit: "🔥" },
  { name: "Dark Apparition", baseHp: 120, baseAtk: 10, spirit: "👻" },
  { name: "Toguro (C-Class)", baseHp: 140, baseAtk: 14, spirit: "💀" },
];

// ─── Constants ──────────────────────────────────────────────
const PLAYER_BASE_HP = 120;
const PLAYER_BASE_ATK = 15;
const HEAL_AMOUNT = 25;
const SPECIAL_COST = 20; // spirit energy cost
const SPECIAL_MULTIPLIER = 2.2;
const DEFEND_REDUCTION = 0.5; // damage multiplied by this when defending

// ─── Helper: random int in range [min, max] ────────────────
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Helper: pick random element from an array ──────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Helper: clamp value between min and max ────────────────
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ─── Helper: create initial player state ────────────────────
const createPlayer = () => ({
  name: "Spirit Detective",
  hp: PLAYER_BASE_HP,
  maxHp: PLAYER_BASE_HP,
  atk: PLAYER_BASE_ATK,
  spirit: 100, // spirit energy for specials
  maxSpirit: 100,
  isDefending: false,
  // Future: inventory: [], xp: 0, level: 1
});

// ─── Helper: create enemy state from template + difficulty ──
const createEnemy = (difficulty) => {
  const template = pick(ENEMY_TEMPLATES);
  const diff = DIFFICULTY_SETTINGS[difficulty];
  const hp = Math.round(template.baseHp * diff.enemyHpMul);
  return {
    name: template.name,
    hp,
    maxHp: hp,
    atk: Math.round(template.baseAtk * diff.enemyAtkMul),
    spirit: template.spirit,
  };
};

// ─── HP Bar sub-component ───────────────────────────────────
const HpBar = ({ current, max, color }) => {
  const pct = clamp((current / max) * 100, 0, 100);
  return (
    <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
      <motion.div
        className={`h-full ${color}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  );
};

// ─── Spirit Energy Bar ──────────────────────────────────────
const SpiritBar = ({ current, max }) => {
  const pct = clamp((current / max) * 100, 0, 100);
  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-indigo-900 mt-1">
      <motion.div
        className="h-full bg-indigo-500"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  );
};

// ─── Battle Log entry animation wrapper ─────────────────────
const LogEntry = ({ text, type }) => {
  const colors = {
    player: "text-cyan-300",
    enemy: "text-red-400",
    system: "text-yellow-300",
    heal: "text-green-400",
    special: "text-fuchsia-400",
  };
  return (
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-sm leading-relaxed ${colors[type] || "text-gray-300"}`}
    >
      {text}
    </motion.p>
  );
};

// ═══════════════════════════════════════════════════════════
// Main Game Component
// ═══════════════════════════════════════════════════════════
export default function RPG1() {
  // ── Game phase: "menu" | "battle" | "victory" | "defeat" ─
  const [phase, setPhase] = useState("menu");

  // ── Difficulty selection ──────────────────────────────────
  const [difficulty, setDifficulty] = useState("normal");

  // ── Player & enemy state objects ──────────────────────────
  const [player, setPlayer] = useState(createPlayer);
  const [enemy, setEnemy] = useState(() => createEnemy("normal"));

  // ── Battle log: array of { id, text, type } ──────────────
  const [log, setLog] = useState([]);
  const logEndRef = useRef(null);

  // ── Turn lock prevents spamming while enemy responds ─────
  const [turnLock, setTurnLock] = useState(false);

  // ── Auto-scroll log to bottom on update ───────────────────
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  // ── Append a message to the battle log ────────────────────
  const addLog = (text, type = "system") =>
    setLog((prev) => [...prev, { id: Date.now() + Math.random(), text, type }]);

  // ────────────────────────────────────────────────────────
  // TURN FLOW
  // 1. Player picks an action → resolve immediately.
  // 2. If enemy alive → enemy acts after a short delay.
  // 3. Check win / lose conditions after each side acts.
  // ────────────────────────────────────────────────────────

  // ── Resolve enemy turn ────────────────────────────────────
  const enemyTurn = (currentPlayer, currentEnemy) => {
    // Enemy picks a random action weighted toward attacking.
    const roll = Math.random();
    let dmg = 0;
    let newPlayer = { ...currentPlayer, isDefending: false }; // reset defend flag

    if (roll < 0.65) {
      // 65 % chance: enemy attacks
      dmg = randInt(
        Math.round(currentEnemy.atk * 0.8),
        Math.round(currentEnemy.atk * 1.2)
      );
      if (currentPlayer.isDefending) {
        dmg = Math.round(dmg * DEFEND_REDUCTION);
        addLog(
          `${currentEnemy.spirit} ${currentEnemy.name} strikes! You brace and take only ${dmg} damage.`,
          "enemy"
        );
      } else {
        addLog(
          `${currentEnemy.spirit} ${currentEnemy.name} attacks for ${dmg} damage!`,
          "enemy"
        );
      }
      newPlayer.hp = clamp(newPlayer.hp - dmg, 0, newPlayer.maxHp);
    } else if (roll < 0.85) {
      // 20 % chance: enemy defends (no effect on this simple model)
      addLog(
        `${currentEnemy.spirit} ${currentEnemy.name} takes a defensive stance...`,
        "enemy"
      );
    } else {
      // 15 % chance: enemy heals
      const heal = randInt(8, 16);
      const newEnemyHp = clamp(currentEnemy.hp + heal, 0, currentEnemy.maxHp);
      addLog(
        `${currentEnemy.spirit} ${currentEnemy.name} regenerates ${heal} HP!`,
        "enemy"
      );
      setEnemy((prev) => ({ ...prev, hp: newEnemyHp }));
    }

    setPlayer(newPlayer);

    // ── Check defeat ─────────────────────────────────────
    if (newPlayer.hp <= 0) {
      addLog("You have been defeated... Your spirit fades.", "system");
      setPhase("defeat");
    }
  };

  // ── Schedule enemy turn with a short delay ────────────────
  const scheduleEnemyTurn = (currentPlayer, currentEnemy) => {
    setTurnLock(true);
    setTimeout(() => {
      enemyTurn(currentPlayer, currentEnemy);
      setTurnLock(false);
    }, 700);
  };

  // ────────────────────────────────────────────────────────
  // PLAYER ACTIONS
  // Each function mutates state, logs the result, and
  // triggers the enemy's counter-action.
  // ────────────────────────────────────────────────────────

  const handleAttack = () => {
    if (turnLock) return;
    const dmg = randInt(
      Math.round(player.atk * 0.8),
      Math.round(player.atk * 1.3)
    );
    const newEnemyHp = clamp(enemy.hp - dmg, 0, enemy.maxHp);
    addLog(`⚔️ You slash with your Spirit Sword for ${dmg} damage!`, "player");
    setEnemy((prev) => ({ ...prev, hp: newEnemyHp }));

    if (newEnemyHp <= 0) {
      addLog(`🏆 ${enemy.name} is vanquished! Victory is yours!`, "system");
      setPhase("victory");
      return;
    }
    scheduleEnemyTurn(player, { ...enemy, hp: newEnemyHp });
  };

  const handleDefend = () => {
    if (turnLock) return;
    const defendingPlayer = { ...player, isDefending: true };
    setPlayer(defendingPlayer);
    addLog("🛡️ You raise your guard, bracing for impact.", "player");
    // Regain a small amount of spirit while defending
    const spiritGain = 10;
    setPlayer((prev) => ({
      ...prev,
      isDefending: true,
      spirit: clamp(prev.spirit + spiritGain, 0, prev.maxSpirit),
    }));
    addLog(`✨ +${spiritGain} Spirit Energy recovered.`, "heal");
    scheduleEnemyTurn(defendingPlayer, enemy);
  };

  const handleHeal = () => {
    if (turnLock) return;
    const restored = Math.min(HEAL_AMOUNT, player.maxHp - player.hp);
    const newHp = player.hp + restored;
    const newPlayer = { ...player, hp: newHp };
    setPlayer(newPlayer);
    addLog(`💚 You channel spirit energy and restore ${restored} HP!`, "heal");
    scheduleEnemyTurn(newPlayer, enemy);
  };

  const handleSpecial = () => {
    if (turnLock) return;
    if (player.spirit < SPECIAL_COST) {
      addLog("❌ Not enough Spirit Energy for a special attack!", "system");
      return;
    }
    const dmg = Math.round(
      randInt(
        Math.round(player.atk * SPECIAL_MULTIPLIER * 0.9),
        Math.round(player.atk * SPECIAL_MULTIPLIER * 1.3)
      )
    );
    const newSpirit = player.spirit - SPECIAL_COST;
    const newEnemyHp = clamp(enemy.hp - dmg, 0, enemy.maxHp);
    const newPlayer = { ...player, spirit: newSpirit };

    addLog(
      `🔥 SPIRIT GUN! A massive blast deals ${dmg} damage!`,
      "special"
    );
    setPlayer(newPlayer);
    setEnemy((prev) => ({ ...prev, hp: newEnemyHp }));

    if (newEnemyHp <= 0) {
      addLog(`🏆 ${enemy.name} is obliterated! Flawless victory!`, "system");
      setPhase("victory");
      return;
    }
    scheduleEnemyTurn(newPlayer, { ...enemy, hp: newEnemyHp });
  };

  // ────────────────────────────────────────────────────────
  // GAME RESET / START
  // ────────────────────────────────────────────────────────
  const startGame = (diff) => {
    setDifficulty(diff);
    setPlayer(createPlayer());
    setEnemy(createEnemy(diff));
    setLog([]);
    setTurnLock(false);
    setPhase("battle");
  };

  const returnToMenu = () => {
    setPhase("menu");
    setLog([]);
    setTurnLock(false);
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════

  // ── Background wrapper (dark, atmospheric) ────────────
  const Wrapper = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );

  // ═══════════════════  MENU SCREEN  ═══════════════════
  if (phase === "menu") {
    return (
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Title */}
          <div>
            <h1 className="text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-red-500 drop-shadow-lg">
              Spirit Quest
            </h1>
            <p className="text-lg text-fuchsia-300 mt-2 tracking-widest uppercase">
              Spirit Sword
            </p>
          </div>

          {/* Decorative spirit energy pulse */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl"
          >
            ⚔️
          </motion.div>

          {/* Difficulty selector */}
          <div className="space-y-3">
            <p className="text-gray-400 uppercase text-xs tracking-widest">
              Select Difficulty
            </p>
            <div className="flex justify-center gap-3">
              {Object.entries(DIFFICULTY_SETTINGS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className={`px-5 py-2 rounded-lg font-bold uppercase tracking-wide text-sm transition-all duration-200 border
                    ${
                      key === "easy"
                        ? "border-green-500 text-green-400 hover:bg-green-500/20"
                        : key === "normal"
                        ? "border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
                        : "border-red-500 text-red-400 hover:bg-red-500/20"
                    }
                  `}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-6">
            React Turn-Based RPG • TailwindCSS • Framer Motion
          </p>
        </motion.div>
      </Wrapper>
    );
  }

  // ═══════════════  VICTORY / DEFEAT SCREEN  ═══════════
  if (phase === "victory" || phase === "defeat") {
    const won = phase === "victory";
    return (
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: won ? [0, 10, -10, 0] : [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-7xl"
          >
            {won ? "🏆" : "💀"}
          </motion.div>

          <h2
            className={`text-4xl font-extrabold ${
              won ? "text-yellow-300" : "text-red-500"
            }`}
          >
            {won ? "VICTORY" : "DEFEAT"}
          </h2>
          <p className="text-gray-400">
            {won
              ? `You defeated ${enemy.name} on ${DIFFICULTY_SETTINGS[difficulty].label} mode!`
              : `${enemy.name} has bested you... Train harder, detective.`}
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => startGame(difficulty)}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors"
            >
              Rematch
            </button>
            <button
              onClick={returnToMenu}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  // ═══════════════════  BATTLE SCREEN  ═════════════════
  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Spirit Quest: Spirit Sword
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {DIFFICULTY_SETTINGS[difficulty].label} Mode
          </p>
        </div>

        {/* ── Status Panels ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Player panel */}
          <div className="bg-gray-800/60 border border-cyan-900 rounded-xl p-3 space-y-1">
            <p className="text-cyan-300 font-bold text-sm">
              🗡️ {player.name}
            </p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>HP</span>
              <span>
                {player.hp} / {player.maxHp}
              </span>
            </div>
            <HpBar
              current={player.hp}
              max={player.maxHp}
              color="bg-gradient-to-r from-green-500 to-emerald-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Spirit</span>
              <span>
                {player.spirit} / {player.maxSpirit}
              </span>
            </div>
            <SpiritBar current={player.spirit} max={player.maxSpirit} />
          </div>

          {/* Enemy panel */}
          <div className="bg-gray-800/60 border border-red-900 rounded-xl p-3 space-y-1">
            <p className="text-red-400 font-bold text-sm">
              {enemy.spirit} {enemy.name}
            </p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>HP</span>
              <span>
                {enemy.hp} / {enemy.maxHp}
              </span>
            </div>
            <HpBar
              current={enemy.hp}
              max={enemy.maxHp}
              color="bg-gradient-to-r from-red-600 to-orange-500"
            />
          </div>
        </div>

        {/* ── Battle Log ──────────────────────────────── */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-3 h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
          <AnimatePresence>
            {log.length === 0 && (
              <p className="text-gray-600 text-sm italic">
                The battle begins... Choose your action.
              </p>
            )}
            {log.map((entry) => (
              <LogEntry key={entry.id} text={entry.text} type={entry.type} />
            ))}
          </AnimatePresence>
          <div ref={logEndRef} />
        </div>

        {/* ── Action Buttons ──────────────────────────── */}
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label="⚔️ Attack"
            onClick={handleAttack}
            disabled={turnLock}
            color="from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500"
          />
          <ActionButton
            label="🛡️ Defend"
            onClick={handleDefend}
            disabled={turnLock}
            color="from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
          />
          <ActionButton
            label="💚 Heal"
            onClick={handleHeal}
            disabled={turnLock}
            color="from-green-800 to-green-700 hover:from-green-700 hover:to-green-600"
          />
          <ActionButton
            label={`🔥 Special (${SPECIAL_COST} SP)`}
            onClick={handleSpecial}
            disabled={turnLock || player.spirit < SPECIAL_COST}
            color="from-fuchsia-800 to-fuchsia-700 hover:from-fuchsia-700 hover:to-fuchsia-600"
          />
        </div>

        {/* Turn lock indicator */}
        <AnimatePresence>
          {turnLock && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-gray-500 animate-pulse"
            >
              Enemy is responding...
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </Wrapper>
  );
}

// ─── Reusable action button ─────────────────────────────────
function ActionButton({ label, onClick, disabled, color }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-3 rounded-xl font-bold text-sm tracking-wide
        bg-gradient-to-r ${color}
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        border border-gray-700
      `}
    >
      {label}
    </motion.button>
  );
}
