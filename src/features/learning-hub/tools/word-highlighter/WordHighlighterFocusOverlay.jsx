import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import HubFocusShell from "../../layout/HubFocusShell";
import HubFocusProgressDots from "../../layout/HubFocusProgressDots";

export default function WordHighlighterFocusOverlay({
  isOpen,
  close,
  isLocked,
  toggleLock,
  currentWord,
  showComplete,
  progress,
  goNext,
  goPrev,
  repeatWord,
  practiceAgain,
}) {
  return (
    <HubFocusShell
      isOpen={isOpen}
      isLocked={isLocked}
      onClose={close}
      onToggleLock={toggleLock}
      labelledBy={showComplete ? "highlighter-complete-title" : "highlighter-word"}
      actions={
        !showComplete ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={progress.current <= 1}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={repeatWord}
              className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
            >
              <RotateCcw size={16} />
              Repeat
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
            <h2
              id="highlighter-complete-title"
              className="text-3xl font-bold text-emerald-800 sm:text-4xl"
            >
              Sentence complete!
            </h2>
            <p className="mt-3 max-w-md text-base text-slate-600 sm:text-lg">
              Nice reading. Try another sentence or practice this one again.
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`${currentWord}-${progress.current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="hub-focus-hero-animate flex w-full flex-col items-center"
          >
            <p id="highlighter-word" className="hub-focus-hero px-2">
              {currentWord}
            </p>

            <p className="mt-6 text-sm font-medium text-slate-500">
              {progress.current} of {progress.total}
            </p>

            <HubFocusProgressDots
              total={progress.total}
              doneCount={progress.current - 1}
              hasCurrent={Boolean(currentWord)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </HubFocusShell>
  );
}
