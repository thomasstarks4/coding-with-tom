import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useHighlighterFocusSession } from "./useHighlighterFocusSession";
import { HIGHLIGHTER_FOCUS_LOCK_KEY } from "../../hooks/useFocusLock.storage";

const sentences = ["The cat sat.", "We like dogs."];

function renderSession(overrides = {}) {
  const onSentenceComplete = vi.fn();
  const onSessionComplete = vi.fn();

  const hook = renderHook(
    (props) => useHighlighterFocusSession(props),
    {
      initialProps: {
        sentences,
        paceKey: "manual",
        onSentenceComplete,
        onSessionComplete,
        ...overrides,
      },
    },
  );

  return { ...hook, onSentenceComplete, onSessionComplete };
}

describe("useHighlighterFocusSession", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes the first word of the first sentence", () => {
    const { result } = renderSession();
    expect(result.current.currentWord).toBe("The");
    expect(result.current.canOpen).toBe(true);
    expect(result.current.progress.sentence.current).toBe(1);
  });

  it("advances to the next sentence after the last word", () => {
    const { result, onSentenceComplete } = renderSession();

    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });

    expect(onSentenceComplete).toHaveBeenCalledWith(0);
    expect(result.current.sentenceIndex).toBe(1);
    expect(result.current.currentWord).toBe("We");
  });

  it("completes the session after the final sentence", () => {
    const { result, onSessionComplete } = renderSession();

    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });

    expect(onSessionComplete).toHaveBeenCalled();
    expect(result.current.showComplete).toBe(true);
  });

  it("goPrev moves to the previous sentence last word", () => {
    const { result } = renderSession();

    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goNext();
    });
    act(() => {
      result.current.goPrev();
    });

    expect(result.current.sentenceIndex).toBe(0);
    expect(result.current.currentWord).toBe("sat.");
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
