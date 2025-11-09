// src/components/ArticleCard.tsx
import Link from "next/link"
import { Share2, Linkedin, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/types/news"

type Props = { article: NewsArticle }

export function ArticleCard({ article }: Props) {
  const categoryName = article.categories?.[0]?.name ?? "Notícia"
  const imgSrc =
    article.image_url || article.image || "https://placehold.co/800x450/jpg"

  const displayDate = new Date(article.published_at).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  )

  const openExternal = (
    e: React.MouseEvent,
    url: string | null | undefined
  ) => {
    e.preventDefault()
    e.stopPropagation()
    if (url) window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Link
      href={`/articles/${article.id}`}
      className={`
        group relative flex h-full flex-col overflow-hidden
        rounded-[20px] border border-border bg-card/90
        transition-all duration-300 ease-out
        on-card-hover-ring
      `}
    >
      {/* Imagem (vertical, altura reduzida) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={imgSrc}
          alt={article.title}
          className="img-fill object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* fade para legibilidade */}
        <div className="card-image-fade" />

        {/* Badge da categoria (reage ao hover do CARD) */}
        <span
          className={`
            absolute left-4 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold
            bg-muted text-muted-foreground shadow
            transition-all duration-300
            group-hover:text-white
            group-hover:bg-gradient-to-r group-hover:from-[#2BB1E8] group-hover:via-[#4D58F0] group-hover:to-[#A63F8E]
            group-hover:shadow-[0_0_0_1px_rgba(77,88,240,.28),0_0_14px_rgba(77,88,240,.35)]
          `}
        >
          {categoryName}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="relative flex flex-1 flex-col p-6">
        {/* Aurora/halo no hover (mantido) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <div className="absolute inset-0 card-glow" />
        </div>

        {/* meta (fonte • data) */}
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          <span>{article.source}</span>
          <span className="mx-1.5">•</span>
          <span>{displayDate}</span>
        </div>

        {/* Título — gradiente APENAS NO HOVER DO CARD (prioridade) */}
        <h3
          className={`
            text-lg md:text-xl font-semibold leading-snug text-foreground
            transition-colors
            group-hover:text-transparent group-hover:bg-clip-text
            group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-indigo-300 group-hover:to-fuchsia-300
          `}
        >
          {article.title}
        </h3>

        {/* resumo */}
        <p className="mt-2 text-sm text-muted-foreground desc-purple-on-hover">
          {article.summary}
        </p>

        {/* separador */}
        <div className="mt-5 h-px w-full bg-border/60" />

        {/* Ações (brilham quando passa o mouse em QUALQUER parte do card) */}
        <div className="mt-3 flex items-center gap-2 text-muted-foreground">
          <button
            aria-label="Compartilhar"
            className="on-card-hover-glow h-8 w-8 rounded-full transition"
            onClick={(e) =>
              openExternal(
                e,
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  article.url ?? ""
                )}&text=${encodeURIComponent(article.title)}`
              )
            }
          >
            <Share2 className="mx-auto h-4 w-4" />
          </button>

          <button
            aria-label="LinkedIn"
            className="on-card-hover-glow h-8 w-8 rounded-full transition"
            onClick={(e) =>
              openExternal(
                e,
                `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  article.url ?? ""
                )}`
              )
            }
          >
            <Linkedin className="mx-auto h-4 w-4" />
          </button>

          <button
            aria-label="Fonte original"
            className="on-card-hover-glow ml-auto h-8 w-8 rounded-full transition"
            onClick={(e) => openExternal(e, article.url)}
          >
            <ExternalLink className="mx-auto h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}
