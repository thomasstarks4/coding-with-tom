// ============================================================
// useMusic — Simple, reliable background music
//
// Strategy: Create one Audio element. Load the track source.
// Browser blocks .play() until a user gesture occurs.
// We attach a one-time click/touch/key listener on the
// document that calls .play(). After that first gesture
// all future .play() calls work without restriction.
//
// Volume & mute are persisted to localStorage.
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

const KEY_VOL = "sq-vol";
const KEY_MUTE = "sq-mute";

export function useMusic(trackName, defaultVolume = 0.4) {
  // ── Persisted preferences ─────────────────────────────
  const [volume, _setVolume] = useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(KEY_VOL));
      return Number.isFinite(v) ? v : defaultVolume;
    } catch {
      return defaultVolume;
    }
  });

  const [isMuted, _setMuted] = useState(() => {
    try {
      return localStorage.getItem(KEY_MUTE) === "true";
    } catch {
      return false;
    }
  });

  // ── Refs (stable across renders, no re-render cost) ───
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const unlockedRef = useRef(false);
  const mountedRef = useRef(true);
  const volRef = useRef(volume);
  const muteRef = useRef(isMuted);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep refs in sync with state
  volRef.current = volume;
  muteRef.current = isMuted;

  // ── Create audio element once on mount ────────────────
  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    a.preload = "auto";
    a.addEventListener("playing", () => { if (mountedRef.current) setIsPlaying(true); });
    a.addEventListener("pause",   () => { if (mountedRef.current) setIsPlaying(false); });
    audioRef.current = a;
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      a.pause();
      a.removeAttribute("src");
      a.load();
      audioRef.current = null;
    };
  }, []);

  // ── Unlock playback on first user gesture ─────────────
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      const a = audioRef.current;
      if (!a) return;

      // Re-load the current track fresh and play it
      const track = trackRef.current;
      if (track) {
        const src = `/games/spirit-quest/music/${track}.mp3`;
        a.src = src;
        a.load();
        a.volume = muteRef.current ? 0 : volRef.current;
        a.play().catch(() => {});
      }
    };

    const events = ["click", "touchstart", "keydown", "pointerdown"];
    events.forEach((ev) =>
      document.addEventListener(ev, unlock, { once: true, passive: true })
    );

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, unlock));
    };
  }, []);

  // ── Sync volume to audio element ──────────────────────
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const target = isMuted ? 0 : Math.max(0, Math.min(1, volume));
    a.volume = target;
  }, [volume, isMuted]);

  // ── Persist prefs ─────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(KEY_VOL, String(volume)); } catch {}
  }, [volume]);

  useEffect(() => {
    try { localStorage.setItem(KEY_MUTE, String(isMuted)); } catch {}
  }, [isMuted]);

  // ── Track switching with crossfade ────────────────────
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !trackName) return;
    if (trackRef.current === trackName) return;

    trackRef.current = trackName;
    const src = `/games/spirit-quest/music/${trackName}.mp3`;
    const targetVol = muteRef.current ? 0 : volRef.current;

    const loadAndPlay = () => {
      a.src = src;
      a.load();
      a.volume = 0;

      const rampUp = () => {
        if (!mountedRef.current) return;
        if (unlockedRef.current) {
          a.play().catch(() => {});
        }
        let v = 0;
        const step = Math.max(targetVol / 8, 0.01);
        const id = setInterval(() => {
          if (!mountedRef.current) { clearInterval(id); return; }
          v = Math.min(v + step, targetVol);
          a.volume = v;
          if (v >= targetVol) clearInterval(id);
        }, 40);
      };

      if (a.readyState >= 3) {
        rampUp();
      } else {
        a.addEventListener("canplay", rampUp, { once: true });
      }
    };

    // Fade out current audio if playing
    if (!a.paused && a.volume > 0.01) {
      let v = a.volume;
      const step = v / 6;
      const id = setInterval(() => {
        v -= step;
        if (v <= 0.01) {
          a.volume = 0;
          clearInterval(id);
          a.pause();
          loadAndPlay();
        } else {
          a.volume = Math.max(0, v);
        }
      }, 40);
    } else {
      a.pause();
      loadAndPlay();
    }
  }, [trackName]);

  // ── Public API ────────────────────────────────────────
  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    _setVolume(clamped);
    if (clamped > 0) _setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    _setMuted((m) => !m);
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    unlockedRef.current = true;
    a.volume = muteRef.current ? 0 : volRef.current;
    a.play().catch(() => {});
  }, []);

  return { volume, setVolume, isMuted, toggleMute, play, isPlaying };
}
