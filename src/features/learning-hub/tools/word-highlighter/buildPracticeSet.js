import { PRACTICE_SET_SIZE, sampleSentences } from "../../data/fluency-samples";

function shuffleArray(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function buildPracticeSet({
  customSentence = "",
  pool = sampleSentences,
  size = PRACTICE_SET_SIZE,
  shuffle = true,
} = {}) {
  const trimmedCustom = customSentence.trim();
  const seen = new Set();
  const result = [];

  if (trimmedCustom) {
    seen.add(trimmedCustom);
    result.push(trimmedCustom);
  }

  const candidates = shuffle ? shuffleArray(pool) : [...pool];

  for (const sentence of candidates) {
    if (result.length >= size) {
      break;
    }
    if (!seen.has(sentence)) {
      seen.add(sentence);
      result.push(sentence);
    }
  }

  for (const sentence of pool) {
    if (result.length >= size) {
      break;
    }
    if (!seen.has(sentence)) {
      seen.add(sentence);
      result.push(sentence);
    }
  }

  return result.slice(0, size);
}
