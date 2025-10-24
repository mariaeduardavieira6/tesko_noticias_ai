// src/components/ArticleCardSkeleton.tsx

export default function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border p-4">
      <div className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700 mb-3" />
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}