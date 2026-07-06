import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import HubFocusShell from "../../layout/HubFocusShell";
import HubFocusProgressDots from "../../layout/HubFocusProgressDots";

export default function StarterFocusOverlay({
  isOpen,
  close,
  isLocked,
  toggleLock,
  currentCard,
  showComplete,
  progress,
  markRead,
  tryAgainLater,
  onNewSet,
}) {
  return (
    <HubFocusShell
      isOpen={isOpen}
      isLocked={isLocked}
      onClose={close}
      onToggleLock={toggleLock}
      labelledBy={showComplete ? "focus-complete-title" : "focus-sentence"}
      actions={
        !showComplete && currentCard ? (
          <>
            <button
              type="button"
              onClick={markRead}
              className="hub-focus-action-btn rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Got it
            </button>
            <button
              type="button"
              onClick={tryAgainLater}
              className="hub-focus-action-btn rounded-xl border border-sky-300 bg-sky-50 px-6 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
            >
              Try again later
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
              id="focus-complete-title"
              className="hub-focus-complete-title"
            >
              Session complete!
            </h2>
            <p className="hub-focus-complete-body mt-3">
              Every sentence was read successfully. Nice work.
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
                onClick={() => {
                  onNewSet();
                  close(true);
                }}
                className="hub-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                New set
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentCard?.id ?? "empty"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="hub-focus-hero-animate flex w-full flex-col items-center"
          >
            <p id="focus-sentence" className="hub-focus-hero px-2">
              {currentCard?.sentence}
            </p>

            <p className="hub-focus-meta mt-6">
              {Math.min(progress.current, progress.total)} of {progress.total}
            </p>

            <HubFocusProgressDots
              total={progress.total}
              doneCount={progress.read}
              hasCurrent={Boolean(currentCard)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </HubFocusShell>
  );
}
