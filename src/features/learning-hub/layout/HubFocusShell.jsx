import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Lock, Unlock, X } from "lucide-react";
import "./hub-focus.css";

export default function HubFocusShell({
  isOpen,
  isLocked,
  onClose,
  onToggleLock,
  labelledBy,
  children,
  actions,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isLocked) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isLocked, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!isLocked) {
      onClose();
    }
  };

  const content = (
    <div
      className="hub-focus-overlay hub-no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <header className="hub-focus-toolbar">
        <button
          type="button"
          onClick={onToggleLock}
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
          onClick={() => onClose()}
          disabled={isLocked}
          aria-label="Exit focus session"
          className="inline-flex min-h-[var(--hub-touch-min)] items-center justify-center rounded-lg px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={20} />
        </button>
      </header>

      <div className="hub-focus-backdrop" onClick={handleBackdropClick}>
        <div
          className="hub-focus-content"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>

      {actions ? (
        <div
          className="hub-focus-actions"
          onClick={(event) => event.stopPropagation()}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );

  return createPortal(content, document.body);
}
