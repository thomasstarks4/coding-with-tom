import {
  loadFocusLockPreference as loadFocusLockByKey,
  saveFocusLockPreference as saveFocusLockByKey,
} from "../../hooks/useFocusLock.storage";

export const FOCUS_LOCK_KEY = "tlh-starter-focus-lock";

export function loadFocusLockPreference() {
  return loadFocusLockByKey(FOCUS_LOCK_KEY);
}

export function saveFocusLockPreference(locked) {
  saveFocusLockByKey(FOCUS_LOCK_KEY, locked);
}
