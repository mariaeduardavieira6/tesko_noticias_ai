// Cole isto em: app/page.tsx

// A MUDANÇA É AQUI: O "HomeClient" é o novo nome do "chefe" do cliente
import { HomeClient } from "@/components/home-client"

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ 
    source?: string; 
    q?: string;
    // === NOVO CAMPO ===
    category?: string; 
  }>
}) {
  const resolved = (await searchParams?.catch?.(() => undefined)) ?? undefined
  const source = resolved?.source
  const q = resolved?.q
  // === NOVO CAMPO ===
  // Passa a categoria da URL para o cliente, ou usa "Últimas notícias" como padrão
  const category = resolved?.category ?? "Últimas notícias"

  return (
    <HomeClient 
      sourceFilter={source} 
      searchQuery={q} 
      // === NOVO CAMPO ===
      categoryFilter={category}
    />
  )
}