export default function Tag({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-300 ${className}`}
    >
      {children}
    </span>
  );
}
