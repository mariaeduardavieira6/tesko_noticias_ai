import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export type Category = { id: number; name: string };
export type Company = { id: number; name: string };
export type Article = {
  id: number;
  title: string;
  summary: string;
  url: string;
  image_url?: string;
  published_at: string;
  categories: Category[];
  companies: Company[];
};

export function useArticles(params: {
  q?: string;
  category?: string[];
  company?: string[];
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => getJSON<Article[]>("/api/articles", params),
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
    staleTime: 5_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getJSON<Category[]>("/api/categories"),
    staleTime: 60_000,
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getJSON<Company[]>("/api/companies"),
    staleTime: 60_000,
  });
}

/**
 * Tempo real opcional via WebSocket.
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

      // --- ⬇️ AQUI ESTÁ A CORREÇÃO DEFINITIVA ⬇️ ---
      // Força a conexão a ir para a porta 8000 (FastAPI)
      // em vez de usar 'location.host' (porta 3000, Next.js)

      // 1. Pega o protocolo (ws:// ou wss://)
      const wsProtocol = (location.protocol === "https:" ? "wss://" : "ws://");
      
      // 2. Pega o hostname (ex: 'localhost'), IGNORANDO a porta
      const host = location.hostname; 
      
      // 3. Constrói a URL forçando a porta 8000 (onde o FastAPI está)
      const wsUrl = `${wsProtocol}${host}:8000/api/ws`;
      // Resultado: "ws://localhost:8000/api/ws"
      // --- ⬆️ FIM DA CORREÇÃO ⬆️ ---


      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Opcional: Adicionar logs para depuração
      ws.onopen = () => {
        console.log("Conexão WebSocket estabelecida com sucesso!");
      };

      ws.onmessage = (ev) => {
        console.log("Mensagem recebida do WebSocket:", ev.data);
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === "NEW_ARTICLES") {
            console.log("Mensagem NEW_ARTICLES recebida! Invalidando cache...");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
          }
        } catch {
          // mensagens não-JSON (p.ex. "pong")
        }
      };

      ws.onerror = (err) => {
        console.error("Erro no WebSocket:", err);
        ws.close(); // força onclose e reconexão
      };

      ws.onclose = () => {
        if (stopped) return;
        console.log("Conexão WebSocket fechada. Tentando reconectar em 5s...");
        reconnectTimer.current = window.setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      console.log("Fechando conexão WebSocket (componente desmontado).");
      wsRef.current?.close();
    };
  }, [queryClient, enabled]);
}