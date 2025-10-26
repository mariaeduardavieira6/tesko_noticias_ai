"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleOut as Article } from "@/types/article";
import { normalizeImageUrl } from "@/lib/images"; // ✅ normaliza placehold.co → .png

type Props = { article: Article };

const ArticleCardComponent = ({ article }: Props) => {
  // Garante que published_at sempre é string ISO
  const pubISO =
    typeof article.published_at === "string"
      ? article.published_at
      : new Date(article.published_at ?? Date.now()).toISOString();

  // Fallbacks de imagem e resumo
  const rawImg = article.image ?? article.image_url;
  const img = normalizeImageUrl(rawImg, "/placeholder.png"); // ✅ evita SVG
  const summary = article.summary ?? "";
  const title = article.title ?? "Sem título";

  return (
    <article
      className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition bg-card text-card-foreground"
      aria-labelledby={`art-${article.id}-title`}
    >
      {/* Imagem */}
      <Link href={`/articles/${article.id}`} prefetch={false}>
        <div className="relative aspect-video w-full mb-3 overflow-hidden rounded-xl">
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            loading="lazy"        // ✅ evita carregar tudo de uma vez
            decoding="async"      // ✅ prioriza interatividade
          />
        </div>
      </Link>

      {/* Título → navega para a página de detalhes */}
      <Link
        href={`/articles/${article.id}`}
        prefetch={false} // ✅ não pré-carrega a rota de detalhes
        aria-label={`Abrir detalhes da notícia: ${title}`}
      >
        <h3
          id={`art-${article.id}-title`}
          className="font-semibold text-lg hover:underline cursor-pointer line-clamp-2"
        >
          {title}
        </h3>
      </Link>

      {/* Resumo */}
      {summary && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {summary}
        </p>
      )}

      {/* (Opcional) Categorias / Empresas */}
      <div className="flex flex-wrap gap-2 mt-3">
        {article.categories?.map((cat) => (
          <span
            key={cat.id}
            className="text-xs bg-muted px-2 py-1 rounded-md text-foreground/70"
          >
            {cat.name}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {article.companies?.map((comp) => (
          <span
            key={comp.id}
            className="text-xs bg-muted px-2 py-1 rounded-md text-foreground/70"
          >
            {comp.name}
          </span>
        ))}
      </div>

      {/* Data de publicação semântica */}
      <div className="text-xs mt-3 opacity-70">
        <time dateTime={pubISO}>{new Date(pubISO).toLocaleString("pt-BR")}</time>
      </div>

      {/* Link externo para a fonte */}
      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm mt-3 inline-block underline hover:text-blue-600"
          aria-label="Abrir fonte original em nova aba"
        >
          Ver fonte
        </a>
      )}
    </article>
  );
};

export default memo(ArticleCardComponent);
