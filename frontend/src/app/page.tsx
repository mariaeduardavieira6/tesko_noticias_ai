"use client"

import { useState } from "react"
import { NewsFeed } from "@/components/news-feed"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["Últimas notícias", "Lançamentos", "Pesquisas", "Ferramentas", "Políticas"]

export default function Home({
  searchParams
}: {
  searchParams?: {
    source?: string
  }
}) {
  const [activeTab, setActiveTab] = useState("Últimas notícias")
  const sourceFilter = searchParams?.source

  return (
    <>
      <div className="container mx-auto max-w-screen-xl w-full px-4 md:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 h-auto justify-start bg-transparent p-0 border-b border-border rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  text-xs md:text-sm text-muted-foreground
                  rounded-none border-b-2 border-transparent
                  px-4 py-3
                    /* Estilos da aba ativa */
                  data-[state=active]:border-b-blue-600
                  dark:data-[state=active]:border-b-purple-500
                  data-[state=active]:text-foreground
                  data-[state=active]:shadow-none
                    /* --- NOVO HOVER: Texto Gradiente --- */
                    /* Remove o fundo cinza/branco do hover */
                    /* hover:bg-gray-100 dark:hover:bg-gray-800/50 */
                    /* Deixa o texto transparente no hover */
                    hover:text-transparent
                    /* Aplica o gradiente como fundo do texto */
                    hover:bg-clip-text
                    hover:bg-gradient-to-r hover:from-cyan-400 hover:via-purple-500 hover:to-magenta-500
                    /* Mantém transição suave */
                    transition-colors duration-150
                "
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <NewsFeed category={activeTab} sourceFilter={sourceFilter} />
      </div>
    </>
  )
}
