export const ATTEMPT_MODES = {
  retryUntilCorrect: "retryUntilCorrect",
  oneMoreChance: "oneMoreChance",
  singleAttempt: "singleAttempt",
};

export const ATTEMPT_MODE_OPTIONS = [
  {
    id: ATTEMPT_MODES.retryUntilCorrect,
    label: "Keep trying",
    description:
      "After a wrong answer, your learner can keep trying until they get it right. Final score counts every problem solved.",
  },
  {
    id: ATTEMPT_MODES.oneMoreChance,
    label: "One more chance",
    description:
      "After the first wrong answer, a short tip appears and your learner gets exactly one more try. Results show first-try and final scores.",
  },
  {
    id: ATTEMPT_MODES.singleAttempt,
    label: "Single attempt",
    description:
      "One try per problem. Wrong answers move on immediately. Score reflects first-try accuracy only.",
  },
];

export function getQuizExplanation(problem, level) {
  if (problem.operator === "+") {
    if (level === 1) {
      return "Try counting up from the smaller number on your fingers.";
    }
    return "Add the ones first, then the tens. Count up from the larger number if that helps.";
  }

  if (level === 1) {
    return "Start with the bigger number and count backward by the smaller number.";
  }
  return "Think: what plus the bottom number equals the top number? You can count up to check.";
}
