import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import forestLofi from "./music/Forest-Lofi.MP3";
import groundTile from "./assets/FREE_Fantasy Forest/Tiles/Tileset Outside.png";
import treeSprites from "./assets/FREE_Fantasy Forest/Tiles/Trees.png";
import samuraiAttack from "./assets/FREE_Samurai 2D Pixel Art v1.2/Sprites/ATTACK 1.png";
import samuraiHurt from "./assets/FREE_Samurai 2D Pixel Art v1.2/Sprites/HURT.png";
import samuraiIdle from "./assets/FREE_Samurai 2D Pixel Art v1.2/Sprites/IDLE.png";
import samuraiRun from "./assets/FREE_Samurai 2D Pixel Art v1.2/Sprites/RUN.png";
import "./forest-platformer.css";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
const WORLD_WIDTH = 3600;
const WORLD_FLOOR = 468;
const MAX_LIVES = 3;

const MOVE_SPEED = 340;
const JUMP_SPEED = 760;
const GRAVITY = 1900;
const STOMP_BOUNCE = 460;
const PLAYER_SPRITE_Y_OFFSET = -4;

const PLAYER_SIZE = { w: 46, h: 72 };

const LEVELS = [
  {
    id: 1,
    name: "Forest Path",
    start: { x: 60, y: WORLD_FLOOR - PLAYER_SIZE.h },
    goal: { x: WORLD_WIDTH - 180, y: 228, w: 70, h: 140 },
    platforms: [
      { x: -100, y: WORLD_FLOOR, w: 900, h: 90, kind: "ground" },
      { x: 890, y: WORLD_FLOOR, w: 740, h: 90, kind: "ground" },
      { x: 1750, y: WORLD_FLOOR, w: 670, h: 90, kind: "ground" },
      { x: 2550, y: WORLD_FLOOR, w: 1200, h: 90, kind: "ground" },
      { x: 540, y: 390, w: 180, h: 24, kind: "ledge" },
      { x: 860, y: 348, w: 160, h: 24, kind: "ledge" },
      { x: 1240, y: 368, w: 180, h: 24, kind: "ledge" },
      { x: 1570, y: 310, w: 210, h: 24, kind: "ledge" },
      { x: 2080, y: 350, w: 160, h: 24, kind: "ledge" },
      { x: 2320, y: 300, w: 180, h: 24, kind: "ledge" },
      { x: 2860, y: 350, w: 180, h: 24, kind: "ledge" },
      { x: 3130, y: 295, w: 180, h: 24, kind: "ledge" },
    ],
    movingPlatforms: [],
    hazards: [],
    enemies: [],
    coins: [
      { x: 610, y: 338 },
      { x: 940, y: 296 },
      { x: 1320, y: 318 },
      { x: 1650, y: 260 },
      { x: 2160, y: 300 },
      { x: 2400, y: 250 },
      { x: 2940, y: 300 },
      { x: 3210, y: 245 },
    ],
    decorations: [
      { x: 150, y: 372, variant: 0, flip: false },
      { x: 390, y: 372, variant: 1, flip: true },
      { x: 1030, y: 372, variant: 0, flip: false },
      { x: 1910, y: 372, variant: 1, flip: false },
      { x: 2740, y: 372, variant: 0, flip: true },
      { x: 3430, y: 372, variant: 1, flip: false },
    ],
  },
  {
    id: 2,
    name: "Dark Canopy",
    start: { x: 80, y: WORLD_FLOOR - PLAYER_SIZE.h },
    goal: { x: WORLD_WIDTH - 200, y: 218, w: 70, h: 140 },
    platforms: [
      { x: -100, y: WORLD_FLOOR, w: 620, h: 90, kind: "ground" },
      { x: 830, y: WORLD_FLOOR, w: 470, h: 90, kind: "ground" },
      { x: 1670, y: WORLD_FLOOR, w: 360, h: 90, kind: "ground" },
      { x: 2460, y: WORLD_FLOOR, w: 400, h: 90, kind: "ground" },
      { x: 3230, y: WORLD_FLOOR, w: 620, h: 90, kind: "ground" },
      { x: 420, y: 382, w: 130, h: 24, kind: "ledge" },
      { x: 680, y: 332, w: 120, h: 24, kind: "ledge" },
      { x: 1010, y: 302, w: 110, h: 24, kind: "ledge" },
      { x: 1390, y: 342, w: 120, h: 24, kind: "ledge" },
      { x: 1860, y: 286, w: 120, h: 24, kind: "ledge" },
      { x: 2200, y: 328, w: 120, h: 24, kind: "ledge" },
      { x: 2680, y: 298, w: 120, h: 24, kind: "ledge" },
      { x: 2990, y: 258, w: 130, h: 24, kind: "ledge" },
    ],
    movingPlatforms: [
      { id: "m1", x: 560, y: 292, w: 130, h: 20, axis: "y", range: 78, speed: 1.8, phase: 0.4 },
      { id: "m2", x: 1200, y: 282, w: 140, h: 20, axis: "x", range: 165, speed: 1.55, phase: 1.1 },
      { id: "m3", x: 1580, y: 262, w: 130, h: 20, axis: "y", range: 85, speed: 1.75, phase: 2.0 },
      { id: "m4", x: 2320, y: 278, w: 140, h: 20, axis: "x", range: 150, speed: 1.65, phase: 0.6 },
      { id: "m5", x: 2850, y: 248, w: 140, h: 20, axis: "y", range: 76, speed: 1.9, phase: 1.9 },
    ],
    hazards: [
      { x: 520, y: WORLD_FLOOR - 16, w: 310, h: 16 },
      { x: 1300, y: WORLD_FLOOR - 16, w: 370, h: 16 },
      { x: 2030, y: WORLD_FLOOR - 16, w: 430, h: 16 },
      { x: 2860, y: WORLD_FLOOR - 16, w: 370, h: 16 },
    ],
    enemies: [
      { id: "e1", x: 930, y: WORLD_FLOOR - 42, w: 44, h: 42, minX: 850, maxX: 1270, speed: 105, dir: 1 },
      { id: "e2", x: 2500, y: WORLD_FLOOR - 42, w: 44, h: 42, minX: 2470, maxX: 2820, speed: 120, dir: -1 },
      { id: "e3", x: 3010, y: 216, w: 44, h: 42, minX: 2930, maxX: 3125, speed: 95, dir: -1 },
    ],
    coins: [
      { x: 450, y: 334 },
      { x: 700, y: 284 },
      { x: 1040, y: 254 },
      { x: 1260, y: 232 },
      { x: 1620, y: 216 },
      { x: 1880, y: 238 },
      { x: 2240, y: 242 },
      { x: 2720, y: 252 },
      { x: 3010, y: 212 },
      { x: 3440, y: 230 },
    ],
    decorations: [
      { x: 190, y: 372, variant: 0, flip: false },
      { x: 1130, y: 372, variant: 1, flip: true },
      { x: 1710, y: 372, variant: 0, flip: false },
      { x: 2550, y: 372, variant: 1, flip: false },
      { x: 3270, y: 372, variant: 0, flip: true },
    ],
  },
];

