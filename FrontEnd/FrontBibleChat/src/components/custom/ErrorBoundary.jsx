import { ErrorBoundary } from "react-error-boundary";

export function ErrorFallback({ error }) {
  return (
    <div className="p-4 text-red-500 border border-red-200 bg-red-50 rounded">
      <p>Sidebar failed to load.</p>
      <pre className="text-xs">{error.message}</pre>
    </div>
  );
}
