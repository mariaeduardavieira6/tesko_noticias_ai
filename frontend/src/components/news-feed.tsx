// Em: components/news-feed.tsx
"use client"

import { ArticleCard } from "./ArticleCard"
import ArticleCardSkeleton from "./ArticleCardSkeleton"
import { useArticles } from "@/hooks/usearticles"
import type { NewsArticle } from "@/types/news"

interface NewsFeedProps {
  category: string
  sourceFilter?: string
  searchQuery?: string
}

export function NewsFeed({ category, sourceFilter, searchQuery }: NewsFeedProps) {
  const { data, isLoading, error } = useArticles({
    q: searchQuery,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-full">
            <ArticleCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (error || !data?.items) {
    return (
      <p className="col-span-full text-muted-foreground">
        Não foi possível carregar as notícias.
      </p>
    )
  }

  let items = (data.items || []) as NewsArticle[]

  // Filtro Categoria (pela API)
  if (category !== "Últimas notícias") {
    items = items.filter((n) =>
      n.categories?.some((c: any) => c.name === category)
    )
  }
  
  // Filtro Fonte (pela API)
  if (sourceFilter) {
    // 📍 CORREÇÃO 1: Removido o 's' extra
    items = items.filter((n) =>
      n.companies?.some((c: any) => c.name === sourceFilter)
    )
  }
  
  // Filtro de busca (backup no cliente)
  // 📍 CORREÇÃO 2: Removida a checagem '!data.fromApi'
  if (searchQuery && searchQuery.trim()) {
    const term = searchQuery.toLowerCase()
    items = items.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        (n.summary || "").toLowerCase().includes(term)
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
      {items.length ? (
        items.map((article) => {
          return (
            <div key={String(article.id)} className="h-full">
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
  )
}