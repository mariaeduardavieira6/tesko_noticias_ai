// 1. A URL base agora está "forçada" (hardcoded) para http://localhost:8000
//    Isso ignora a variável de ambiente (process.env) que pode estar mal configurada.
const API_BASE = "http://localhost:8000";

export async function getJSON<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach(v => url.searchParams.append(key, String(v)));
      else if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    });
  }

  // 2. ADICIONADO: Log de depuração para vermos o fetch acontecendo
  console.log(`[getJSON] Fazendo fetch para: ${url.toString()}`);

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    // 3. ADICIONADO: Log de erro mais detalhado
    console.error(`[getJSON] Erro na API: ${res.status} ${res.statusText} - URL: ${url.toString()}`);
    throw new Error(`Erro na API: ${res.statusText}`);
  }

  return res.json();
}