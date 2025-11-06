// Em: components/news-feed.tsx
"use client"

import { NewsCard } from "@/components/card"
import { newsData } from "@/data/news"

interface NewsFeedProps {
  category: string
  sourceFilter?: string
  searchQuery?: string
}

export function NewsFeed({ category, sourceFilter, searchQuery }: NewsFeedProps) {
  let filteredNews = newsData

  // Filtro Categoria
  if (category !== "Últimas notícias") {
    filteredNews = filteredNews.filter((news) => news.category === category)
  }

  // Filtro Fonte
  if (sourceFilter) {
    filteredNews = filteredNews.filter((news) => news.source === sourceFilter)
  }
  
  // Filtro por busca (título/descrição)
  // searchQuery é opcional e pode vir do Header/HomeClient
  // Se não vier, simplesmente ignoramos
  if (searchQuery && searchQuery.trim()) {
    const term = searchQuery.toLowerCase()
    filteredNews = filteredNews.filter(
      (n) => n.title.toLowerCase().includes(term) || n.description.toLowerCase().includes(term)
    )
  }

  return (
    // <-- MUDANÇA: Voltamos para no máximo 4 colunas em telas XL.
    // Isso vai deixar os cards MAIS LARGOS.
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"> 
      
      {filteredNews.length > 0 ? (
        filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))
      ) : (
        <p className="text-gray-400">
          Nenhuma notícia encontrada com os filtros aplicados.
        </p>
      )}

    </div>
  )
}
