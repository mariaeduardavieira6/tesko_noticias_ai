// src/types/news.ts
export type Category = { id: number; name: string };
export type Company  = { id: number; name: string };

export type NewsArticle = {
  id: number;
  title: string;
  summary: string;
  url: string;
  image?: string | null;
  image_url?: string | null;
  published_at: string;
  categories?: Category[];
  companies?: Company[];
  // se você usa "source" no Card, declare aqui. Caso não use, remova do Card.
  source?: string;
  content?: string; // (O texto/HTML completo da notícia)
};
