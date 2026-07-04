export const FOCUS_LOCK_KEY = "tlh-starter-focus-lock";

export function loadFocusLockPreference() {
  try {
    return localStorage.getItem(FOCUS_LOCK_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveFocusLockPreference(locked) {
  try {
    localStorage.setItem(FOCUS_LOCK_KEY, String(locked));
  } catch {
    // Ignore quota or private-mode storage errors.
  }
}
