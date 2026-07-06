import { useCallback, useEffect, useState } from "react";
import { useHubProgress } from "../../../hooks/useHubProgress";
import { ATTEMPT_MODES } from "./math-quiz-explanations";
import {
  buildCustomQuiz,
  buildQuizFromPreset,
  clampQuizCount,
} from "./math-quiz-presets";
import { useMathQuizSession } from "./useMathQuizSession";
import MathQuizHome from "./MathQuizHome";
import MathQuizResults from "./MathQuizResults";
import MathQuizSession from "./MathQuizSession";
import "../../../styles/math-quiz.css";

const VIEWS = {
  home: "home",
  session: "session",
  results: "results",
};

export default function MathQuizPage() {
  const { progress, updateProgress } = useHubProgress();
  const mathQuizProgress = progress.mathQuiz ?? {};

  const [view, setView] = useState(VIEWS.home);
  const [attemptMode, setAttemptMode] = useState(
    mathQuizProgress.attemptMode ?? ATTEMPT_MODES.oneMoreChance,
  );
  const [customLevel, setCustomLevel] = useState(
    mathQuizProgress.customLevel ?? 1,
  );
  const [customCount, setCustomCount] = useState(
    String(mathQuizProgress.customCount ?? 10),
  );
  const [problems, setProblems] = useState([]);
  const [quizLabel, setQuizLabel] = useState("");
  const [quizLevel, setQuizLevel] = useState(1);
  const [quizMeta, setQuizMeta] = useState({ type: "custom", presetId: null });
  const [finalScores, setFinalScores] = useState(null);

  const persistMathQuiz = useCallback(
    (patch) => {
      updateProgress({
        mathQuiz: {
          attemptMode,
          customLevel,
          customCount: clampQuizCount(customCount),
          lastPresetId: mathQuizProgress.lastPresetId ?? null,
          quizzesCompleted: mathQuizProgress.quizzesCompleted ?? 0,
          bestScores: mathQuizProgress.bestScores ?? {},
          ...patch,
        },
      });
    },
    [
      attemptMode,
      customCount,
      customLevel,
      mathQuizProgress.bestScores,
      mathQuizProgress.lastPresetId,
      mathQuizProgress.quizzesCompleted,
      updateProgress,
    ],
  );

  const handleQuizComplete = useCallback(
    (summary) => {
      setFinalScores(summary);
      setView(VIEWS.results);

      const bestScores = { ...(mathQuizProgress.bestScores ?? {}) };
      if (quizMeta.type === "preset" && quizMeta.presetId) {
        const previous = bestScores[quizMeta.presetId];
        const improved =
          !previous || summary.finalCorrect > previous.finalCorrect;
        if (improved) {
          bestScores[quizMeta.presetId] = {
            firstTry: summary.firstTryCorrect,
            final: summary.finalCorrect,
            total: summary.total,
            date: Date.now(),
          };
        }
      }

      persistMathQuiz({
        quizzesCompleted: (mathQuizProgress.quizzesCompleted ?? 0) + 1,
        bestScores,
        lastPresetId:
          quizMeta.type === "preset" ? quizMeta.presetId : mathQuizProgress.lastPresetId,
      });
    },
    [
      mathQuizProgress.bestScores,
      mathQuizProgress.lastPresetId,
      mathQuizProgress.quizzesCompleted,
      persistMathQuiz,
      quizMeta,
    ],
  );

  const quiz = useMathQuizSession({
    problems,
    attemptMode,
    onQuizComplete: handleQuizComplete,
  });

  useEffect(() => {
    if (view === VIEWS.session && problems.length > 0) {
      quiz.resetForProblems(problems);
    }
  }, [problems, view]);

  const startQuiz = (nextProblems, label, level, meta) => {
    setProblems(nextProblems);
    setQuizLabel(label);
    setQuizLevel(level);
    setQuizMeta(meta);
    setFinalScores(null);
    setView(VIEWS.session);
  };

  const handleStartPreset = (preset) => {
    persistMathQuiz({ lastPresetId: preset.id });
    startQuiz(
      buildQuizFromPreset(preset),
      preset.title,
      preset.level,
      { type: "preset", presetId: preset.id },
    );
  };

  const handleStartCustom = () => {
    const count = clampQuizCount(customCount);
    const level = customLevel;
    persistMathQuiz({ customLevel: level, customCount: count });
    startQuiz(
      buildCustomQuiz({ level, count }),
      `Custom quiz · Level ${level}`,
      level,
      { type: "custom", presetId: null },
    );
  };

  const handleAttemptModeChange = (mode) => {
    setAttemptMode(mode);
    persistMathQuiz({ attemptMode: mode });
  };

  const handleCustomLevelChange = (level) => {
    setCustomLevel(level);
    persistMathQuiz({ customLevel: level });
  };

  const handleCustomCountChange = (value) => {
    setCustomCount(value);
    persistMathQuiz({ customCount: clampQuizCount(value) });
  };

  const handleTryAgain = () => {
    quiz.practiceAgain();
    setFinalScores(null);
    setView(VIEWS.session);
  };

  const handleNewTest = () => {
    setProblems([]);
    setFinalScores(null);
    setView(VIEWS.home);
  };

  if (view === VIEWS.results && finalScores) {
    return (
      <MathQuizResults
        scores={finalScores}
        attemptMode={attemptMode}
        quizLabel={quizLabel}
        onTryAgain={handleTryAgain}
        onNewTest={handleNewTest}
      />
    );
  }

  if (view === VIEWS.session && problems.length > 0) {
    if (quiz.isComplete && finalScores) {
      return (
        <MathQuizResults
          scores={finalScores}
          attemptMode={attemptMode}
          quizLabel={quizLabel}
          onTryAgain={handleTryAgain}
          onNewTest={handleNewTest}
        />
      );
    }

    return (
      <MathQuizSession
        quizLabel={quizLabel}
        level={quizLevel}
        progress={quiz.progress}
        currentProblem={quiz.currentProblem}
        feedbackPhase={quiz.feedbackPhase}
        validationError={quiz.validationError}
        canAdvance={quiz.canAdvance}
        onSubmitAnswer={quiz.submitAnswer}
        onNext={quiz.goNext}
        onExit={handleNewTest}
      />
    );
  }

  return (
    <MathQuizHome
      attemptMode={attemptMode}
      onAttemptModeChange={handleAttemptModeChange}
      customLevel={customLevel}
      onCustomLevelChange={handleCustomLevelChange}
      customCount={customCount}
      onCustomCountChange={handleCustomCountChange}
      onStartPreset={handleStartPreset}
      onStartCustom={handleStartCustom}
    />
  );
}
