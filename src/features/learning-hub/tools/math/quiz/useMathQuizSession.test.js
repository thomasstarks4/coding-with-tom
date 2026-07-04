import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useMathQuizSession } from "./useMathQuizSession";
import { ATTEMPT_MODES } from "./math-quiz-explanations";

const problems = [
  { num1: 2, num2: 3, operator: "+", answer: 5 },
  { num1: 10, num2: 4, operator: "-", answer: 6 },
];

function renderSession(attemptMode, overrides = {}) {
  const onQuizComplete = vi.fn();

  const hook = renderHook(
    (props) => useMathQuizSession(props),
    {
      initialProps: {
        problems,
        attemptMode,
        onQuizComplete,
        ...overrides,
      },
    },
  );

  return { ...hook, onQuizComplete };
}

describe("useMathQuizSession", () => {
  it("grades a correct first attempt in single-attempt mode", () => {
    const { result } = renderSession(ATTEMPT_MODES.singleAttempt);

    act(() => {
      result.current.submitAnswer("5");
    });

    expect(result.current.feedbackPhase).toBe("success");
    expect(result.current.canAdvance).toBe(true);
    expect(result.current.scores.firstTryCorrect).toBe(1);
  });

  it("marks a wrong answer and advances in single-attempt mode", () => {
    const { result } = renderSession(ATTEMPT_MODES.singleAttempt);

    act(() => {
      result.current.submitAnswer("4");
    });

    expect(result.current.feedbackPhase).toBe("wrong");
    expect(result.current.canAdvance).toBe(true);

    act(() => {
      result.current.goNext();
    });

    expect(result.current.problemIndex).toBe(1);
  });

  it("shows explanation before the second try in one-more-chance mode", () => {
    const { result } = renderSession(ATTEMPT_MODES.oneMoreChance);

    act(() => {
      result.current.submitAnswer("4");
    });

    expect(result.current.feedbackPhase).toBe("explanation");
    expect(result.current.canAdvance).toBe(false);

    act(() => {
      result.current.submitAnswer("5");
    });

    expect(result.current.feedbackPhase).toBe("success");
    expect(result.current.scores.firstTryCorrect).toBe(0);
    expect(result.current.scores.finalCorrect).toBe(1);
  });

  it("lets learners retry until correct", () => {
    const { result } = renderSession(ATTEMPT_MODES.retryUntilCorrect);

    act(() => {
      result.current.submitAnswer("4");
    });

    expect(result.current.feedbackPhase).toBe("wrong");
    expect(result.current.canAdvance).toBe(false);

    act(() => {
      result.current.submitAnswer("5");
    });

    expect(result.current.feedbackPhase).toBe("success");
    expect(result.current.scores.firstTryCorrect).toBe(0);
    expect(result.current.scores.finalCorrect).toBe(1);
  });

  it("completes the quiz after the final problem", () => {
    const { result, onQuizComplete } = renderSession(ATTEMPT_MODES.singleAttempt);

    act(() => {
      result.current.submitAnswer("5");
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.submitAnswer("6");
    });

    expect(result.current.isComplete).toBe(true);
    expect(onQuizComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 2,
        finalCorrect: 2,
      }),
    );
  });
});
