export const MATH_LEVELS = [
  {
    level: 1,
    max: 10,
    label: "Level 1",
    range: "1–10",
    description: "Addition only, numbers 1–10",
    allowSubtraction: false,
  },
  {
    level: 2,
    max: 20,
    label: "Level 2",
    range: "1–20",
    description: "Addition and subtraction, numbers 1–20",
    allowSubtraction: true,
  },
  {
    level: 3,
    max: 50,
    label: "Level 3",
    range: "1–50",
    description: "Addition and subtraction, numbers 1–50",
    allowSubtraction: true,
  },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getLevelConfig(level) {
  return MATH_LEVELS.find((entry) => entry.level === level) ?? MATH_LEVELS[0];
}

export function generateSingleProblem(level) {
  const config = getLevelConfig(level);
  let num1 = randomInt(1, config.max);
  let num2 = randomInt(1, config.max);
  let operator = "+";

  if (config.allowSubtraction && Math.random() > 0.5) {
    operator = "-";
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    num1 = larger;
    num2 = smaller === larger && larger > 1 ? randomInt(1, larger - 1) : smaller;
  }

  const answer = operator === "+" ? num1 + num2 : num1 - num2;

  return {
    num1,
    num2,
    operator,
    answer,
  };
}

export function generateProblems({ count, level }) {
  const safeCount = Math.max(0, Math.min(Number(count) || 0, 100));
  return Array.from({ length: safeCount }, () => generateSingleProblem(level));
}

export function formatProblem(problem) {
  const { num1, num2, operator } = problem;
  const numWidth = Math.max(String(num1).length, String(num2).length);
  const topLine = `${" ".repeat(2)}${String(num1).padStart(numWidth)}`;
  const bottomLine = `${operator} ${String(num2).padStart(numWidth)}`;
  const underline = "_".repeat(2 + numWidth + 2);

  return `${topLine}\n${bottomLine}\n${underline}`;
}
