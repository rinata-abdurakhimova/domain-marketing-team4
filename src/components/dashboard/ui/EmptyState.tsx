export function EmptyState({ message = "No data for the selected filters." }: { message?: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 text-center">
      <span className="text-2xl">⚪</span>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
