import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import HubFocusShell from "../../layout/HubFocusShell";
import HubFocusProgressDots from "../../layout/HubFocusProgressDots";

function FocusSentence({ words, currentIndex, sentenceKey }) {
  return (
    <motion.p
      key={sentenceKey}
      id="highlighter-sentence"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="hub-focus-sentence hub-focus-hero-animate px-2"
    >
      {words.map((word, index) => {
        const isCurrent = index === currentIndex;
        const isRead = index < currentIndex;

        let className = "hub-focus-word";
        if (isCurrent) {
          className += " hub-focus-word--current";
        } else if (isRead) {
          className += " hub-focus-word--read";
        }

        return (
          <motion.span
            key={`${index}-${word}`}
            layout
            aria-current={isCurrent ? "true" : undefined}
            animate={{
              scale: isCurrent ? 1.28 : 1,
              y: isCurrent ? -2 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
            }}
            className={className}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.p>
  );
}

export default function WordHighlighterFocusOverlay({
  isOpen,
  close,
  isLocked,
  toggleLock,
  words,
  currentIndex,
  sentenceIndex,
  currentSentence,
  showComplete,
  progress,
  goNext,
  goPrev,
  repeatWord,
  practiceAgain,
  isAtStart,
}) {
  return (
    <HubFocusShell
      isOpen={isOpen}
      isLocked={isLocked}
      onClose={close}
      onToggleLock={toggleLock}
      labelledBy={showComplete ? "highlighter-complete-title" : "highlighter-sentence"}
      actions={
        !showComplete ? (
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
              Session complete!
            </h2>
            <p className="mt-3 max-w-md text-base text-slate-600 sm:text-lg">
              You read all {progress.sentence.total} sentences. Nice work.
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
            key={`sentence-${sentenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full flex-col items-center"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-sky-700">
              Sentence {progress.sentence.current} of {progress.sentence.total}
            </p>

            <AnimatePresence mode="wait">
              <FocusSentence
                words={words}
                currentIndex={currentIndex}
                sentenceKey={`${sentenceIndex}-${currentSentence}`}
              />
            </AnimatePresence>

            <p className="mt-8 text-sm font-medium text-slate-500">
              Word {progress.word.current} of {progress.word.total}
            </p>

            <HubFocusProgressDots
              total={progress.word.total}
              doneCount={progress.word.current - 1}
              hasCurrent={words.length > 0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </HubFocusShell>
  );
}
