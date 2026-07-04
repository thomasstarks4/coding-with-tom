import { Link } from "react-router-dom";
import PageShell from "../../design-system/components/PageShell";
import Button from "../../design-system/components/Button";

export default function ErrorPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-500">
          404
        </p>
        <h1 className="mb-4 text-3xl font-bold text-white">Page not found</h1>
        <p className="mb-8 text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button to="/">Back to home</Button>
      </div>
    </PageShell>
  );
}
