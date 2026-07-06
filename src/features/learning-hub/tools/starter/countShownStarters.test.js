import { describe, it, expect } from "vitest";
import { countShownStarters } from "./countShownStarters";
import { initialStarters } from "../../data/starters";

describe("countShownStarters", () => {
  it("counts starters with isShown true", () => {
    expect(countShownStarters(initialStarters)).toBe(
      Object.values(initialStarters).filter((starter) => starter.isShown).length,
    );
  });

  it("returns 0 for null or undefined", () => {
    expect(countShownStarters(null)).toBe(0);
    expect(countShownStarters(undefined)).toBe(0);
  });

  it("returns 0 when none are shown", () => {
    const allHidden = Object.fromEntries(
      Object.entries(initialStarters).map(([key, starter]) => [
        key,
        { ...starter, isShown: false },
      ]),
    );

    expect(countShownStarters(allHidden)).toBe(0);
  });
});
