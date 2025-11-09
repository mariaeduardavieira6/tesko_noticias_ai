// src/components/ArticleCardSkeleton.tsx
export default function ArticleCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-4">
      <div className="skeleton-block h-40 w-full rounded-xl mb-4" />
      <div className="skeleton-line h-4 w-3/4 rounded mb-2" />
      <div className="skeleton-line h-4 w-1/2 rounded" />
      <div className="mt-4 h-px w-full bg-border/60" />
      <div className="mt-3 flex gap-2">
        <div className="skeleton-circle h-8 w-8" />
        <div className="skeleton-circle h-8 w-8" />
        <div className="ml-auto skeleton-circle h-8 w-8" />
      </div>
    </div>
  )
}
