export const HUB_GUIDE_KEY = "tlh-tool-guides";

const defaultGuides = {
  seen: {},
};

export function loadToolGuides() {
  try {
    const raw = localStorage.getItem(HUB_GUIDE_KEY);
    if (!raw) {
      return { ...defaultGuides, seen: {} };
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultGuides,
      seen: typeof parsed.seen === "object" && parsed.seen !== null ? parsed.seen : {},
    };
  } catch {
    return { ...defaultGuides, seen: {} };
  }
}

export function saveToolGuides(guides) {
  localStorage.setItem(HUB_GUIDE_KEY, JSON.stringify(guides));
}

export function hasSeenToolGuide(toolId, guides = loadToolGuides()) {
  return Boolean(guides.seen[toolId]);
}

export function markToolGuideSeen(toolId, guides = loadToolGuides()) {
  const next = {
    ...guides,
    seen: {
      ...guides.seen,
      [toolId]: true,
    },
  };
  saveToolGuides(next);
  return next;
}
