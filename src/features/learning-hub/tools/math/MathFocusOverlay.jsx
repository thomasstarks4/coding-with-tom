import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RefreshCw, RotateCcw } from "lucide-react";
import HubFocusShell from "../../layout/HubFocusShell";
import HubFocusProgressDots from "../../layout/HubFocusProgressDots";
import { formatProblem } from "./generateProblems";

function FocusProblem({ problem, problemKey, answerRevealed }) {
  return (
    <motion.div
      key={problemKey}
      id="math-focus-problem"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="hub-focus-hero-animate flex w-full flex-col items-center px-2"
    >
      <pre className="hub-focus-math-problem">{formatProblem(problem)}</pre>
      <AnimatePresence>
        {answerRevealed ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="hub-focus-math-answer mt-6"
          >
            Answer: {problem.answer}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MathFocusOverlay({
  isOpen,
  close,
  isLocked,
  toggleLock,
  currentProblem,
  problemIndex,
  showComplete,
  progress,
  answerRevealed,
  toggleRevealAnswer,
  goNext,
  goPrev,
  repeatProblem,
  practiceAgain,
  resetForNewSet,
  isAtStart,
  repeatNonce,
}) {
  return (
    <HubFocusShell
      isOpen={isOpen}
      isLocked={isLocked}
      onClose={close}
      onToggleLock={toggleLock}
      labelledBy={showComplete ? "math-complete-title" : "math-focus-problem"}
      actions={
        !showComplete && currentProblem ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={isAtStart}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={repeatProblem}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
            >
              <RotateCcw size={16} />
              Repeat
            </button>
            <button
              type="button"
              onClick={toggleRevealAnswer}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100"
            >
              {answerRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
              {answerRevealed ? "Hide answer" : "Reveal answer"}
            </button>
            <button
              type="button"
              onClick={goNext}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {showComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <h2 id="math-complete-title" className="hub-focus-complete-title">
              Session complete!
            </h2>
            <p className="hub-focus-complete-body mt-3">
              You worked through all {progress.total} problems. Nice work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => close(true)}
                className="hub-focus-action-btn rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
              >
                Exit to dashboard
              </button>
              <button
                type="button"
                onClick={practiceAgain}
                className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Practice again
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForNewSet();
                }}
                className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-6 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
              >
                <RefreshCw size={16} />
                New practice set
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`problem-${problemIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full flex-col items-center"
          >
            <p className="hub-focus-label mb-4">
              Problem {progress.current} of {progress.total}
            </p>

            <AnimatePresence mode="wait">
              {currentProblem ? (
                <FocusProblem
                  problem={currentProblem}
                  problemKey={`${problemIndex}-${repeatNonce}`}
                  answerRevealed={answerRevealed}
                />
              ) : null}
            </AnimatePresence>

            <HubFocusProgressDots
              total={progress.total}
              doneCount={progress.current - 1}
              hasCurrent={Boolean(currentProblem)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </HubFocusShell>
  );
}
