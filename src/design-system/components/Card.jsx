export default function Card({ children, className = "", as: Tag = "div" }) {
  return (
    <Tag
      className={`rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
