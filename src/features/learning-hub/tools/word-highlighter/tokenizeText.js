export function tokenizeText(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  return text.trim().split(/\s+/).filter(Boolean);
}

export function clampWordIndex(index, wordCount) {
  if (wordCount <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), wordCount - 1);
}
