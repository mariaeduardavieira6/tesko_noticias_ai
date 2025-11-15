// app/page.tsx
"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NewsFeed } from "@/components/news-feed"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["Últimas notícias", "Lançamentos", "Pesquisas", "Ferramentas", "Políticas"]

// 📍 CORREÇÃO 1: Removidos 'searchParams' dos props.
// A função 'Home' agora não recebe props.
export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams() // Este hook é a única fonte de dados da URL

  // 📍 CORREÇÃO 2: Lendo os params *apenas* do hook 'params'.
  const sourceFilter = params.get("source") ?? undefined
  const searchQuery = params.get("q") ?? undefined
  const initialCategory = params.get("category") ?? "Últimas notícias"

  const [activeTab, setActiveTab] = useState(initialCategory)

  // se a URL mudar externamente, espelha no estado
  useEffect(() => {
    setActiveTab(initialCategory)
  }, [initialCategory])

  const setCategoryInUrl = (next: string) => {
    const sp = new URLSearchParams(params.toString() ?? "") // Usando 'params' do hook
    if (next === "Últimas notícias") sp.delete("category")
    else sp.set("category", next)
    // preserva ?source e ?q
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  return (
    <>
      {/* filete abaixo do cabeçalho */}
      <div className="h-px w-full bg-border/70" />

      {/* categorias bem próximas do header */}
      <div className="container mx-auto max-w-screen-xl w-full px-4 md:px-8 mt-2 md:mt-3">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v)
            setCategoryInUrl(v)
          }}
          className="w-full"
        >
          {/* Você já tinha corrigido a responsividade das abas, ótimo! */}
          <TabsList className="h-auto justify-start bg-transparent p-0 border-b border-border rounded-none mb-2 md:mb-3 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                aria-current={activeTab === tab ? "page" : undefined}
                className="
                  text-xs md:text-sm text-muted-foreground
                  rounded-none border-b-2 border-transparent
                  px-4 py-3
                  data-[state=active]:border-b-blue-600
                  dark:data-[state=active]:border-b-purple-500
                  data-[state=active]:text-foreground
                  data-[state=active]:shadow-none
                  hover:text-transparent hover:bg-clip-text
                  hover:bg-gradient-to-r hover:from-cyan-400 hover:via-purple-500 hover:to-magenta-500
                  transition-colors duration-150
                "
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* feed logo abaixo das categorias */}
      <div className="container mx-auto max-w-screen-xl w-full px-4 md:px-8">
        <NewsFeed
          category={activeTab}
          sourceFilter={sourceFilter}
          searchQuery={searchQuery}
        />
      </div>
    </>
  )
}