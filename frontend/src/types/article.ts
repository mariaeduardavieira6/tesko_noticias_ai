// src/types/article.ts
export interface Category { id: number; name: string }
export interface Company  { id: number; name: string }

export interface ArticleOut {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  url?: string;
  image?: string;      // ou image_url (o componente trata os dois)
  image_url?: string;  // compatibilidade
  pdf?: string;
  audio?: string;
  published_at: string;
  categories?: Category[];
  companies?: Company[];
}
