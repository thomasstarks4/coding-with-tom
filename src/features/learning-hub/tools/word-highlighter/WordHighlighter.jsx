import { useCallback, useState } from "react";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import { useHubProgress } from "../../hooks/useHubProgress";
import { sampleSentences } from "../../data/fluency-samples";
import { buildPracticeSet } from "./buildPracticeSet";
import { useHighlighterFocusSession } from "./useHighlighterFocusSession";
import WordHighlighterDashboard from "./WordHighlighterDashboard";
import WordHighlighterFocusOverlay from "./WordHighlighterFocusOverlay";

function createPracticeSet(customSentence) {
  return buildPracticeSet({
    customSentence,
    pool: sampleSentences,
  });
}

export default function WordHighlighter() {
  const { progress, updateProgress } = useHubProgress();
  const [customText, setCustomText] = useState(
    progress.highlighter.lastSentence || "",
  );
  const [paceKey, setPaceKey] = useState("manual");
  const [practiceSet, setPracticeSet] = useState(() =>
    createPracticeSet(progress.highlighter.lastSentence || ""),
  );

  const handleSessionComplete = useCallback(() => {
    updateProgress({
      highlighter: {
        ...progress.highlighter,
        lastSentence: customText.trim() || practiceSet[0] || "",
        wordsCompleted: practiceSet.length,
      },
    });
  }, [customText, practiceSet, progress.highlighter, updateProgress]);

  const focus = useHighlighterFocusSession({
    sentences: practiceSet,
    paceKey,
    onSessionComplete: handleSessionComplete,
  });

  const regeneratePracticeSet = useCallback(() => {
    setPracticeSet(createPracticeSet(customText));
    focus.resetForNewSet();
  }, [customText, focus]);

  const handleCustomTextChange = (value) => {
    setCustomText(value);
    updateProgress({
      highlighter: {
        ...progress.highlighter,
        lastSentence: value,
        wordsCompleted: 0,
      },
    });
  };

  const handlePracticeAgain = () => {
    focus.practiceAgain();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-1 sm:px-0">
      <HubToolPageHeader toolId="highlighter" />

      <WordHighlighterDashboard
        customText={customText}
        onCustomTextChange={handleCustomTextChange}
        practiceSet={practiceSet}
        paceKey={paceKey}
        onPaceChange={setPaceKey}
        canOpenFocus={focus.canOpen}
        hasStarted={focus.hasStarted}
        onStartFocus={focus.open}
        onNewPracticeSet={regeneratePracticeSet}
      />

      <WordHighlighterFocusOverlay
        {...focus}
        practiceAgain={handlePracticeAgain}
      />
    </div>
  );
}
