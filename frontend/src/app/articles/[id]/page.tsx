// app/noticia/[id]/page.tsx

// REMOVIDO: import { newsData } from "@/data/news"
// REMOVIDO: import type { NewsArticle } from "@/data/news"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import {
  AudioWaveform,
  Download,
  ArrowLeft,
  X,
  Linkedin,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// -----------------------------
// DATA - (MODIFICADO)
// -----------------------------
async function getNewsById(id: string) {
  try {
    // 1. Busca o artigo principal pela ID
    // Usamos 'cache: "no-store"' para garantir que pegamos dados novos
    const articleRes = await fetch(`http://localhost:8000/api/articles/${id}`, {
      cache: "no-store",
    })
    if (!articleRes.ok) return null
    // Definimos o tipo 'any' aqui por enquanto, para aceitar os dados da API
    const article: any = await articleRes.json()

    // 2. Busca artigos para "Mais Notícias"
    const relatedRes = await fetch(`http://localhost:8000/api/articles?limit=4`, {
      cache: "no-store",
    })
    if (!relatedRes.ok) {
      // Se a busca de relacionados falhar, pelo menos mostre o artigo principal
      return { article, relatedNews: [] }
    }

    const allNews = await relatedRes.json()

    // Filtra para não mostrar o artigo atual na lista de "Mais Notícias"
    const relatedNews = allNews
      .filter((news: any) => news.id.toString() !== id)
      .slice(0, 3) // Garante que teremos no máximo 3

    return { article, relatedNews }
  } catch (error) {
    console.error("Falha ao buscar dados da API:", error)
    return null
  }
}

// -----------------------------
// PAGE
// -----------------------------
export default async function NoticiaPage({ params }: { params: { id: string } }) {
  const data = await getNewsById(params.id)
  if (!data) notFound()

  const { article, relatedNews } = data
  // Ajuste para o nome da coluna da API (category -> categories[0].name)
  // Fazendo uma verificação segura
  const categoryName =
    article.categories && article.categories.length > 0
      ? article.categories[0].name
      : "Notícia"
      
  // Ajuste para o nome da coluna da API (date -> published_at)
  const displayDate = new Date(article.published_at).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  // Ajuste para o nome da coluna da API (source -> companies[0].name)
  const sourceName =
    article.companies && article.companies.length > 0
      ? article.companies[0].name
      : "Tesko AI"

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto max-w-screen-xl px-4 py-12 flex-1">
        <main className="max-w-5xl mx-auto">
          <Button
            asChild
            variant="ghost"
            className="mb-8 text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Link>
          </Button>

          {/* Cabeçalho */}
          <div className="space-y-4 mb-6">
            <Badge className="bg-gradient-to-r from-cyan-500 via-purple-600 to-magenta-600 text-white border-none text-sm font-bold shadow-lg">
              {categoryName} {/* Atualizado */}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-base font-medium text-foreground">
                {sourceName} {/* Atualizado */}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-base text-muted-foreground">
                {displayDate} {/* Atualizado */}
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 my-8">
            {/* BOTÃO DE ÁUDIO (MODIFICADO) */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-purple-600 to-magenta-600 text-white shadow-lg glow-brand"
            >
              <a href={article.audio} target="_blank" rel="noopener noreferrer">
                <AudioWaveform className="w-5 h-5 mr-2" />
                Ouvir a Notícia
              </a>
            </Button>

            {/* BOTÃO DE PDF (MODIFICADO) */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-foreground border-border glow-brand border-gradient"
            >
              {/* Usamos article.pdf e 'download' para forçar o download */}
              <a href={article.pdf} download="TeskoNoticia.pdf">
                <Download className="w-5 h-5 mr-2 icon-gradient" />
                Download PDF
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-foreground border-border glow-brand border-gradient"
            >
              {/* Usamos article.url (do banco de dados) para a fonte */}
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2 icon-gradient" />
                Ver Fonte Original
              </a>
            </Button>
          </div>

          {/* Imagem do Artigo – agora com glow */}
          <div className="w-full rounded-2xl overflow-hidden border border-border my-10 card-glow glow-brand">
            <img
              src={article.image_url || article.image} // Usando o campo da API
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Conteúdo */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-p:text-muted-foreground prose-a:text-blue-600 hover:prose-a:text-blue-800 dark:prose-invert dark:prose-a:text-purple-400 dark:hover:prose-a:text-purple-300"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />

          {/* Compartilhar */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Compartilhar esta notícia
            </h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="text-muted-foreground border-border glow-brand border-gradient"
              >
                <X className="w-4 h-4 mr-2 icon-gradient" /> Twitter
              </Button>
              <Button
                variant="outline"
                className="text-muted-foreground border-border glow-brand border-gradient"
              >
                <Linkedin className="w-4 h-4 mr-2 icon-gradient" /> LinkedIn
              </Button>
              <Button
                variant="outline"
                className="text-muted-foreground border-border glow-brand border-gradient"
              >
                <Copy className="w-4 h-4 mr-2 icon-gradient" /> Copiar Link
              </Button>
            </div>
          </div>
        </main>

        {/* Mais Notícias */}
        <aside className="max-w-screen-xl mx-auto mt-20 pt-12 border-t border-border">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Mais Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* O NewsCard agora vai receber o tipo de dado da API */}
            {relatedNews.map((news: any) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}