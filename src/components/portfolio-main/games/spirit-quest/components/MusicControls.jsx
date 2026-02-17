// ============================================================
// MusicControls — Minimal, tasteful floating jukebox
//
// Desktop : slim pill in bottom-right, click to expand.
// Mobile  : same pill, tap to expand. All touch-friendly.
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicControls({ volume, setVolume, isMuted, toggleMute, play, isPlaying }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close panel when tapping outside
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside, true);
    return () => document.removeEventListener("pointerdown", handleOutside, true);
  }, [open]);

  const pct = Math.round(volume * 100);

  return (
    <div ref={panelRef} className="fixed bottom-3 right-3 z-50 select-none">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-gray-950/95 backdrop-blur-md border border-gray-700/60
                       rounded-2xl shadow-2xl shadow-black/40 w-56 overflow-hidden"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Jukebox
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full
                           text-gray-600 hover:text-gray-300 hover:bg-gray-800
                           transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            <div className="px-4 pb-4 pt-2 space-y-3">
              {/* Volume slider */}
              <div>
                <div className="flex items-center gap-2">
                  {/* Mute toggle */}
                  <button
                    onClick={() => {
                      toggleMute();
                      play(); // ensure audio context is unlocked on tap
                    }}
                    className={`w-8 h-8 flex-shrink-0 flex items-center justify-center
                                rounded-lg transition-colors text-sm
                                ${isMuted
                                  ? "bg-gray-800 text-gray-500"
                                  : "bg-cyan-900/40 text-cyan-400"}`}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0
                      ? "🔇"
                      : volume < 0.4
                        ? "🔈"
                        : volume < 0.7
                          ? "🔉"
                          : "🔊"}
                  </button>

                  {/* Slider track */}
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={pct}
                      onChange={(e) => {
                        setVolume(parseInt(e.target.value, 10) / 100);
                        play(); // unlock on first interaction
                      }}
                      className="w-full h-8 appearance-none bg-transparent cursor-pointer
                        [&::-webkit-slider-runnable-track]:h-1.5
                        [&::-webkit-slider-runnable-track]:rounded-full
                        [&::-webkit-slider-runnable-track]:bg-gray-700
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-cyan-400
                        [&::-webkit-slider-thumb]:-mt-[7px]
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:shadow-cyan-500/20
                        [&::-moz-range-track]:h-1.5
                        [&::-moz-range-track]:rounded-full
                        [&::-moz-range-track]:bg-gray-700
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-cyan-400
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:shadow-md"
                    />
                  </div>

                  {/* Percentage */}
                  <span className="text-[11px] font-mono text-gray-500 w-8 text-right flex-shrink-0">
                    {pct}
                  </span>
                </div>
              </div>

              {/* Subtle footer */}
              <p className="text-[9px] text-gray-700 text-center tracking-wide">
                {isMuted ? "Sound muted" : isPlaying ? "♫ Now playing" : "♫ Ready"}
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Collapsed pill ─────────────────────────── */
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setOpen(true);
              play(); // unlock audio on tap
            }}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-full
              backdrop-blur-md border shadow-lg shadow-black/30
              transition-all duration-200
              ${isMuted
                ? "bg-gray-900/90 border-gray-700/60 text-gray-500 hover:text-gray-400"
                : "bg-gray-950/90 border-cyan-800/40 text-cyan-400 hover:border-cyan-600/60"
              }
            `}
            aria-label="Music controls"
          >
            <span className="text-base">{isMuted ? "🔇" : "♫"}</span>
            <span className="text-[10px] font-medium tracking-wide hidden sm:inline">
              {isMuted ? "Muted" : `${pct}%`}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