function intersects(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createMovingPlatform(def, elapsed) {
  const offset = Math.sin(elapsed * def.speed + def.phase) * def.range;
  return {
    ...def,
    x: def.axis === "x" ? def.x + offset : def.x,
    y: def.axis === "y" ? def.y + offset : def.y,
    kind: "moving",
  };
}

function createPlayer(start) {
  return {
    x: start.x,
    y: start.y,
    w: PLAYER_SIZE.w,
    h: PLAYER_SIZE.h,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: 1,
  };
}

function createEnemyInstances(levelIndex) {
  return LEVELS[levelIndex].enemies.map((enemy) => ({ ...enemy, alive: true }));
}

const createInitialState = () => ({
  levelIndex: 0,
  player: {
    ...createPlayer(LEVELS[0].start),
  },
  coins: LEVELS[0].coins,
  movingPlatforms: LEVELS[0].movingPlatforms.map((platform) => createMovingPlatform(platform, 0)),
  enemies: createEnemyInstances(0),
  lives: MAX_LIVES,
  damageCooldown: 0,
  hurtTimer: 0,
  attackTimer: 0,
  cameraX: 0,
  phase: "playing",
  runStarted: false,
  elapsed: 0,
  levelElapsed: 0,
  score: 0,
});

export default function ForestPlatformer() {
  const keysRef = useRef({ left: false, right: false, jump: false });
  const rafRef = useRef(null);
  const audioRef = useRef(null);
  const musicStartedRef = useRef(false);
  const previousTimeRef = useRef(0);
  const stateRef = useRef(createInitialState());
  const [snapshot, setSnapshot] = useState(stateRef.current);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.35);
  const activeLevel = LEVELS[snapshot.levelIndex];

  const totalCoins = activeLevel.coins.length;
  const coinsCollected = totalCoins - snapshot.coins.length;

  useEffect(() => {
    musicStartedRef.current = musicStarted;
  }, [musicStarted]);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
    audio.loop = true;
    audio
      .play()
      .then(() => {
        setMusicStarted(true);
        setMusicPlaying(true);
      })
      .catch(() => {});
  }, [musicVolume]);

  const markRunStarted = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== "playing" || current.runStarted) return;
    const updated = { ...current, runStarted: true };
    stateRef.current = updated;
    setSnapshot(updated);
    if (!musicStartedRef.current) startMusic();
  }, [startMusic]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const gameState = stateRef.current;
      if (event.repeat && event.key.toLowerCase() !== "r") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = true;
        markRunStarted();
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keysRef.current.right = true;
        markRunStarted();
      }
      if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.key.toLowerCase() === "w"
      ) {
        keysRef.current.jump = true;
        markRunStarted();
      }
      if (event.key.toLowerCase() === "r") {
        const reset = createInitialState();
        stateRef.current = reset;
        setSnapshot(reset);
      }
      if (
        event.key === "Enter" &&
        gameState.phase === "wonLevel" &&
        gameState.levelIndex < LEVELS.length - 1
      ) {
        const nextLevelIndex = gameState.levelIndex + 1;
        const progressed = {
          ...gameState,
          levelIndex: nextLevelIndex,
          phase: "playing",
          player: createPlayer(LEVELS[nextLevelIndex].start),
          coins: LEVELS[nextLevelIndex].coins,
          enemies: createEnemyInstances(nextLevelIndex),
          movingPlatforms: LEVELS[nextLevelIndex].movingPlatforms.map((platform) =>
            createMovingPlatform(platform, 0),
          ),
          cameraX: 0,
          runStarted: false,
          levelElapsed: 0,
          damageCooldown: 0,
          hurtTimer: 0,
          attackTimer: 0,
        };
        stateRef.current = progressed;
        setSnapshot(progressed);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = false;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keysRef.current.right = false;
      }
      if (
        event.key === "ArrowUp" ||
        event.key === " " ||
        event.key.toLowerCase() === "w"
      ) {
        keysRef.current.jump = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [markRunStarted]);

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  useEffect(() => {
    const tick = (timestamp) => {
      const previous = previousTimeRef.current || timestamp;
      const dt = Math.min((timestamp - previous) / 1000, 0.032);
      previousTimeRef.current = timestamp;

      const current = stateRef.current;
      if (current.phase !== "playing") {
        setSnapshot(current);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const level = LEVELS[current.levelIndex];
      let next = {
        ...current,
        elapsed: current.elapsed + (current.runStarted ? dt : 0),
        levelElapsed: current.levelElapsed + dt,
        damageCooldown: Math.max(0, current.damageCooldown - dt),
        hurtTimer: Math.max(0, current.hurtTimer - dt),
        attackTimer: Math.max(0, current.attackTimer - dt),
        player: { ...current.player },
        coins: [...current.coins],
        enemies: current.enemies.map((enemy) => ({ ...enemy })),
      };

      const movingPlatforms = level.movingPlatforms.map((platform) =>
        createMovingPlatform(platform, next.levelElapsed),
      );
      const movingPlatformsPrevious = level.movingPlatforms.map((platform) =>
        createMovingPlatform(platform, next.levelElapsed - dt),
      );
      next.movingPlatforms = movingPlatforms;

      // Carry player if standing on a moving platform.
      if (next.player.onGround) {
        movingPlatforms.forEach((platform, index) => {
          const previousPlatform = movingPlatformsPrevious[index];
          const standingOn =
            next.player.x + next.player.w > previousPlatform.x + 8 &&
            next.player.x < previousPlatform.x + previousPlatform.w - 8 &&
            Math.abs(next.player.y + next.player.h - previousPlatform.y) < 4;
          if (standingOn) {
            next.player.x += platform.x - previousPlatform.x;
            next.player.y += platform.y - previousPlatform.y;
          }
        });
      }

      const input = keysRef.current;
      const horizontal = (input.left ? -1 : 0) + (input.right ? 1 : 0);
      next.player.vx = horizontal * MOVE_SPEED;

      if (horizontal !== 0) {
        next.player.facing = horizontal > 0 ? 1 : -1;
      }

      if (input.jump && next.player.onGround) {
        next.player.vy = -JUMP_SPEED;
        next.player.onGround = false;
      }

      next.player.vy += GRAVITY * dt;

      const allPlatforms = [...level.platforms, ...movingPlatforms];

      // Horizontal collision pass.
      next.player.x += next.player.vx * dt;
      allPlatforms.forEach((platform) => {
        if (!intersects(next.player, platform)) return;
        if (next.player.vx > 0) {
          next.player.x = platform.x - next.player.w;
        } else if (next.player.vx < 0) {
          next.player.x = platform.x + platform.w;
        }
      });
      next.player.x = clamp(next.player.x, -40, WORLD_WIDTH - next.player.w + 20);

      // Vertical collision pass.
      next.player.y += next.player.vy * dt;
      next.player.onGround = false;
      allPlatforms.forEach((platform) => {
        if (!intersects(next.player, platform)) return;
        if (next.player.vy > 0) {
          next.player.y = platform.y - next.player.h;
          next.player.vy = 0;
          next.player.onGround = true;
        } else if (next.player.vy < 0) {
          next.player.y = platform.y + platform.h;
          next.player.vy = 0;
        }
      });

      // Fall reset.
      if (next.player.y > VIEW_HEIGHT + 220) {
        next.lives -= 1;
        next.score = Math.max(0, next.score - 90);
        next.player = { ...next.player, ...createPlayer(level.start) };
        next.damageCooldown = 1;
        next.hurtTimer = 0.45;
        if (next.lives <= 0) next.phase = "gameover";
      }

      const playerHitbox = {
        x: next.player.x + 8,
        y: next.player.y + 4,
        w: next.player.w - 16,
        h: next.player.h - 8,
      };

      next.coins = next.coins.filter((coin) => {
        const coinBox = { x: coin.x, y: coin.y, w: 26, h: 26 };
        const didCollect = intersects(playerHitbox, coinBox);
        if (didCollect) {
          next.score += 100;
        }
        return !didCollect;
      });

      // Hazards (Level 2 and beyond).
      level.hazards.forEach((hazard) => {
        if (
          next.phase === "playing" &&
          next.damageCooldown <= 0 &&
          intersects(playerHitbox, hazard)
        ) {
          next.lives -= 1;
          next.score = Math.max(0, next.score - 120);
          next.player = { ...next.player, ...createPlayer(level.start) };
          next.damageCooldown = 1;
          next.hurtTimer = 0.45;
          if (next.lives <= 0) next.phase = "gameover";
        }
      });

      // Enemy patrol + combat.
      next.enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        enemy.x += enemy.dir * enemy.speed * dt;
        if (enemy.x < enemy.minX) {
          enemy.x = enemy.minX;
          enemy.dir = 1;
        }
        if (enemy.x + enemy.w > enemy.maxX) {
          enemy.x = enemy.maxX - enemy.w;
          enemy.dir = -1;
        }

        const enemyBox = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
        if (!intersects(playerHitbox, enemyBox)) return;

        const landingHit =
          next.player.vy > 140 &&
          next.player.y + next.player.h - enemy.y < 20;

        if (landingHit) {
          enemy.alive = false;
          next.player.vy = -STOMP_BOUNCE;
          next.score += 250;
          next.attackTimer = 0.25;
          return;
        }

        if (next.damageCooldown <= 0) {
          next.lives -= 1;
          next.score = Math.max(0, next.score - 140);
          next.player = { ...next.player, ...createPlayer(level.start) };
          next.damageCooldown = 1;
          next.hurtTimer = 0.45;
          if (next.lives <= 0) next.phase = "gameover";
        }
      });

      const goalBox = level.goal;
      if (next.coins.length === 0 && intersects(playerHitbox, goalBox)) {
        if (next.levelIndex < LEVELS.length - 1) {
          next.phase = "wonLevel";
        } else {
          next.phase = "completed";
        }
      }

      next.cameraX = clamp(
        next.player.x + next.player.w / 2 - VIEW_WIDTH / 2,
        0,
        WORLD_WIDTH - VIEW_WIDTH,
      );

      stateRef.current = next;
      setSnapshot(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const resetRun = () => {
    const reset = createInitialState();
    stateRef.current = reset;
    setSnapshot(reset);
  };

  const nextLevel = () => {
    if (snapshot.levelIndex >= LEVELS.length - 1) return;
    const nextLevelIndex = snapshot.levelIndex + 1;
    const progressed = {
      ...snapshot,
      levelIndex: nextLevelIndex,
      phase: "playing",
      player: createPlayer(LEVELS[nextLevelIndex].start),
      coins: LEVELS[nextLevelIndex].coins,
      enemies: createEnemyInstances(nextLevelIndex),
      movingPlatforms: LEVELS[nextLevelIndex].movingPlatforms.map((platform) =>
        createMovingPlatform(platform, 0),
      ),
      cameraX: 0,
      runStarted: false,
      levelElapsed: 0,
      damageCooldown: 0,
      hurtTimer: 0,
      attackTimer: 0,
    };
    stateRef.current = progressed;
    setSnapshot(progressed);
  };

  const isMoving = Math.abs(snapshot.player.vx) > 10 && snapshot.player.onGround;
  const samuraiAnimationState =
    snapshot.hurtTimer > 0
      ? "hurt"
      : snapshot.attackTimer > 0
        ? "attack"
        : !snapshot.player.onGround
          ? "jump"
        : isMoving
          ? "run"
          : "idle";
  const samuraiSpriteSheet =
    samuraiAnimationState === "hurt"
      ? samuraiHurt
      : samuraiAnimationState === "attack"
        ? samuraiAttack
        : samuraiAnimationState === "run" || samuraiAnimationState === "jump"
          ? samuraiRun
          : samuraiIdle;
  const overlayText =
    snapshot.phase === "wonLevel"
      ? "Level clear! Enter the next forest route."
      : snapshot.phase === "completed"
        ? "You conquered both levels. The forest is safe."
        : snapshot.phase === "gameover"
          ? "You were overwhelmed. Restart to try again."
          : "Collect all spirit coins, then reach the portal.";

  return (
    <div className="forest-platformer-shell">
      <audio ref={audioRef} src={forestLofi} preload="auto" />
      <div className="forest-platformer-card">
        <header className="forest-platformer-header">
          <div>
            <h1>Forest Platformer</h1>
            <p>Use A/D or arrow keys to move, W/Up/Space to jump, R to restart.</p>
          </div>
          <div className="forest-header-controls">
            <div className="forest-music-player">
              <button
                type="button"
                onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  if (!musicStarted) {
                    startMusic();
                    return;
                  }
                  if (musicPlaying) {
                    audio.pause();
                    setMusicPlaying(false);
                  } else {
                    audio
                      .play()
                      .then(() => setMusicPlaying(true))
                      .catch(() => {});
                  }
                }}
              >
                {musicPlaying ? "Pause Music" : "Play Music"}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  setMusicVolume(nextVolume);
                  if (audioRef.current) audioRef.current.volume = nextVolume;
                }}
                aria-label="Music volume"
              />
            </div>
            <Link to="/apps" className="forest-platformer-back">
              Back to Apps
            </Link>
          </div>
        </header>

        <section className="forest-platformer-hud">
          <span>Level: {snapshot.levelIndex + 1} / {LEVELS.length}</span>
          <span>Coins: {coinsCollected} / {totalCoins}</span>
          <span>Score: {snapshot.score}</span>
          <span>Lives: {"❤".repeat(Math.max(0, snapshot.lives))}</span>
          <span>Time: {snapshot.elapsed.toFixed(1)}s</span>
        </section>

        <section className="forest-platformer-stage">
          <div className="forest-parallax forest-sky" />
          <div
            className="forest-parallax forest-clouds"
            style={{ backgroundPositionX: `${snapshot.cameraX * -0.25}px` }}
          />
          <div
            className="forest-parallax forest-mountains"
            style={{ backgroundPositionX: `${snapshot.cameraX * -0.45}px` }}
          />

          <div
            className="forest-world"
            style={{ transform: `translateX(${-snapshot.cameraX}px)` }}
          >
            {activeLevel.decorations.map((tree, idx) => (
              <div
                key={`tree-${idx}`}
                className="forest-tree"
                style={{
                  left: tree.x,
                  top: tree.y,
                  backgroundImage: `url(${treeSprites})`,
                  backgroundPosition: tree.variant === 1 ? "-64px 0" : "0 0",
                  transform: tree.flip ? "scaleX(-1)" : "none",
                }}
              />
            ))}

            {activeLevel.platforms.map((platform, idx) => (
              <div
                key={`platform-${idx}`}
                className={`forest-platform ${
                  platform.kind === "ground" ? "forest-platform--ground" : "forest-platform--ledge"
                }`}
                style={{
                  left: platform.x,
                  top: platform.y,
                  width: platform.w,
                  height: platform.h,
                  "--tile-texture": `url(${groundTile})`,
                  "--float-delay": `${(idx % 4) * 0.35}s`,
                  "--float-duration": `${3.1 + (idx % 3) * 0.5}s`,
                }}
              />
            ))}

            {snapshot.movingPlatforms.map((platform, idx) => (
              <div
                key={platform.id}
                className="forest-platform forest-platform--moving"
                style={{
                  left: platform.x,
                  top: platform.y,
                  width: platform.w,
                  height: platform.h,
                  "--float-delay": `${(idx % 4) * 0.35}s`,
                  "--float-duration": `${3.2 + (idx % 2) * 0.5}s`,
                }}
              />
            ))}

            {snapshot.coins.map((coin, idx) => (
              <div key={`coin-${idx}`} className="forest-coin" style={{ left: coin.x, top: coin.y }} />
            ))}

            {activeLevel.hazards.map((hazard, idx) => (
              <div
                key={`hazard-${idx}`}
                className="forest-hazard"
                style={{ left: hazard.x, top: hazard.y, width: hazard.w, height: hazard.h }}
              />
            ))}

            {snapshot.enemies.filter((enemy) => enemy.alive).map((enemy) => (
              <div
                key={enemy.id}
                className="forest-enemy"
                style={{ left: enemy.x, top: enemy.y, width: enemy.w, height: enemy.h }}
              >
                👹
              </div>
            ))}

            <div className="forest-goal" style={{ left: activeLevel.goal.x, top: activeLevel.goal.y }}>
              <div className="forest-goal-core">◎</div>
            </div>

            <div
              className="forest-player"
              style={{
                left: snapshot.player.x - 24,
                top: snapshot.player.y + PLAYER_SPRITE_Y_OFFSET,
                transform: `scaleX(${snapshot.player.facing})`,
              }}
            >
              <div
                className={`samurai-sprite ${samuraiAnimationState}`}
                style={{
                  backgroundImage: `url(${samuraiSpriteSheet})`,
                }}
              />
            </div>
          </div>
          {snapshot.phase !== "playing" && (
            <div className="forest-overlay">
              <div className="forest-overlay-card">
                <h2>
                  {snapshot.phase === "wonLevel"
                    ? `Level ${snapshot.levelIndex + 1} complete`
                    : snapshot.phase === "completed"
                      ? "Campaign complete"
                      : "Game Over"}
                </h2>
                <p>{overlayText}</p>
                <div className="forest-overlay-actions">
                  {snapshot.phase === "wonLevel" && (
                    <button onClick={nextLevel} type="button">
                      Start Level {snapshot.levelIndex + 2}
                    </button>
                  )}
                  <button onClick={resetRun} type="button">
                    Restart Campaign
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="forest-platformer-footer">
          <span>{overlayText}</span>
          <button onClick={resetRun} type="button">
            Restart Run
          </button>
        </footer>
      </div>
    </div>
  );
}

