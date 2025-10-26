"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Navbar } from "../components/ui/navbar"; // CORRIGIDO: Importação relativa
import { useArticles, useArticlesRealtime } from "../hooks/useArticles"; // CORRIGIDO: Importação relativa
import type { ArticleOut as Article } from "@/types/article";
import ArticleCard from "../components/ArticleCard"; // CORRIGIDO: Importação relativa
import ArticleCardSkeleton from "../components/ArticleCardSkeleton"; // CORRIGIDO: Importação relativa

// debounce simples
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// helper para deduplicar por id
function dedupeById(arr: Article[]): Article[] {
  const map = new Map<number, Article>();
  for (const a of arr) map.set(a.id, a);
  return Array.from(map.values());
}


export default function Home() {
  useArticlesRealtime();

  // busca + paginação
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [params, setParams] = useState<{ q: string; limit: number; offset: number }>(() => ({
    q: "",
    limit: 12, // <--- MODIFICADO: De 20 para 12
    offset: 0,
  }));

  useEffect(() => {
    setParams((p) => ({ ...p, q: debouncedQ, offset: 0 }));
  }, [debouncedQ]);

  // Hooks (compatível com implementações que retornam refresh OU refetch)
  const result = useArticles(params) as unknown as {
    data?: { items: Article[]; total: number } | Article[];
    isLoading: boolean;
    isError: boolean;
    refresh?: () => Promise<any>;
    refetch?: () => Promise<any>;
  };

  const { data, isLoading, isError, refresh, refetch } = result;
  const doRefetch = refresh ?? refetch;

  // Normaliza o formato da resposta (novo: {items,total} | antigo: Article[])
  const { items, total } = useMemo<{
    items: Article[];
    total: number;
  }>(() => {
    if (Array.isArray(data)) {
      return { items: data, total: data.length };
    }
    return {
      items: data?.items ?? [],
      total: data?.total ?? 0,
    };
  }, [data]);


  // estado com a lista acumulada
  const [list, setList] = useState<Article[]>([]);

  // ao alterar página/consulta, acumula ou reseta
  useEffect(() => {
    if (!data) return;
    setList((prev) => (params.offset === 0 ? items : dedupeById([...prev, ...items])));
  }, [data, items, params.offset]);


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

  // Mudança de isEmpty para checar a lista acumulada
  const isEmpty = !isLoading && !isError && list.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="conteudo" className="flex-1 p-4 md:p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold mb-1 text-foreground">
            Dashboard Tesko Notícias AI
          </h1>
          <p className="text-muted-foreground">
            (Polling a cada 10s e WebSocket em tempo real.)
          </p>
        </header>

        {/* Busca */}
        <section aria-labelledby="busca-titulo" className="flex items-end gap-3">
          <div className="flex-1">
            <label
              id="busca-titulo"
              htmlFor="busca-input"
              className="block text-sm font-medium mb-1"
            >
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
              className="mx-auto rounded-full px-4 py-2 text-sm shadow font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              onClick={async () => {
                setNewCount(0);
                await doRefetch?.();
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

        {/* Lista / Grid */}
        <section aria-busy={isLoading ? "true" : "false"} aria-labelledby="lista-titulo">
          <h2 id="lista-titulo" className="sr-only">
            Lista de Notícias
          </h2>

          {/* Grid de Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Skeletons na primeira carga */}
            {isLoading && params.offset === 0 && (
              <>
                {Array.from({ length: 12 }).map((_, i) => ( 
                  <ArticleCardSkeleton key={`init-${i}`} />
                ))}
              </>
            )}

            {/* Exibe a lista acumulada */}
            {!isError &&
              list.map((article) => <ArticleCard key={article.id} article={article} />)}

            {/* Skeletons durante Carregar mais */}
            {isLoading && params.offset > 0 && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleCardSkeleton key={`more-${i}`} />
                ))}
              </>
            )}

          </div>

          {/* Paginação incremental */}
          <div className="flex justify-center mt-6">
            {(() => {
              // Verifica se há mais itens para carregar
              const hasMore = total > list.length || items.length === params.limit;
              
              // Se não estiver carregando a primeira página e não houver itens, não mostra o botão.
              if (isEmpty) return null;

              return hasMore ? (
                <button
                  className="rounded-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() =>
                    setParams((p) => ({ ...p, offset: p.offset + p.limit }))
                  }
                >
                  {isLoading ? "Carregando..." : "Carregar mais"}
                </button>
              ) : null;
            })()}
          </div>


          {isEmpty && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum artigo encontrado {params.q ? `para "${params.q}"` : ""}.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
