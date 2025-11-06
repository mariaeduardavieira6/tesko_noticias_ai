// components/news-feed.tsx
"use client"

import { ArticleCard } from "@/components/ArticleCard"
import { newsData } from "@/data/news"

interface NewsFeedProps {
  category: string
  sourceFilter?: string
  searchQuery?: string
}

export function NewsFeed({ category, sourceFilter, searchQuery }: NewsFeedProps) {
  let filteredNews = newsData

  if (category !== "Últimas notícias") {
    filteredNews = filteredNews.filter((news) =>
      news.categories?.some((cat) => cat.name === category)
    )
  }

  if (sourceFilter) {
    filteredNews = filteredNews.filter((news) => news.source === sourceFilter)
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    filteredNews = filteredNews.filter((news) => {
      const title = news.title?.toLowerCase() ?? ""
      const summary = news.summary?.toLowerCase() ?? ""
      const categories = (news.categories ?? []).map(c => c.name.toLowerCase()).join(" ")
      const companies = (news.companies ?? []).map(c => c.name.toLowerCase()).join(" ")
      return title.includes(q) || summary.includes(q) || categories.includes(q) || companies.includes(q)
    })
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6">
      {filteredNews.length > 0 ? (
        filteredNews.map((news) => (
          <ArticleCard key={news.id} article={news} />
        ))
      ) : (
        <p className="text-muted-foreground">
          Nenhuma notícia encontrada com os filtros aplicados.
        </p>
      )}
    </div>
  )
}
