// src/components/news-feed.tsx
"use client"

import { ArticleCard } from "@/components/ArticleCard"
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton"
import { newsData } from "@/data/news"
import { Suspense } from "react"

interface NewsFeedProps {
  category: string
  sourceFilter?: string
  searchQuery?: string
}

type LocalNews = {
  id: number | string
  title: string
  description: string
  image?: string | null
  imageUrl?: string | null
  url?: string | null
  date: string
  category: string
  source: string
}

export function NewsFeed({ category, sourceFilter, searchQuery }: NewsFeedProps) {
  let items = (newsData as unknown as LocalNews[]) ?? []

  if (category && category !== "Últimas notícias") {
    items = items.filter((n) => n.category === category)
  }
  if (sourceFilter) {
    items = items.filter((n) => n.source === sourceFilter)
  }
  if (searchQuery && searchQuery.trim()) {
    const term = searchQuery.toLowerCase()
    items = items.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        (n.description || "").toLowerCase().includes(term)
    )
  }

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      {/* Menos colunas nas telas grandes -> cards maiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
        {items.length ? (
          items.map((n) => {
            const article = {
              id: typeof n.id === "string" ? n.id : Number(n.id),
              title: n.title,
              summary: n.description,
              url: n.url ?? "#",
              image: n.image ?? n.imageUrl ?? null,
              image_url: null,
              published_at: n.date,
              categories: [{ id: 1, name: n.category }],
              companies: undefined,
              source: n.source,
            }
            return (
              <div key={String(n.id)} className="h-full">
                <ArticleCard article={article as any} />
              </div>
            )
          })
        ) : (
          <p className="col-span-full text-muted-foreground">
            Nenhuma notícia encontrada com os filtros aplicados.
          </p>
        )}
      </div>
    </Suspense>
  )
}
