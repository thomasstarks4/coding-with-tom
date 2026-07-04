export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center">
      {title && <h3 className="text-lg font-medium text-zinc-200">{title}</h3>}
      {description && (
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
