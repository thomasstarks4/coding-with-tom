import { hubTools } from "./hub-tools";

const ROUTE_TO_ID = {
  "/starter": "starter",
  "/writer": "writer",
  "/highlighter": "highlighter",
  "/math": "math",
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
    "Pick a sample sentence or type your own in the practice field.",
    "Choose a pacing mode: Manual, 2 seconds, or 4 seconds.",
    "Click Start fluency practice and have your learner read the highlighted word aloud.",
    "Use Next to advance, Repeat to stay on the same word, or Reset to start over.",
  ],
  math: [
    "Choose a level that matches your learner (1–10, 1–20, or 1–50).",
    "Enter how many problems you want on the worksheet.",
    "Optionally check Include answer key for printing.",
    "Click Generate worksheet, preview the problems, then Print.",
  ],
};

const toolSubtitles = {
  starter: "Choose patterns, then read sentences together with your learner.",
  writer: "Choose topics to print, then practice writing with your learner.",
  highlighter: "Build reading fluency one word at a time.",
  math: "Generate printable addition and subtraction worksheets for Grades 1–2.",
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
