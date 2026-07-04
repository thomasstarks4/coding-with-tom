export default function HubFocusProgressDots({ total, doneCount, hasCurrent }) {
  if (total === 0) {
    return null;
  }

  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, index) => {
        let className = "hub-focus-dot";
        if (index < doneCount) {
          className += " hub-focus-dot--done";
        } else if (hasCurrent && index === doneCount) {
          className += " hub-focus-dot--current";
        }
        return <span key={index} className={className} />;
      })}
    </div>
  );
}
