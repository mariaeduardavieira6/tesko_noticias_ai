// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
// 1. 'Link' foi REMOVIDO daqui
import { Navbar } from "@/components/navbar";

// 2. 'useArticlesRealtime' está importado
import { useArticles, Article, useArticlesRealtime } from "@/hooks/useArticles";

import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";

export default function Home() {

  // 3. Hook do WebSocket está ATIVO
  useArticlesRealtime();

  const [q, setQ] = useState("");
  const [params, setParams] = useState({ q: "", limit: 20, offset: 0 });

  const { data, isLoading, isError } = useArticles(params);
  const articles = data ?? []; 

  const lastSnapshotRef = useRef<string>("");
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const snapshot = JSON.stringify(articles.map(a => a.id).sort());
    if (!lastSnapshotRef.current) {
      lastSnapshotRef.current = snapshot;
      return;
    }
    if (snapshot !== lastSnapshotRef.current) {
      const prev = new Set(JSON.parse(lastSnapshotRef.current));
      const curr = new Set(articles.map(a => a.id));
      let diff = 0;
      for (const id of curr) {
        if (!prev.has(id)) diff++;
      }
      setNewCount(diff); 
      lastSnapshotRef.current = snapshot;
    }
  }, [articles]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Dashboard Tesko Notícias AI
          </h1>
          <p className="text-muted-foreground">
            (Polling a cada 10s e WebSocket em tempo real.)
          </p>
        </div>

        <div className="flex gap-3">{/* ... Barra de busca ... */}</div>

        {newCount > 0 && (
          <button
            className="mx-auto block rounded-full px-4 py-2 text-sm shadow font-medium bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setNewCount(0)}
          >
            {newCount} {newCount === 1 ? "nova notícia" : "novas notícias"}
          </button>
        )}

        {isError && <p className="text-red-500">Erro ao carregar.</p>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))
            : articles.map((a) => (
                // 4. CORRIGIDO: O <Link> FOI REMOVIDO DAQUI
                // A key foi passada direto para o ArticleCard
                <ArticleCard key={a.id} article={a} />
              ))}
        </div>

        <div className="flex gap-2 mt-6">{/* ... Paginação ... */}</div>
      </main>
    </div>
  );
}