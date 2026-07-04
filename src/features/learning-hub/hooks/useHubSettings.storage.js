import { initialStarters } from "../data/starters";

export const HUB_SETTINGS_KEY = "tlh-starter-settings";

export function mergeStarters(defaults, saved) {
  if (!saved || typeof saved !== "object") {
    return { ...defaults };
  }

  const merged = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (saved[key]) {
      merged[key] = {
        ...defaults[key],
        isShown:
          typeof saved[key].isShown === "boolean"
            ? saved[key].isShown
            : defaults[key].isShown,
      };
    }
  }
  return merged;
}

export function loadHubSettings() {
  try {
    const raw = localStorage.getItem(HUB_SETTINGS_KEY);
    if (!raw) {
      return { ...initialStarters };
    }
    return mergeStarters(initialStarters, JSON.parse(raw));
  } catch {
    return { ...initialStarters };
  }
}

export function saveHubSettings(starters) {
  localStorage.setItem(HUB_SETTINGS_KEY, JSON.stringify(starters));
}
