// components/NewsCard.tsx
"use client";

import Link from "next/link";

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
  hrefBase?: string; // ex.: "/noticia"
};

function pickImage(n: NewsLike) { return n.image ?? n.image_url ?? ""; }
function pickDate(n: NewsLike) {
  const raw = n.published_at ?? n.publishedAt ?? n.date ?? "";
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function pickCategory(n: NewsLike) { return n.category ?? n.categories?.[0]?.name ?? ""; }
function pickSource(n: NewsLike)   { return n.source ?? n.companies?.[0]?.name ?? ""; }
function pickDescription(n: NewsLike){ return n.description ?? n.summary ?? ""; }

export function NewsCard({ news, hrefBase = "/noticia" }: Props) {
  const href = `${hrefBase}/${news.id}`;
  const img = pickImage(news);
  const date = pickDate(news);
  const category = pickCategory(news);
  const source = pickSource(news);
  const desc = pickDescription(news);

  return (
    <Link
      href={href}
      aria-label={news.title}
      className="
        group titlefx block overflow-hidden rounded-2xl
        fx-neon hoverable shadow-sm transition-all duration-300
        border border-border bg-card
      "
    >
      {/* Imagem */}
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img || 'https://placehold.co/800x480'}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* fade neutro para legibilidade (sem tapete roxo) */}
        <span className="card-image-fade" />

        {category ? (
          <span className="absolute left-3 top-3 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
            {category}
          </span>
        ) : null}
      </div>

      {/* Conteúdo liso (sem gradient de fundo) */}
      <div className="card-body flex flex-col gap-2 p-4 bg-card" style={{ backgroundImage: "none" }}>
        {(source || date) && (
          <div className="text-xs text-muted-foreground">
            {source && <span>{source}</span>}
            {source && date && <span className="mx-1.5">•</span>}
            {date && <span>{date}</span>}
          </div>
        )}

        <h3 className="on-card-hover-title line-clamp-2 text-base font-semibold">
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
