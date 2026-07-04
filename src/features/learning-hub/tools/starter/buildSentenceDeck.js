import { vocabulary } from "../../data/vocabulary";

function getRandomWord(partnerType) {
  const words = vocabulary[partnerType] || [];
  if (words.length === 0) {
    return "word";
  }
  return words[Math.floor(Math.random() * words.length)];
}

function formatSentence(text, word) {
  let sentence = `${text} ${word}`;

  if (sentence[0] === sentence[0].toLowerCase()) {
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  if (!sentence.match(/[.!?]$/)) {
    sentence += ".";
  }

  return sentence;
}

export function getShownStarterFingerprint(startersSelected) {
  if (!startersSelected || typeof startersSelected !== "object") {
    return "";
  }

  return Object.keys(startersSelected)
    .filter((key) => startersSelected[key]?.isShown)
    .sort()
    .join(",");
}

export function buildSentenceDeck(startersSelected) {
  if (!startersSelected || typeof startersSelected !== "object") {
    return [];
  }

  return Object.keys(startersSelected)
    .filter((key) => startersSelected[key]?.isShown)
    .map((key) => {
      const starter = startersSelected[key];
      return {
        id: key,
        sentence: formatSentence(starter.text, getRandomWord(starter.partnerType)),
      };
    });
}
