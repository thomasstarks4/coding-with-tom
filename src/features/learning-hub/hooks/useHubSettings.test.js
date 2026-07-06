import { describe, it, expect, beforeEach } from "vitest";
import {
  HUB_SETTINGS_KEY,
  mergeStarters,
  loadHubSettings,
  saveHubSettings,
} from "./useHubSettings.storage";
import { initialStarters } from "../data/starters";

describe("useHubSettings utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns defaults when storage is empty", () => {
    expect(loadHubSettings()).toEqual(initialStarters);
  });

  it("merges saved isShown flags with current defaults", () => {
    const saved = {
      starter1: { isShown: false },
      starter2: { isShown: true },
    };

    const merged = mergeStarters(initialStarters, saved);
    expect(merged.starter1.isShown).toBe(false);
    expect(merged.starter2.isShown).toBe(true);
    expect(merged.starter1.text).toBe(initialStarters.starter1.text);
  });

  it("persists and reloads starter settings", () => {
    const custom = {
      ...initialStarters,
      starter1: { ...initialStarters.starter1, isShown: false },
    };

    saveHubSettings(custom);
    expect(localStorage.getItem(HUB_SETTINGS_KEY)).toBeTruthy();
    expect(loadHubSettings().starter1.isShown).toBe(false);
  });

  it("adds new default starters when saved data is stale", () => {
    const stale = { starter1: { isShown: false } };
    saveHubSettings(stale);

    const loaded = loadHubSettings();
    expect(loaded.starter1.isShown).toBe(false);
    expect(loaded.starter28).toEqual(initialStarters.starter28);
  });
});
