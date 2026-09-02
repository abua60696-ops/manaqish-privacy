export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 shadow-card">
          <div className="skeleton w-full aspect-square bg-neutral-200 dark:bg-neutral-700" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="skeleton h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="skeleton h-9 w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-800 shadow-card p-4 space-y-3">
      <div className="skeleton h-32 w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      <div className="skeleton h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="skeleton h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  )
}
