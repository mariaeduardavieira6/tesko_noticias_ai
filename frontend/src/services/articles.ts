// src/services/articles.ts
import { getJSON } from "@/lib/api";
import type { ArticleOut } from "@/types/article";

export async function fetchArticle(id: string): Promise<ArticleOut> {
  return getJSON<ArticleOut>(`/api/articles/${id}`);
}

