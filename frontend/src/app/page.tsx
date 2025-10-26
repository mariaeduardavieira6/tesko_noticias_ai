"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/ui/navbar"; // Este está CORRETO, não mude
import { useArticles, useArticlesRealtime, Article } from "@/hooks/useArticles";
import ArticleCard from "@/components/ArticleCard"; // [CORREÇÃO] Removido /ui
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton"; // [CORREÇÃO] Removido /ui

// ... (o resto do seu código)

// debounce simples
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  useArticlesRealtime();

  // busca + paginação
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [params, setParams] = useState<{ q: string; limit: number; offset: number }>({
    q: "",
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    setParams((p) => ({ ...p, q: debouncedQ, offset: 0 }));
  }, [debouncedQ]);

  const { data, isLoading, isError, refetch } = useArticles(params);

  // 🔧 compatível com os dois formatos:
  // - NOVO: { items, total }
  // - ANTIGO: Article[]
  const items: Article[] = Array.isArray(data) ? (data as Article[]) : (data?.items ?? []);
  const total: number = Array.isArray(data) ? items.length : (data?.total ?? 0);

  // detectar novas notícias
  const lastSnapshotRef = useRef<string>("");
  const [newCount, setNewCount] = useState(0);
  useEffect(() => {
    const idsSorted = [...items.map((a) => a.id)].sort();
    const snapshot = JSON.stringify(idsSorted);
    if (!lastSnapshotRef.current) {
      lastSnapshotRef.current = snapshot;
      return;
    }
    if (snapshot !== lastSnapshotRef.current) {
      const prevIds: (string | number)[] = JSON.parse(lastSnapshotRef.current);
      const prev = new Set(prevIds);
      let diff = 0;
      for (const id of idsSorted) if (!prev.has(id)) diff++;
      setNewCount(diff);
      lastSnapshotRef.current = snapshot;
    }
  }, [items]);

  // paginação correta (usa total do header)
  const start = params.offset + 1;
  const end = Math.min(params.offset + items.length, total || params.offset + items.length);
  const canGoPrev = params.offset > 0;
  const canGoNext = total ? params.offset + params.limit < total : items.length >= params.limit;

  const goPrev = () =>
    setParams((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }));
  const goNext = () =>
    setParams((p) => ({ ...p, offset: p.offset + p.limit }));

  const isEmpty = !isLoading && !isError && items.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="conteudo" className="flex-1 p-4 md:p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold mb-1 text-foreground">Dashboard Tesko Notícias AI</h1>
          <p className="text-muted-foreground">(Polling a cada 10s e WebSocket em tempo real.)</p>
        </header>

        {/* Busca */}
        <section aria-labelledby="busca-titulo" className="flex items-end gap-3">
          <div className="flex-1">
            <label id="busca-titulo" htmlFor="busca-input" className="block text-sm font-medium mb-1">
              Buscar notícias
            </label>
            <input
              id="busca-input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Digite um termo (ex.: OpenAI, GPT, NVIDIA)"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              aria-describedby="busca-dica"
            />
            <p id="busca-dica" className="mt-1 text-xs text-muted-foreground">
              A busca é aplicada automaticamente (com leve atraso).
            </p>
          </div>
        </section>

        {/* Novas notícias */}
        <div role="status" aria-live="polite" className="flex justify-center">
          {newCount > 0 && (
            <button
              className="mx-auto rounded-full px-4 py-2 text-sm shadow font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2"
              onClick={async () => {
                setNewCount(0);
                await refetch?.();
              }}
            >
              Ver {newCount} {newCount === 1 ? "nova notícia" : "novas notícias"}
            </button>
          )}
        </div>

        {isError && (
          <p role="alert" className="text-red-600">
            Ocorreu um erro ao carregar as notícias. Tente novamente.
          </p>
        )}

        {/* Grid (ESSA PARTE ESTAVA FALTANDO) */}
        <section aria-busy={isLoading ? "true" : "false"} aria-labelledby="lista-titulo">
          <h2 id="lista-titulo" className="sr-only">
            Lista de Notícias
          </h2>

          {/* Grid de Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading && (
              <>
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
              </>
            )}

            {!isLoading && !isError && items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {isEmpty && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum artigo encontrado {params.q ? `para "${params.q}"` : ""}.
            </p>
          )}

        {/* [CORREÇÃO] As tags de fechamento que faltavam */}
        </section>
      </main>
    </div>
  );
}