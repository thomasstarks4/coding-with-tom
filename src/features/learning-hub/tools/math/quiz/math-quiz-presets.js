import { generateProblems } from "../generateProblems";

export const MATH_QUIZ_PRESETS = [
  {
    id: "l1-quick-ten",
    title: "Level 1 Quick Ten",
    description: "Ten addition problems with numbers 1–10.",
    level: 1,
    count: 10,
  },
  {
    id: "l1-mini-five",
    title: "Level 1 Mini Five",
    description: "A short five-problem warm-up.",
    level: 1,
    count: 5,
  },
  {
    id: "l2-practice-fifteen",
    title: "Level 2 Practice",
    description: "Fifteen add/sub problems up to 20.",
    level: 2,
    count: 15,
  },
  {
    id: "l2-ten-mixed",
    title: "Level 2 Mixed Ten",
    description: "Ten mixed problems — good for a quick check-in.",
    level: 2,
    count: 10,
  },
  {
    id: "l3-challenge-twenty",
    title: "Level 3 Challenge",
    description: "Twenty problems up to 50.",
    level: 3,
    count: 20,
  },
  {
    id: "l3-ten-sprint",
    title: "Level 3 Sprint",
    description: "Ten harder problems for confident learners.",
    level: 3,
    count: 10,
  },
];

export const MATH_QUIZ_CUSTOM_MIN = 5;
export const MATH_QUIZ_CUSTOM_MAX = 25;

export function clampQuizCount(count) {
  const numeric = Number(count) || 0;
  return Math.min(
    MATH_QUIZ_CUSTOM_MAX,
    Math.max(MATH_QUIZ_CUSTOM_MIN, Math.floor(numeric)),
  );
}

export function buildQuizFromPreset(preset) {
  return generateProblems({
    count: preset.count,
    level: preset.level,
  });
}

export function buildCustomQuiz({ level, count }) {
  return generateProblems({
    count: clampQuizCount(count),
    level,
  });
}
