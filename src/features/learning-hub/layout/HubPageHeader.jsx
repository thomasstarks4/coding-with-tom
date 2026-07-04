export default function HubPageHeader({ title, subtitle, children }) {
  return (
    <header className="hub-page-header mx-auto mb-8 max-w-3xl text-center">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  );
}
