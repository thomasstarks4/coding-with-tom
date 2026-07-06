import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useToolGuide } from "./useToolGuide";
import {
  HUB_GUIDE_KEY,
  loadToolGuides,
  markToolGuideSeen,
} from "./useToolGuide.storage";

describe("useToolGuide", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts expanded when the guide has not been seen", () => {
    const { result } = renderHook(() => useToolGuide("starter"));

    expect(result.current.isExpanded).toBe(true);
    expect(result.current.hasBeenSeen).toBe(false);
  });

  it("persists seen state and starts collapsed on remount", () => {
    const { result, unmount } = renderHook(() => useToolGuide("starter"));

    act(() => {
      result.current.markSeen();
    });

    expect(loadToolGuides().seen.starter).toBe(true);

    unmount();

    const { result: remounted } = renderHook(() => useToolGuide("starter"));
    expect(remounted.current.isExpanded).toBe(false);
    expect(remounted.current.hasBeenSeen).toBe(true);
  });

  it("can reopen with toggle without clearing seen state", () => {
    markToolGuideSeen("writer");

    const { result } = renderHook(() => useToolGuide("writer"));
    expect(result.current.isExpanded).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isExpanded).toBe(true);
    expect(localStorage.getItem(HUB_GUIDE_KEY)).toContain('"writer":true');
  });

  it("marks seen when collapsing via toggle", () => {
    const { result } = renderHook(() => useToolGuide("math"));

    act(() => {
      result.current.toggle();
    });

    expect(loadToolGuides().seen.math).toBe(true);
    expect(result.current.isExpanded).toBe(false);
  });

  it("migrates legacy tuner seen flag to starter on load", () => {
    localStorage.setItem(
      HUB_GUIDE_KEY,
      JSON.stringify({ seen: { tuner: true, starter: false } }),
    );

    const guides = loadToolGuides();

    expect(guides.seen.starter).toBe(true);
    expect(guides.seen.tuner).toBeUndefined();
    expect(JSON.parse(localStorage.getItem(HUB_GUIDE_KEY)).seen.tuner).toBeUndefined();
  });
});
