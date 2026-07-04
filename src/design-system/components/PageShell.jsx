import NavBar from "./NavBar";
import Container from "./Container";

export default function PageShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-zinc-950 ${className}`}>
      <NavBar />
      <main className="py-12 md:py-16">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
