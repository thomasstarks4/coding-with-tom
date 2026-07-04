import { hubTools } from "./hub-tools";

const ROUTE_TO_ID = {
  "/tuner": "tuner",
  "/starter": "starter",
  "/writer": "writer",
  "/highlighter": "highlighter",
  "/math": "math",
};

const toolSteps = {
  tuner: [
    "Review the list of sentence starter patterns and check the ones you want active.",
    "Use Select All or Clear All for quick setup, or toggle individual starters.",
    "Your choices save automatically — look for the Saved indicator.",
    "Open Sentence Starter when you are ready to practice with your learner.",
  ],
  starter: [
    "Configure starters in Sentence Tuner first so the set matches your learner.",
    "Click New set if you want fresh random words with the same starters.",
    "Work through sentences in the Not read container.",
    "Tap a sentence after your learner reads it aloud.",
    "Mark Yes to move it to Read, or Try again to practice that sentence later.",
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
  tuner: "Choose which sentence starters appear in Sentence Starter.",
  starter: "Guided read-aloud practice with sentences from your tuned starters.",
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
