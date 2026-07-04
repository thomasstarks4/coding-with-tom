export default function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-500" />
        Loading…
      </div>
    </div>
  );
}
