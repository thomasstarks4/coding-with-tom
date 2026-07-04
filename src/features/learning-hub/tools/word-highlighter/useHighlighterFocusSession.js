import { useCallback, useEffect, useState } from "react";
import {
  HIGHLIGHTER_FOCUS_LOCK_KEY,
  loadFocusLockPreference,
  saveFocusLockPreference,
} from "../../hooks/useFocusLock.storage";
import { PACE_OPTIONS } from "../../data/fluency-samples";
import { clampWordIndex } from "./tokenizeText";

export function useHighlighterFocusSession({
  words,
  text,
  paceKey,
  onComplete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(() =>
    loadFocusLockPreference(HIGHLIGHTER_FOCUS_LOCK_KEY),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [repeatNonce, setRepeatNonce] = useState(0);

  const pace = PACE_OPTIONS[paceKey];
  const currentWord = words[currentIndex] ?? "";
  const total = words.length;

  useEffect(() => {
    if (paceKey === "manual" || !isOpen || !hasStarted || words.length === 0) {
      return undefined;
    }

    if (currentIndex >= words.length - 1) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => clampWordIndex(index + 1, words.length));
    }, pace.ms);

    return () => window.clearTimeout(timer);
  }, [
    paceKey,
    pace.ms,
    isOpen,
    hasStarted,
    currentIndex,
    words.length,
    repeatNonce,
  ]);

  const open = useCallback(() => {
    setShowComplete(false);
    setHasStarted(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(
    (force = false) => {
      if (isLocked && !force) {
        return;
      }
      setIsOpen(false);
      setShowComplete(false);
    },
    [isLocked],
  );

  const toggleLock = useCallback(() => {
    setIsLocked((locked) => {
      const next = !locked;
      saveFocusLockPreference(HIGHLIGHTER_FOCUS_LOCK_KEY, next);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (words.length === 0) {
      return;
    }
    setHasStarted(true);
    if (currentIndex >= words.length - 1) {
      setShowComplete(true);
      onComplete?.(words.length);
      return;
    }
    setCurrentIndex((index) => clampWordIndex(index + 1, words.length));
  }, [words.length, currentIndex, onComplete]);

  const goPrev = useCallback(() => {
    if (words.length === 0) {
      return;
    }
    setHasStarted(true);
    setCurrentIndex((index) => clampWordIndex(index - 1, words.length));
  }, [words.length]);

  const repeatWord = useCallback(() => {
    setHasStarted(true);
    setRepeatNonce((nonce) => nonce + 1);
  }, []);

  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setShowComplete(false);
    setHasStarted(false);
  }, []);

  const practiceAgain = useCallback(() => {
    resetSession();
    setHasStarted(true);
    setShowComplete(false);
  }, [resetSession]);

  const resetForNewText = useCallback(() => {
    setCurrentIndex(0);
    setShowComplete(false);
    setHasStarted(false);
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
    isLocked,
    toggleLock,
    currentIndex,
    currentWord,
    words,
    text,
    showComplete,
    hasStarted,
    canOpen: words.length > 0,
    progress: {
      current: currentIndex + 1,
      total,
      completed: currentIndex,
    },
    goNext,
    goPrev,
    repeatWord,
    resetSession,
    practiceAgain,
    resetForNewText,
  };
}
