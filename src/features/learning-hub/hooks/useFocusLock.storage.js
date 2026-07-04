export const STARTER_FOCUS_LOCK_KEY = "tlh-starter-focus-lock";
export const HIGHLIGHTER_FOCUS_LOCK_KEY = "tlh-highlighter-focus-lock";
export const MATH_FOCUS_LOCK_KEY = "tlh-math-focus-lock";

export function loadFocusLockPreference(key) {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function saveFocusLockPreference(key, locked) {
  try {
    localStorage.setItem(key, String(locked));
  } catch {
    // Ignore quota or private-mode storage errors.
  }
}
