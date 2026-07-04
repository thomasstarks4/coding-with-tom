import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useStarterFocusSession } from "./useStarterFocusSession";
import { FOCUS_LOCK_KEY } from "./useStarterFocusSession.storage";

const deck = [
  { id: "a", sentence: "I can see the cat." },
  { id: "b", sentence: "We like dogs." },
  { id: "c", sentence: "She is happy." },
];

function renderSession(overrides = {}) {
  const onMarkRead = vi.fn();
  const onTryAgainLater = vi.fn();

  const hook = renderHook(
    (props) => useStarterFocusSession(props),
    {
      initialProps: {
        deck,
        notRead: deck,
        read: [],
        onMarkRead,
        onTryAgainLater,
        ...overrides,
      },
    },
  );

  return { ...hook, onMarkRead, onTryAgainLater };
}

describe("useStarterFocusSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes the first not-read card as current", () => {
    const { result } = renderSession();
    expect(result.current.currentCard).toEqual(deck[0]);
    expect(result.current.canOpen).toBe(true);
  });

  it("calls onMarkRead with the current card id", () => {
    const { result, onMarkRead } = renderSession();

    act(() => {
      result.current.markRead();
    });

    expect(onMarkRead).toHaveBeenCalledWith("a");
  });

  it("calls onTryAgainLater with the current card id", () => {
    const { result, onTryAgainLater } = renderSession();

    act(() => {
      result.current.tryAgainLater();
    });

    expect(onTryAgainLater).toHaveBeenCalledWith("a");
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

    expect(localStorage.getItem(FOCUS_LOCK_KEY)).toBe("true");
  });

  it("shows completion when queue is empty while open", () => {
    const { result, rerender } = renderSession();

    act(() => {
      result.current.open();
    });

    rerender({
      deck,
      notRead: [],
      read: deck,
      onMarkRead: vi.fn(),
      onTryAgainLater: vi.fn(),
    });

    expect(result.current.showComplete).toBe(true);
  });
});
