import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useMathFocusSession } from "./useMathFocusSession";
import { MATH_FOCUS_LOCK_KEY } from "../../hooks/useFocusLock.storage";

const problems = [
  { num1: 2, num2: 3, operator: "+", answer: 5 },
  { num1: 10, num2: 4, operator: "-", answer: 6 },
];

function renderSession(overrides = {}) {
  const onSessionComplete = vi.fn();

  const hook = renderHook((props) => useMathFocusSession(props), {
    initialProps: {
      problems,
      onSessionComplete,
      ...overrides,
    },
  });

  return { ...hook, onSessionComplete };
}

describe("useMathFocusSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes the first problem", () => {
    const { result } = renderSession();
    expect(result.current.currentProblem).toEqual(problems[0]);
    expect(result.current.canOpen).toBe(true);
    expect(result.current.progress.current).toBe(1);
  });

  it("advances to the next problem", () => {
    const { result } = renderSession();

    act(() => {
      result.current.goNext();
    });

    expect(result.current.problemIndex).toBe(1);
    expect(result.current.currentProblem).toEqual(problems[1]);
  });

  it("completes the session after the final problem", () => {
    const { result, onSessionComplete } = renderSession();

    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });

    expect(onSessionComplete).toHaveBeenCalled();
    expect(result.current.showComplete).toBe(true);
  });

  it("goPrev moves to the previous problem", () => {
    const { result } = renderSession();

    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goPrev();
    });

    expect(result.current.problemIndex).toBe(0);
  });

  it("blocks close when locked", () => {
    const { result } = renderSession();

    act(() => {
      result.current.open();
      result.current.toggleLock();
    });

    expect(result.current.isLocked).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close(true);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("persists lock preference", () => {
    const { result } = renderSession();

    act(() => {
      result.current.toggleLock();
    });

    expect(localStorage.getItem(MATH_FOCUS_LOCK_KEY)).toBe("true");
  });

  it("toggles answer reveal", () => {
    const { result } = renderSession();

    expect(result.current.answerRevealed).toBe(false);

    act(() => {
      result.current.toggleRevealAnswer();
    });

    expect(result.current.answerRevealed).toBe(true);

    act(() => {
      result.current.goNext();
    });

    expect(result.current.answerRevealed).toBe(false);
  });
});
