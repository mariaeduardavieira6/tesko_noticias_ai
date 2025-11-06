// Cole isto em: components/home-client.tsx

"use client"

import { NewsFeed } from "@/components/news-feed"

// A interface agora recebe o NOVO `categoryFilter` que vem da URL
interface HomeClientProps {
  sourceFilter?: string;
  searchQuery?: string;
  categoryFilter: string; // <-- NOVO
}

export function HomeClient({ sourceFilter, searchQuery, categoryFilter }: HomeClientProps) {
  
  // O `HomeClient` não controla mais o estado da TAB.
  // Ele simplesmente passa a categoria (que veio da URL) para o NewsFeed.
  
  return (
    <div className="container mx-auto max-w-screen-xl w-full px-4 md:px-8 pt-8 pb-8">
      
      {/* Os <Tabs> foram removidos daqui e movidos para o Header */}
      
      <NewsFeed 
        category={categoryFilter} // <-- Passa a categoria da URL
        sourceFilter={sourceFilter} 
        searchQuery={searchQuery} 
      />
    </div>
  )
}