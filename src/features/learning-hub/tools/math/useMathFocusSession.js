import { useCallback, useEffect, useState } from "react";
import {
  MATH_FOCUS_LOCK_KEY,
  loadFocusLockPreference,
  saveFocusLockPreference,
} from "../../hooks/useFocusLock.storage";

function clampIndex(index, length) {
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), length - 1);
}

export function useMathFocusSession({ problems, onSessionComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(() =>
    loadFocusLockPreference(MATH_FOCUS_LOCK_KEY),
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [repeatNonce, setRepeatNonce] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const currentProblem = problems[problemIndex] ?? null;
  const totalProblems = problems.length;

  useEffect(() => {
    setAnswerRevealed(false);
  }, [problemIndex, repeatNonce]);

  useEffect(() => {
    setProblemIndex((index) => clampIndex(index, problems.length));
  }, [problems.length]);

  const open = useCallback(() => {
    setShowComplete(false);
    setHasStarted(true);
    setIsOpen(true);
    setAnswerRevealed(false);
  }, []);

  const close = useCallback(
    (force = false) => {
      if (isLocked && !force) {
        return;
      }
      setIsOpen(false);
      setShowComplete(false);
      setAnswerRevealed(false);
    },
    [isLocked],
  );

  const toggleLock = useCallback(() => {
    setIsLocked((locked) => {
      const next = !locked;
      saveFocusLockPreference(MATH_FOCUS_LOCK_KEY, next);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (problems.length === 0) {
      return;
    }
    setHasStarted(true);
    setAnswerRevealed(false);
    if (problemIndex >= problems.length - 1) {
      setShowComplete(true);
      onSessionComplete?.();
      return;
    }
    setProblemIndex((index) => index + 1);
  }, [problems.length, problemIndex, onSessionComplete]);

  const goPrev = useCallback(() => {
    if (problemIndex > 0) {
      setHasStarted(true);
      setAnswerRevealed(false);
      setProblemIndex((index) => index - 1);
    }
  }, [problemIndex]);

  const repeatProblem = useCallback(() => {
    setHasStarted(true);
    setAnswerRevealed(false);
    setRepeatNonce((nonce) => nonce + 1);
  }, []);

  const toggleRevealAnswer = useCallback(() => {
    setAnswerRevealed((revealed) => !revealed);
  }, []);

  const resetSession = useCallback(() => {
    setProblemIndex(0);
    setShowComplete(false);
    setHasStarted(false);
    setAnswerRevealed(false);
  }, []);

  const practiceAgain = useCallback(() => {
    resetSession();
    setHasStarted(true);
    setShowComplete(false);
  }, [resetSession]);

  const resetForNewSet = useCallback(() => {
    setProblemIndex(0);
    setShowComplete(false);
    setHasStarted(false);
    setIsOpen(false);
    setAnswerRevealed(false);
  }, []);

  return {
    isOpen,
    open,
    close,
    isLocked,
    toggleLock,
    problemIndex,
    currentProblem,
    problems,
    showComplete,
    hasStarted,
    repeatNonce,
    answerRevealed,
    toggleRevealAnswer,
    canOpen: problems.length > 0,
    isAtStart: problemIndex === 0,
    progress: {
      current: problemIndex + 1,
      total: totalProblems,
    },
    goNext,
    goPrev,
    repeatProblem,
    resetSession,
    practiceAgain,
    resetForNewSet,
  };
}
