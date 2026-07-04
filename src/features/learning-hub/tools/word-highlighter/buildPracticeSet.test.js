import { describe, it, expect } from "vitest";
import { buildPracticeSet } from "./buildPracticeSet";
import { PRACTICE_SET_SIZE } from "../../data/fluency-samples";

describe("buildPracticeSet", () => {
  const pool = [
    "One.",
    "Two.",
    "Three.",
    "Four.",
    "Five.",
    "Six.",
    "Seven.",
    "Eight.",
    "Nine.",
    "Ten.",
    "Eleven.",
  ];

  it("returns ten unique sentences by default", () => {
    const set = buildPracticeSet({ pool, shuffle: false });
    expect(set).toHaveLength(PRACTICE_SET_SIZE);
    expect(new Set(set).size).toBe(PRACTICE_SET_SIZE);
  });

  it("places a custom sentence first when provided", () => {
    const set = buildPracticeSet({
      customSentence: "My custom line.",
      pool,
      shuffle: false,
    });

    expect(set[0]).toBe("My custom line.");
    expect(set).toHaveLength(PRACTICE_SET_SIZE);
    expect(set.filter((sentence) => sentence === "My custom line.")).toHaveLength(1);
  });

  it("deduplicates custom sentence if it is already in the pool", () => {
    const set = buildPracticeSet({
      customSentence: "One.",
      pool,
      shuffle: false,
    });

    expect(set.filter((sentence) => sentence === "One.")).toHaveLength(1);
  });
});
