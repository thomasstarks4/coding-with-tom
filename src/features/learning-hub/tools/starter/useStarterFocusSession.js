import { useCallback, useEffect, useState } from "react";
import {
  loadFocusLockPreference,
  saveFocusLockPreference,
} from "./useStarterFocusSession.storage";

export {
  FOCUS_LOCK_KEY,
  loadFocusLockPreference,
  saveFocusLockPreference,
} from "./useStarterFocusSession.storage";

export function useStarterFocusSession({
  deck,
  notRead,
  read,
  onMarkRead,
  onTryAgainLater,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(() => loadFocusLockPreference());
  const [showComplete, setShowComplete] = useState(false);

  const currentCard = notRead[0] ?? null;
  const total = deck.length;
  const readCount = read.length;
  const remainingCount = notRead.length;
  const canOpen = remainingCount > 0;

  useEffect(() => {
    if (isOpen && total > 0 && remainingCount === 0) {
      setShowComplete(true);
    }
  }, [isOpen, total, remainingCount]);

  const open = useCallback(() => {
    setShowComplete(false);
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
      saveFocusLockPreference(next);
      return next;
    });
  }, []);

  const markRead = useCallback(() => {
    if (!currentCard) {
      return;
    }
    onMarkRead(currentCard.id);
  }, [currentCard, onMarkRead]);

  const tryAgainLater = useCallback(() => {
    if (!currentCard) {
      return;
    }
    onTryAgainLater(currentCard.id);
  }, [currentCard, onTryAgainLater]);

  return {
    isOpen,
    open,
    close,
    isLocked,
    toggleLock,
    currentCard,
    showComplete,
    canOpen,
    progress: {
      read: readCount,
      total,
      remaining: remainingCount,
      current: readCount + 1,
    },
    markRead,
    tryAgainLater,
  };
}
