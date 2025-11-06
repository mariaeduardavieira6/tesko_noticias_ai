"use client";

import Link from "next/link";

// Usa o tipo declarado em data/news.ts para compatibilidade com o mock
import type { NewsArticle } from "@/data/news";

type Props = {
  news: NewsArticle;
};

export function NewsCard({ news }: Props) {
  const displayDate = new Date(news.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Link
      href={`/articles/${news.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={news.image}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
          {news.category}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="text-xs text-muted-foreground">
          <span>{news.source}</span>
          <span className="mx-1.5">•</span>
          <span>{displayDate}</span>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {news.title}
        </h3>

        {news.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {news.description}
          </p>
        )}

        <span className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-purple-400">
          Ler mais
        </span>
      </div>
    </Link>
  );
}

export default NewsCard;

