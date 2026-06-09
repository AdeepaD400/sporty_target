export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-2xl dark:bg-teal-900/40">
        ⚽
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No sports yet</h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
        Add your first sport using the panel on the left, then schedule practice slots on the calendar.
      </p>
    </div>
  );
}
