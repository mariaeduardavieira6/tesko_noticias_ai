// src/app/page.tsx
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { useArticles } from "@/hooks/usearticles";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  // estado da busca e paginação
  const [q, setQ] = useState("");
  const [params, setParams] = useState({ q: "", limit: 20, offset: 0 });

  // dados da API
  const { data, isLoading, isError } = useArticles(params);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Dashboard Tesko Notícias AI
        </h1>
        <p className="mb-6 text-muted-foreground">
          (Agora consumindo a API: busca e lista de cards.)
        </p>

        {/* Barra de busca */}
        <div className="flex gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar (título, resumo, conteúdo)…"
            className="flex-1 border rounded-xl px-3 py-2 bg-background"
          />
          <button
            onClick={() => setParams((p) => ({ ...p, q, offset: 0 }))}
            className="px-4 py-2 rounded-xl border"
          >
            Buscar
          </button>
        </div>

        {/* Estados de carregamento/erro */}
        {isLoading && <p>Carregando…</p>}
        {isError && <p className="text-red-500">Erro ao carregar.</p>}

        {/* Grid de cards (Pinterest-like responsivo) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((a) => <ArticleCard key={a.id} a={a} />)}
        </div>

        {/* Paginação simples */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() =>
              setParams((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))
            }
            disabled={params.offset === 0}
            className="px-3 py-1 border rounded-xl disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setParams((p) => ({ ...p, offset: p.offset + p.limit }))
            }
            className="px-3 py-1 border rounded-xl"
          >
            Próxima
          </button>
        </div>
      </main>
    </div>
  );
}

