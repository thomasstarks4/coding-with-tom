import { useCallback, useMemo, useState } from "react";
import HubToolPageHeader from "../../layout/HubToolPageHeader";
import { useHubProgress } from "../../hooks/useHubProgress";
import { sampleSentences } from "../../data/fluency-samples";
import { tokenizeText } from "./tokenizeText";
import { useHighlighterFocusSession } from "./useHighlighterFocusSession";
import WordHighlighterDashboard from "./WordHighlighterDashboard";
import WordHighlighterFocusOverlay from "./WordHighlighterFocusOverlay";

export default function WordHighlighter() {
  const { progress, updateProgress } = useHubProgress();
  const [text, setText] = useState(
    progress.highlighter.lastSentence || sampleSentences[0],
  );
  const [paceKey, setPaceKey] = useState("manual");

  const words = useMemo(() => tokenizeText(text), [text]);

  const handleComplete = useCallback(
    (wordCount) => {
      updateProgress({
        highlighter: {
          ...progress.highlighter,
          lastSentence: text,
          wordsCompleted: wordCount,
        },
      });
    },
    [progress.highlighter, text, updateProgress],
  );

  const focus = useHighlighterFocusSession({
    words,
    text,
    paceKey,
    onComplete: handleComplete,
  });

  const persistSentence = useCallback(
    (sentence) => {
      updateProgress({
        highlighter: {
          ...progress.highlighter,
          lastSentence: sentence,
          wordsCompleted: 0,
        },
      });
    },
    [progress.highlighter, updateProgress],
  );

  const handleTextChange = (value) => {
    setText(value);
    persistSentence(value);
    focus.resetForNewText();
  };

  const handlePracticeAgain = () => {
    focus.practiceAgain();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-1 sm:px-0">
      <HubToolPageHeader toolId="highlighter" />

      <WordHighlighterDashboard
        text={text}
        onTextChange={handleTextChange}
        paceKey={paceKey}
        onPaceChange={setPaceKey}
        wordCount={words.length}
        canOpenFocus={focus.canOpen}
        hasStarted={focus.hasStarted}
        onStartFocus={focus.open}
      />

      <WordHighlighterFocusOverlay
        {...focus}
        practiceAgain={handlePracticeAgain}
      />
    </div>
  );
}
