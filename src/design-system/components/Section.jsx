export default function Section({ children, className = "", title, subtitle }) {
  return (
    <section className={className}>
      {(title || subtitle) && (
        <header className="mb-6">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
