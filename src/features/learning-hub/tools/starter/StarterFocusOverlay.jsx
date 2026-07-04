import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, RefreshCw, Unlock, X } from "lucide-react";
import "./starter-focus.css";

function ProgressDots({ total, readCount, hasCurrent }) {
  if (total === 0) {
    return null;
  }

  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, index) => {
        let className = "starter-focus-dot";
        if (index < readCount) {
          className += " starter-focus-dot--read";
        } else if (hasCurrent && index === readCount) {
          className += " starter-focus-dot--current";
        }
        return <span key={index} className={className} />;
      })}
    </div>
  );
}

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
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isLocked) {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isLocked, close]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!isLocked) {
      close();
    }
  };

  const content = (
    <div
      className="starter-focus-overlay hub-no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby={showComplete ? "focus-complete-title" : "focus-sentence"}
    >
      <header className="starter-focus-toolbar">
        <button
          type="button"
          onClick={toggleLock}
          aria-pressed={isLocked}
          aria-label={isLocked ? "Unlock screen" : "Lock screen"}
          className="inline-flex min-h-[var(--hub-touch-min)] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
          <span className="hidden sm:inline">
            {isLocked ? "Locked" : "Lock"}
          </span>
        </button>

        {isLocked ? (
          <p className="text-xs text-slate-500">Tap lock to exit</p>
        ) : (
          <span className="text-xs text-slate-500" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={() => close()}
          disabled={isLocked}
          aria-label="Exit focus session"
          className="inline-flex min-h-[var(--hub-touch-min)] items-center justify-center rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={20} />
        </button>
      </header>

      <div className="starter-focus-backdrop" onClick={handleBackdropClick}>
        <div
          className="starter-focus-content"
          onClick={(event) => event.stopPropagation()}
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
                  className="text-3xl font-bold text-emerald-800 sm:text-4xl"
                >
                  Session complete!
                </h2>
                <p className="mt-3 max-w-md text-base text-slate-600 sm:text-lg">
                  Every sentence was read successfully. Nice work.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => close(true)}
                    className="starter-focus-action-btn rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
                  >
                    Exit to dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNewSet();
                      close(true);
                    }}
                    className="starter-focus-action-btn inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
                className="starter-focus-sentence-animate flex w-full flex-col items-center"
              >
                <p
                  id="focus-sentence"
                  className="starter-focus-sentence px-2"
                >
                  {currentCard?.sentence}
                </p>

                <p className="mt-6 text-sm font-medium text-slate-500">
                  {Math.min(progress.current, progress.total)} of{" "}
                  {progress.total}
                </p>

                <ProgressDots
                  total={progress.total}
                  readCount={progress.read}
                  hasCurrent={Boolean(currentCard)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!showComplete && currentCard ? (
        <div
          className="starter-focus-actions"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={markRead}
            className="starter-focus-action-btn rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={tryAgainLater}
            className="starter-focus-action-btn rounded-xl border border-sky-300 bg-sky-50 px-6 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
          >
            Try again later
          </button>
        </div>
      ) : null}
    </div>
  );

  return createPortal(content, document.body);
}
