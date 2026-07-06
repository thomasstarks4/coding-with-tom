import { useCallback, useMemo, useState } from "react";
import { ATTEMPT_MODES } from "./math-quiz-explanations";
import { gradeAnswer } from "./gradeAnswer";

function createEmptyResult() {
  return {
    firstTryCorrect: null,
    finalCorrect: false,
    attempts: 0,
    resolved: false,
    missed: false,
  };
}

function summarizeResults(results, problems) {
  const total = problems.length;
  const firstTryCorrect = results.filter((r) => r.firstTryCorrect === true).length;
  const finalCorrect = results.filter((r) => r.finalCorrect).length;
  const missed = results
    .map((result, index) => ({
      index,
      problem: problems[index],
      result,
    }))
    .filter(({ result }) => result?.resolved && !result.finalCorrect);

  return {
    total,
    firstTryCorrect,
    finalCorrect,
    missed,
    firstTryPercent: total > 0 ? Math.round((firstTryCorrect / total) * 100) : 0,
    finalPercent: total > 0 ? Math.round((finalCorrect / total) * 100) : 0,
  };
}

export function useMathQuizSession({ problems, attemptMode, onQuizComplete }) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [results, setResults] = useState(() =>
    problems.map(() => createEmptyResult()),
  );
  const [feedbackPhase, setFeedbackPhase] = useState("idle");
  const [validationError, setValidationError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentProblem = problems[problemIndex] ?? null;
  const currentResult = results[problemIndex] ?? createEmptyResult();

  const scores = useMemo(
    () => summarizeResults(results, problems),
    [results, problems],
  );

  const resetForProblems = useCallback((nextProblems) => {
    setProblemIndex(0);
    setResults(nextProblems.map(() => createEmptyResult()));
    setFeedbackPhase("idle");
    setValidationError(null);
    setIsComplete(false);
  }, []);

  const updateResult = useCallback((index, patch) => {
    setResults((prev) =>
      prev.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...patch } : entry,
      ),
    );
  }, []);

  const resolveProblem = useCallback(
    (index, patch) => {
      setResults((prev) => {
        const nextResults = prev.map((entry, entryIndex) =>
          entryIndex === index
            ? { ...entry, ...patch, resolved: true }
            : entry,
        );

        if (index >= problems.length - 1) {
          const summary = summarizeResults(nextResults, problems);
          setIsComplete(true);
          onQuizComplete?.(summary);
        }

        return nextResults;
      });
    },
    [onQuizComplete, problems],
  );

  const submitAnswer = useCallback(
    (input) => {
      if (!currentProblem || currentResult.resolved || isComplete) {
        return { ok: false };
      }

      const graded = gradeAnswer(input, currentProblem.answer);
      if (!graded.valid) {
        setValidationError(graded.error);
        return { ok: false, error: graded.error };
      }

      setValidationError(null);
      const nextAttempts = currentResult.attempts + 1;
      const isFirstTry = currentResult.attempts === 0;

      if (graded.correct) {
        const firstTryCorrect = isFirstTry
          ? true
          : currentResult.firstTryCorrect === true;

        setFeedbackPhase("success");
        resolveProblem(problemIndex, {
          attempts: nextAttempts,
          firstTryCorrect,
          finalCorrect: true,
          missed: false,
        });
        return { ok: true, correct: true };
      }

      if (isFirstTry) {
        updateResult(problemIndex, {
          firstTryCorrect: false,
          attempts: nextAttempts,
        });
      } else {
        updateResult(problemIndex, { attempts: nextAttempts });
      }

      if (attemptMode === ATTEMPT_MODES.singleAttempt) {
        setFeedbackPhase("wrong");
        resolveProblem(problemIndex, {
          firstTryCorrect: false,
          finalCorrect: false,
          missed: true,
          attempts: 1,
        });
        return { ok: true, correct: false, canAdvance: true };
      }

      if (attemptMode === ATTEMPT_MODES.oneMoreChance) {
        if (nextAttempts === 1) {
          setFeedbackPhase("explanation");
          return { ok: true, correct: false, showExplanation: true };
        }

        setFeedbackPhase("wrong");
        resolveProblem(problemIndex, {
          firstTryCorrect: false,
          finalCorrect: false,
          missed: true,
          attempts: nextAttempts,
        });
        return { ok: true, correct: false, canAdvance: true };
      }

      setFeedbackPhase("wrong");
      return { ok: true, correct: false };
    },
    [
      attemptMode,
      currentProblem,
      currentResult,
      isComplete,
      problemIndex,
      resolveProblem,
      updateResult,
    ],
  );

  const goNext = useCallback(() => {
    if (!currentResult.resolved || isComplete) {
      return;
    }

    if (problemIndex >= problems.length - 1) {
      return;
    }

    setProblemIndex((index) => index + 1);
    setFeedbackPhase("idle");
    setValidationError(null);
  }, [currentResult.resolved, isComplete, problemIndex, problems.length]);

  const practiceAgain = useCallback(() => {
    resetForProblems(problems);
  }, [problems, resetForProblems]);

  return {
    problemIndex,
    currentProblem,
    currentResult,
    feedbackPhase,
    validationError,
    isComplete,
    scores,
    progress: {
      current: problemIndex + 1,
      total: problems.length,
    },
    canAdvance: currentResult.resolved && !isComplete,
    submitAnswer,
    goNext,
    practiceAgain,
    resetForProblems,
  };
}
