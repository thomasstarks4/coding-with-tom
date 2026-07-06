import { hubTools } from "./hub-tools";

const ROUTE_TO_ID = {
  "/starter": "starter",
  "/writer": "writer",
  "/highlighter": "highlighter",
  "/math": "math",
  "/math/quiz": "math-quiz",
};

const toolSteps = {
  starter: [
    "In Configure starters, check the sentence patterns you want active.",
    "Click Start focus session for a fullscreen reading view.",
    "Have your learner read the large sentence aloud.",
    "Tap Got it to move on, or Try again later to practice that sentence again later in the session.",
    "Use the lock icon if your learner might accidentally tap and exit.",
    "Click New set for fresh random words with the same patterns.",
  ],
  writer: [
    "Check the topics you want on the printed worksheet.",
    "Tap a topic to review discussion prompts with your learner.",
    "Mark They wrote about it when your learner completes the topic.",
    "Click Print selected to generate worksheets for checked topics.",
  ],
  highlighter: [
    "Optionally add your own sentence, then click New practice set to load ten sentences.",
    "Choose a pacing mode: Manual, 2 seconds, or 4 seconds.",
    "Click Start focus session for a fullscreen view with the full sentence visible.",
    "The current word is highlighted and enlarged — have your learner read it aloud.",
    "Use Next, Repeat, or Previous, or let auto-pace advance through each sentence.",
    "After all ten sentences, celebrate session complete or practice again.",
    "Use the lock icon if accidental taps are a concern.",
  ],
  math: [
    "Choose a level that matches your learner (1–10, 1–20, or 1–50).",
    "Click Start focus session to practice ten problems together on screen.",
    "Have your learner solve each problem aloud, then tap Next or Reveal answer to check.",
    "Use New practice set to shuffle fresh problems at the same level.",
    "For homework, enter a worksheet size, generate, preview, and Print.",
    "Optionally include an answer key on the printout.",
  ],
  "math-quiz": [
    "Choose an attempt mode that fits your learner before starting.",
    "Pick a predefined test or build a custom quiz with your own level and count.",
    "Have your learner type an answer and tap Check answer.",
    "Use Reveal-style feedback: correct answers celebrate; One more chance shows a tip.",
    "Review the final score and first-try score when the quiz ends.",
    "Try again with the same problems or start a new test.",
  ],
};

const toolSubtitles = {
  starter: "Choose patterns, then read sentences together with your learner.",
  writer: "Choose topics to print, then practice writing with your learner.",
  highlighter: "Build reading fluency one word at a time.",
  math: "Practice on screen or print worksheets for Grades 1–2.",
  "math-quiz": "Type answers, get instant feedback, and see a score at the end.",
};

export const toolGuides = hubTools.reduce((guides, tool) => {
  const id = ROUTE_TO_ID[tool.to];
  if (!id) {
    return guides;
  }

  guides[id] = {
    id,
    title: tool.title,
    subtitle: toolSubtitles[id],
    summary: tool.summary,
    detail: tool.detail,
    bestFor: tool.bestFor,
    steps: toolSteps[id],
  };

  return guides;
}, {});

export function getToolGuide(toolId) {
  return toolGuides[toolId] ?? null;
}

export const TOOL_GUIDE_IDS = Object.keys(toolGuides);
