// components/NewsCard.tsx
"use client";

import Link from "next/link";

/** Aceita payloads diferentes (mock ou API) */
type NewsLike = {
  id: number | string;
  title: string;

  date?: string;
  published_at?: string;
  publishedAt?: string;

  image?: string | null;
  image_url?: string | null;

  description?: string | null;
  summary?: string | null;

  category?: string | null;
  categories?: { id?: number | string; name: string }[] | null;

  source?: string | null;
  companies?: { id?: number | string; name: string }[] | null;
};

type Props = {
  news: NewsLike;
  /** se sua rota for /noticia/[id], passe hrefBase="/noticia" */
  hrefBase?: string;
};

function pickImage(n: NewsLike) {
  return n.image ?? n.image_url ?? "";
}
function pickDate(n: NewsLike) {
  const raw = n.published_at ?? n.publishedAt ?? n.date ?? "";
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function pickCategory(n: NewsLike) {
  if (n.category) return n.category;
  return n.categories?.[0]?.name ?? "";
}
function pickSource(n: NewsLike) {
  if (n.source) return n.source;
  return n.companies?.[0]?.name ?? "";
}
function pickDescription(n: NewsLike) {
  return n.description ?? n.summary ?? "";
}

export function NewsCard({ news, hrefBase = "/articles" }: Props) {
  const img = pickImage(news);
  const date = pickDate(news);
  const category = pickCategory(news);
  const source = pickSource(news);
  const desc = pickDescription(news);
  const href = `${hrefBase}/${news.id}`;

  return (
    <Link
      href={href}
      aria-label={news.title}
      className="
        group glow-card               /* glow atrás + anel no hover (css utilitário) */
        block overflow-hidden rounded-2xl border border-border bg-card
        shadow-sm transition-all duration-300 hover:shadow-lg
      "
    >
      {/* Imagem */}
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img || "/placeholder.png"}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* fade inferior p/ legibilidade do título sobre a imagem */}
        <span className="card-image-fade" />

        {/* badge de categoria (reage ao hover) */}
        {category ? (
          <span className="absolute left-3 top-3 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground on-card-hover-badge">
            {category}
          </span>
        ) : null}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-2 p-4">
        {(source || date) && (
          <div className="text-xs text-muted-foreground">
            {source && <span>{source}</span>}
            {source && date && <span className="mx-1.5">•</span>}
            {date && <span>{date}</span>}
          </div>
        )}

        {/* Título:
            - LIGHT: mantém cor legível SEM gradiente
            - DARK : no hover vira gradiente (apenas no dark) */}
        <h3
          className="
            line-clamp-2 text-base font-semibold transition-colors
            text-foreground
            dark:group-hover:text-transparent dark:group-hover:bg-clip-text
            dark:group-hover:bg-[linear-gradient(90deg,#2BB1E8_0%,#7C8CFF_46%,#A63F8E_100%)]
          "
        >
          {news.title}
        </h3>

        {desc ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{desc}</p>
        ) : null}

        <span className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-purple-400">
          Ler mais
        </span>
      </div>
    </Link>
  );
}

export default NewsCard;
