import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useHighlighterFocusSession } from "./useHighlighterFocusSession";
import { HIGHLIGHTER_FOCUS_LOCK_KEY } from "../../hooks/useFocusLock.storage";

const words = ["The", "cat", "sat"];

function renderSession(overrides = {}) {
  const onComplete = vi.fn();

  const hook = renderHook(
    (props) => useHighlighterFocusSession(props),
    {
      initialProps: {
        words,
        text: "The cat sat",
        paceKey: "manual",
        onComplete,
        ...overrides,
      },
    },
  );

  return { ...hook, onComplete };
}

describe("useHighlighterFocusSession", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes the first word as current", () => {
    const { result } = renderSession();
    expect(result.current.currentWord).toBe("The");
    expect(result.current.canOpen).toBe(true);
  });

  it("advances with goNext and clamps at end", () => {
    const { result } = renderSession();

    act(() => {
      result.current.goNext();
    });
    expect(result.current.currentWord).toBe("cat");

    act(() => {
      result.current.goNext();
      result.current.goNext();
    });
    expect(result.current.currentWord).toBe("sat");
  });

  it("goPrev clamps at zero", () => {
    const { result } = renderSession();

    act(() => {
      result.current.goPrev();
    });
    expect(result.current.currentIndex).toBe(0);
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

    expect(localStorage.getItem(HIGHLIGHTER_FOCUS_LOCK_KEY)).toBe("true");
  });

  it("auto-advances on slow pace when focus is open", () => {
    const { result } = renderSession({ paceKey: "slow" });

    act(() => {
      result.current.open();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.currentIndex).toBe(1);
  });
});
