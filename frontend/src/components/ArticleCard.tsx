// src/components/ArticleCard.tsx

// 1. Importamos 'memo' e 'Link'
import { memo } from "react"; 
import Link from "next/link"; // 1. ADICIONADO: Importa o Link
import { Article } from "@/hooks/useArticles";

const ArticleCardComponent = ({ article }: { article: Article }) => {
  return (
    <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      
      {/* 2. ADICIONADO: O Link agora envolve o título */}
      <Link href={`/articles/${article.id}`}>
        <h3 className="font-semibold text-lg hover:underline cursor-pointer">
          {article.title}
        </h3>
      </Link>
      
      <p className="text-sm text-muted-foreground mt-2">{article.summary}</p>

      <div className="flex flex-wrap gap-2 mt-3">{/* ... Categorias ... */}</div>
      <div className="flex flex-wrap gap-2 mt-2">{/* ... Empresas ... */}</div>

      <div className="text-xs mt-3 opacity-70">
        {new Date(article.published_at).toLocaleString()}
      </div>

      {/* 3. Este link '<a>' agora é válido */}
      <a href={article.url} target="_blank" className="text-sm mt-3 inline-block underline">
        Ver fonte
      </a>
    </div>
  );
}

export default memo(ArticleCardComponent);