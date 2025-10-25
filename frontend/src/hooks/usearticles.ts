import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// ——— Tipos ———
export type Category = { id: number; name: string };
export type Company = { id: number; name: string };

export type Article = {
  id: number;
  title: string;
  summary: string;
  url: string;
  // Normalizamos imagem para sempre existir em "image"
  image?: string;
  // campos brutos vindos do back (alguns seeds usam image, outros image_url)
  image_url?: string;
  published_at: string;
  categories: Category[];
  companies: Company[];
};

type ListParams = {
  q?: string;
  category?: string[];
  company?: string[];
  limit?: number;
  offset?: number;
};

// ——— Utils ———
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

// monta URL com query-params (suporta arrays)
function buildUrl(path: string, params?: Record<string, any>) {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, String(val)));
      else if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

// ——— Hooks ———

// Lista de artigos com paginação correta (usa x-total-count)
export function useArticles(params: ListParams) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: async () => {
      const url = buildUrl("/api/articles", params);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar artigos");
      const raw: (Article & { image?: string; image_url?: string })[] = await res.json();

      // Normaliza imagem para sempre usar "image"
      const items: Article[] = raw.map((a) => ({
        ...a,
        image: a.image ?? a.image_url ?? undefined,
      }));

      const total = Number(res.headers.get("x-total-count") ?? items.length);
      return { items, total };
    },
    refetchInterval: 10_000,        // polling
    refetchOnWindowFocus: true,
    staleTime: 5_000,
  });
}

// Categorias
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(buildUrl("/api/categories"), { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data: Category[] = await res.json();
      return data;
    },
    staleTime: 60_000,
  });
}

// Empresas
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch(buildUrl("/api/companies"), { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar empresas");
      const data: Company[] = await res.json();
      return data;
    },
    staleTime: 60_000,
  });
}

/**
 * Tempo real via WebSocket com fallback por variável de ambiente.
 * Em produção, defina NEXT_PUBLIC_WS_URL (ex.: wss://seu-backend.onrailway.app/api/ws)
 */
export function useArticlesRealtime(enabled = true) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let stopped = false;

    const connect = () => {
      if (stopped) return;

      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ??
        `${location.protocol === "https:" ? "wss://" : "ws://"}${location.hostname}:8000/api/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (process.env.NODE_ENV === "development") {
          console.log("[WS] conectado:", wsUrl);
        }
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === "NEW_ARTICLES") {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
          }
        } catch {
          // mensagens não-JSON (ex.: ping/pong), ignorar
        }
      };

      ws.onerror = () => {
        ws.close(); // dispara onclose e reconexão
      };

      ws.onclose = () => {
        if (stopped) return;
        reconnectTimer.current = window.setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [queryClient, enabled]);
}
