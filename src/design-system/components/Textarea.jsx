export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600 ${className}`}
      {...props}
    />
  );
}
