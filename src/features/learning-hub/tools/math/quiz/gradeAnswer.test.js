import { describe, it, expect } from "vitest";
import { gradeAnswer } from "./gradeAnswer";

describe("gradeAnswer", () => {
  it("accepts a correct integer string", () => {
    expect(gradeAnswer("12", 12)).toEqual({
      valid: true,
      correct: true,
      parsedValue: 12,
      error: null,
    });
  });

  it("trims whitespace before grading", () => {
    expect(gradeAnswer("  7  ", 7).correct).toBe(true);
  });

  it("rejects empty input", () => {
    expect(gradeAnswer("", 5).valid).toBe(false);
    expect(gradeAnswer("   ", 5).valid).toBe(false);
  });

  it("rejects non-integer input", () => {
    expect(gradeAnswer("3.5", 3).valid).toBe(false);
    expect(gradeAnswer("abc", 3).valid).toBe(false);
  });

  it("marks incorrect numeric answers", () => {
    const result = gradeAnswer("8", 9);
    expect(result.valid).toBe(true);
    expect(result.correct).toBe(false);
  });
});
