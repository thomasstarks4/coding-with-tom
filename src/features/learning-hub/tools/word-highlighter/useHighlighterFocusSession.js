import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HIGHLIGHTER_FOCUS_LOCK_KEY,
  loadFocusLockPreference,
  saveFocusLockPreference,
} from "../../hooks/useFocusLock.storage";
import { PACE_OPTIONS } from "../../data/fluency-samples";
import { clampWordIndex, tokenizeText } from "./tokenizeText";

export function useHighlighterFocusSession({
  sentences,
  paceKey,
  onSentenceComplete,
  onSessionComplete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(() =>
    loadFocusLockPreference(HIGHLIGHTER_FOCUS_LOCK_KEY),
  );
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [repeatNonce, setRepeatNonce] = useState(0);

  const pace = PACE_OPTIONS[paceKey];
  const currentSentence = sentences[sentenceIndex] ?? "";
  const words = useMemo(() => tokenizeText(currentSentence), [currentSentence]);
  const currentWord = words[currentIndex] ?? "";
  const totalWords = words.length;
  const totalSentences = sentences.length;

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

  const advanceSentence = useCallback(() => {
    if (sentenceIndex >= sentences.length - 1) {
      setShowComplete(true);
      onSessionComplete?.();
      return true;
    }

    onSentenceComplete?.(sentenceIndex);
    setSentenceIndex((index) => index + 1);
    setCurrentIndex(0);
    return false;
  }, [sentenceIndex, sentences.length, onSentenceComplete, onSessionComplete]);

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
      advanceSentence();
      return;
    }
    setCurrentIndex((index) => clampWordIndex(index + 1, words.length));
  }, [words.length, currentIndex, advanceSentence]);

  const goPrev = useCallback(() => {
    if (words.length === 0) {
      return;
    }
    setHasStarted(true);
    if (currentIndex > 0) {
      setCurrentIndex((index) => clampWordIndex(index - 1, words.length));
      return;
    }
    if (sentenceIndex > 0) {
      const previousWords = tokenizeText(sentences[sentenceIndex - 1]);
      setSentenceIndex((index) => index - 1);
      setCurrentIndex(Math.max(previousWords.length - 1, 0));
    }
  }, [words.length, currentIndex, sentenceIndex, sentences]);

  const repeatWord = useCallback(() => {
    setHasStarted(true);
    setRepeatNonce((nonce) => nonce + 1);
  }, []);

  const resetSession = useCallback(() => {
    setSentenceIndex(0);
    setCurrentIndex(0);
    setShowComplete(false);
    setHasStarted(false);
  }, []);

  const practiceAgain = useCallback(() => {
    resetSession();
    setHasStarted(true);
    setShowComplete(false);
  }, [resetSession]);

  const resetForNewSet = useCallback(() => {
    setSentenceIndex(0);
    setCurrentIndex(0);
    setShowComplete(false);
    setHasStarted(false);
    setIsOpen(false);
  }, []);

  const isAtStart = sentenceIndex === 0 && currentIndex === 0;

  return {
    isOpen,
    open,
    close,
    isLocked,
    toggleLock,
    sentenceIndex,
    currentIndex,
    currentWord,
    currentSentence,
    words,
    sentences,
    showComplete,
    hasStarted,
    canOpen: sentences.length > 0 && sentences.some((s) => tokenizeText(s).length > 0),
    isAtStart,
    progress: {
      word: {
        current: currentIndex + 1,
        total: totalWords,
      },
      sentence: {
        current: sentenceIndex + 1,
        total: totalSentences,
      },
    },
    goNext,
    goPrev,
    repeatWord,
    resetSession,
    practiceAgain,
    resetForNewSet,
  };
}
