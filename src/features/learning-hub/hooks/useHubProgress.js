import { useCallback, useEffect, useRef, useState } from "react";

export const HUB_PROGRESS_KEY = "tlh-progress";

const defaultProgress = {
  completedTopics: [],
  highlighter: {
    lastSentence: "",
    wordsCompleted: 0,
  },
};

export function loadHubProgress() {
  try {
    const raw = localStorage.getItem(HUB_PROGRESS_KEY);
    if (!raw) {
      return { ...defaultProgress, completedTopics: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      completedTopics: Array.isArray(parsed.completedTopics)
        ? parsed.completedTopics
        : [],
      highlighter: {
        ...defaultProgress.highlighter,
        ...(parsed.highlighter ?? {}),
      },
    };
  } catch {
    return { ...defaultProgress, completedTopics: [] };
  }
}

export function saveHubProgress(progress) {
  localStorage.setItem(HUB_PROGRESS_KEY, JSON.stringify(progress));
}

export function useHubProgress() {
  const [progress, setProgressState] = useState(() => loadHubProgress());
  const [lastSaved, setLastSaved] = useState(null);
  const skipSave = useRef(true);

  const setProgress = useCallback((updater) => {
    setProgressState(updater);
  }, []);

  const updateProgress = useCallback((patch) => {
    setProgressState((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        saveHubProgress(progress);
        setLastSaved(Date.now());
      } catch {
        // Ignore quota or private-mode storage errors.
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [progress]);

  return { progress, setProgress, updateProgress, lastSaved };
}
