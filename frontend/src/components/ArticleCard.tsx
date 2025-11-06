// components/ArticleCard.tsx
import type { NewsArticle } from "@/types/news";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Share2, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import SafeImage from "@/components/SafeImage";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: NewsArticle }) {
  const categoryName = article.categories?.[0]?.name ?? "Notícia";
  const displayDate = formatDate(article.published_at);

  const handleIconClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      href={`/noticia/${article.id}`}
      className={cn(
        "group",
        "flex flex-col",
        "bg-card border border-border rounded-2xl overflow-hidden",
        "transition-all duration-300 ease-out",
        "ring-brand card-glow glow-brand"
      )}
    >
      {/* Imagem e Categoria */}
      <div className="relative w-full aspect-video overflow-hidden">
        <SafeImage
          src={article.image_url || article.image || "https://placehold.co/800x450/jpg"}
          alt={article.title}
          w={800}
          h={450}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <Badge
          className={cn(
            "absolute top-3 left-3 border-none text-xs font-bold shadow-lg",
            "bg-muted text-muted-foreground",
            "transition-colors duration-300",
            "tag-gradient-on-hover"
          )}
        >
          {categoryName}
        </Badge>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          <span>{article.source}</span>
          <span className="mx-1.5">•</span>
          <span>{displayDate}</span>
        </div>

        <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2 transition-colors text-gradient-on-hover">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1 desc-purple-on-hover">
          {article.summary}
        </p>

        <div className="flex items-center gap-2 pt-5 mt-auto border-t border-border/50 text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="Compartilhar"
            onClick={(e) => handleIconClick(e, `https://twitter.com/intent/tweet?url=${article.url}&text=${article.title}`)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            aria-label="LinkedIn"
            onClick={(e) => handleIconClick(e, `https://www.linkedin.com/shareArticle?mini=true&url=${article.url}`)}
          >
            <Linkedin className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full ml-auto"
            aria-label="Fonte original"
            onClick={(e) => handleIconClick(e, article.url)}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
