"use client";
export default function ErrorArticle({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-2">Não foi possível carregar o artigo.</h2>
      <p className="text-sm text-gray-600 mb-4">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 rounded-lg bg-black text-white">Tentar novamente</button>
    </div>
  );
}
