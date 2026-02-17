// ============================================================
// usePersistence — localStorage save/load with debounce
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";

const SAVE_KEY = "spirit-quest-save";
const DEBOUNCE_MS = 500;

/**
 * Hook that persists game state to localStorage.
 *
 * @param {object} initialState - default state if no save exists
 * @returns {{ state, setState, saveGame, loadGame, clearSave, hasSave }}
 */
export function usePersistence(initialState) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial to handle new fields added in updates
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      console.warn("Failed to load save:", e);
    }
    return initialState;
  });

  const [hasSave, setHasSave] = useState(() => !!localStorage.getItem(SAVE_KEY));
  const debounceRef = useRef(null);

  // Debounced auto-save whenever state changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        setHasSave(true);
      } catch (e) {
        console.warn("Failed to auto-save:", e);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  const saveGame = useCallback(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      setHasSave(true);
    } catch (e) {
      console.warn("Failed to save:", e);
    }
  }, [state]);

  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
        return true;
      }
    } catch (e) {
      console.warn("Failed to load:", e);
    }
    return false;
  }, []);

  const clearSave = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(initialState);
    setHasSave(false);
  }, [initialState]);

  return { state, setState, saveGame, loadGame, clearSave, hasSave };
}
