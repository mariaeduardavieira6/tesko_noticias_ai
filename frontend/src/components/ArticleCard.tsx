// frontend/src/components/ArticleCard.tsx
import { memo } from "react";
import Link from "next/link";
import type { Article } from "@/hooks/useArticles";

type Props = { article: Article };

const ArticleCardComponent = ({ article }: Props) => {
  const pubISO =
    typeof article.published_at === "string"
      ? article.published_at
      : new Date(article.published_at).toISOString();

  return (
    <article
      className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition"
      aria-labelledby={`art-${article.id}-title`}
    >
      {/* Título → navega para a página de detalhes */}
      <Link
        href={`/articles/${article.id}`}
        aria-label={`Abrir detalhes da notícia: ${article.title}`}
      >
        <h3
          id={`art-${article.id}-title`}
          className="font-semibold text-lg hover:underline cursor-pointer"
        >
          {article.title}
        </h3>
      </Link>

      {/* Resumo */}
      {article.summary && (
        <p className="text-sm text-muted-foreground mt-2">{article.summary}</p>
      )}

      {/* (Opcional) Categorias / Empresas */}
      <div className="flex flex-wrap gap-2 mt-3">{/* chips de categorias */}</div>
      <div className="flex flex-wrap gap-2 mt-2">{/* chips de empresas */}</div>

      {/* Data de publicação semântica */}
      <div className="text-xs mt-3 opacity-70">
        <time dateTime={pubISO}>
          {new Date(pubISO).toLocaleString()}
        </time>
      </div>

      {/* Link externo para a fonte */}
      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm mt-3 inline-block underline"
          aria-label="Abrir fonte original em nova aba"
        >
          Ver fonte
        </a>
      )}
    </article>
  );
};

export default memo(ArticleCardComponent);
