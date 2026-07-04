import { describe, it, expect } from "vitest";
import { tokenizeText, clampWordIndex } from "./tokenizeText";

describe("tokenizeText", () => {
  it("splits text into words", () => {
    expect(tokenizeText("The cat sat.")).toEqual(["The", "cat", "sat."]);
  });

  it("returns empty array for blank input", () => {
    expect(tokenizeText("   ")).toEqual([]);
  });
});

describe("clampWordIndex", () => {
  it("clamps index within word bounds", () => {
    expect(clampWordIndex(5, 3)).toBe(2);
    expect(clampWordIndex(-1, 3)).toBe(0);
  });

  it("returns 0 when there are no words", () => {
    expect(clampWordIndex(2, 0)).toBe(0);
  });
});
