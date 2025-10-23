export default function LoadingArticle() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="h-8 w-2/3 rounded bg-gray-300 mb-4" />
      <div className="h-4 w-1/2 rounded bg-gray-300 mb-6" />
      <div className="h-64 w-full rounded bg-gray-300 mb-6" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-300" />
        <div className="h-4 w-5/6 rounded bg-gray-300" />
        <div className="h-4 w-4/6 rounded bg-gray-300" />
      </div>
    </div>
  );
}
