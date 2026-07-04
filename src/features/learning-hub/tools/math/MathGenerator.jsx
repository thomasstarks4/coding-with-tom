import { useCallback, useEffect, useState } from "react";
import { useHubProgress } from "../../hooks/useHubProgress";
import {
  MATH_LEVELS,
  MATH_PRACTICE_SET_SIZE,
  generateProblems,
} from "./generateProblems";
import { useMathFocusSession } from "./useMathFocusSession";
import MathDashboard from "./MathDashboard";
import MathFocusOverlay from "./MathFocusOverlay";
import MathPrintWorksheet from "./MathPrintWorksheet";
import "../../styles/math-print.css";

function createPracticeSet(level) {
  return generateProblems({
    count: MATH_PRACTICE_SET_SIZE,
    level,
  });
}

export default function MathGenerator() {
  const { progress, updateProgress } = useHubProgress();
  const mathProgress = progress.math ?? {};

  const [level, setLevel] = useState(mathProgress.level ?? 1);
  const [numProblems, setNumProblems] = useState(
    mathProgress.numProblems ?? "10",
  );
  const [includeAnswerKey, setIncludeAnswerKey] = useState(
    mathProgress.includeAnswerKey ?? false,
  );
  const [worksheetProblems, setWorksheetProblems] = useState([]);
  const [practiceSet, setPracticeSet] = useState(() => createPracticeSet(level));

  const activeLevel = MATH_LEVELS.find((entry) => entry.level === level);

  const persistMathSettings = useCallback(
    (patch) => {
      updateProgress({
        math: {
          level,
          numProblems,
          includeAnswerKey,
          worksheetsGenerated: mathProgress.worksheetsGenerated ?? 0,
          focusSessionsCompleted: mathProgress.focusSessionsCompleted ?? 0,
          ...patch,
        },
      });
    },
    [
      level,
      numProblems,
      includeAnswerKey,
      mathProgress.focusSessionsCompleted,
      mathProgress.worksheetsGenerated,
      updateProgress,
    ],
  );

  const handleSessionComplete = useCallback(() => {
    persistMathSettings({
      focusSessionsCompleted:
        (mathProgress.focusSessionsCompleted ?? 0) + 1,
    });
  }, [mathProgress.focusSessionsCompleted, persistMathSettings]);

  const focus = useMathFocusSession({
    problems: practiceSet,
    onSessionComplete: handleSessionComplete,
  });

  useEffect(() => {
    setPracticeSet(createPracticeSet(level));
  }, [level]);

  const handleLevelChange = (nextLevel) => {
    setLevel(nextLevel);
    persistMathSettings({ level: nextLevel });
  };

  const handleNumProblemsChange = (value) => {
    setNumProblems(value);
    persistMathSettings({ numProblems: value });
  };

  const handleIncludeAnswerKeyChange = (value) => {
    setIncludeAnswerKey(value);
    persistMathSettings({ includeAnswerKey: value });
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    const generated = generateProblems({
      count: parseInt(numProblems, 10),
      level,
    });
    setWorksheetProblems(generated);
    persistMathSettings({
      worksheetsGenerated: (mathProgress.worksheetsGenerated ?? 0) + 1,
    });
  };

  const handlePrint = () => {
    window.requestAnimationFrame(() => {
      window.print();
    });
  };

  const regeneratePracticeSet = useCallback(() => {
    setPracticeSet(createPracticeSet(level));
    focus.resetForNewSet();
  }, [level, focus]);

  const handleNewPracticeSetFromOverlay = useCallback(() => {
    regeneratePracticeSet();
  }, [regeneratePracticeSet]);

  const handleStartFocus = () => {
    focus.open();
  };

  return (
    <>
      <MathDashboard
        level={level}
        onLevelChange={handleLevelChange}
        numProblems={numProblems}
        onNumProblemsChange={handleNumProblemsChange}
        includeAnswerKey={includeAnswerKey}
        onIncludeAnswerKeyChange={handleIncludeAnswerKeyChange}
        worksheetProblems={worksheetProblems}
        practiceSet={practiceSet}
        activeLevel={activeLevel}
        onGenerate={handleGenerate}
        onPrint={handlePrint}
        canOpenFocus={focus.canOpen}
        hasStartedFocus={focus.hasStarted}
        onStartFocus={handleStartFocus}
        onNewPracticeSet={regeneratePracticeSet}
      />

      <MathFocusOverlay
        {...focus}
        resetForNewSet={handleNewPracticeSetFromOverlay}
      />

      <MathPrintWorksheet
        problems={worksheetProblems}
        activeLevel={activeLevel}
        includeAnswerKey={includeAnswerKey}
      />
    </>
  );
}
