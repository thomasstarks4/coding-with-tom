import { describe, it, expect } from "vitest";
import {
  generateProblems,
  generateSingleProblem,
  getLevelConfig,
  formatProblem,
} from "./generateProblems";

describe("generateProblems", () => {
  it("returns the requested number of problems", () => {
    expect(generateProblems({ count: 10, level: 1 })).toHaveLength(10);
  });

  it("caps problem count at 100", () => {
    expect(generateProblems({ count: 500, level: 1 })).toHaveLength(100);
  });

  it("never produces negative answers at level 1", () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateSingleProblem(1);
      expect(problem.operator).toBe("+");
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      expect(problem.num1).toBeLessThanOrEqual(10);
      expect(problem.num2).toBeLessThanOrEqual(10);
    }
  });

  it("keeps subtraction results non-negative at level 2", () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateSingleProblem(2);
      expect(problem.answer).toBeGreaterThanOrEqual(0);
      if (problem.operator === "-") {
        expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
      }
    }
  });

  it("uses only three simplified levels", () => {
    expect(getLevelConfig(1).max).toBe(10);
    expect(getLevelConfig(2).max).toBe(20);
    expect(getLevelConfig(3).max).toBe(50);
  });
});

describe("formatProblem", () => {
  it("right-aligns numbers under the operator column", () => {
    const formatted = formatProblem({
      num1: 12,
      num2: 5,
      operator: "+",
    });

    expect(formatted).toBe("  12\n+  5\n______");
  });

  it("aligns when the bottom number is wider", () => {
    const formatted = formatProblem({
      num1: 7,
      num2: 45,
      operator: "-",
    });

    expect(formatted).toBe("   7\n- 45\n______");
  });
});
