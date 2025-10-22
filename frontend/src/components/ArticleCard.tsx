// src/components/ArticleCard.tsx
import { Article } from "@/hooks/usearticles";

export default function ArticleCard({ a }: { a: Article }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{a.title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{a.summary}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {a.categories.map(c => (
          <span key={c.id} className="text-xs px-2 py-1 rounded-full border">{c.name}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {a.companies.map(c => (
          <span key={c.id} className="text-xs px-2 py-1 rounded-full bg-muted">{c.name}</span>
        ))}
      </div>

      <div className="text-xs mt-3 opacity-70">
        {new Date(a.published_at).toLocaleString()}
      </div>

      <a href={a.url} target="_blank" className="text-sm mt-3 inline-block underline">
        Ver fonte
      </a>
    </div>
  );
}
