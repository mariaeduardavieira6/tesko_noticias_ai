const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export async function getJSON<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<T> {
  const url = new URL(path, API_BASE);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value))
        value.forEach((v) => url.searchParams.append(key, String(v)));
      else if (value !== undefined && value !== null && value !== "")
        url.searchParams.set(key, String(value));
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[getJSON] → ${url.toString()}`);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    console.error(
      `[getJSON] ❌ Erro na API: ${res.status} ${res.statusText} - ${url.toString()}`
    );
    throw new Error(`Erro na API: ${res.statusText}`);
  }

  return res.json();
}
