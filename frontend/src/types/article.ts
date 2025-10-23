export type CategoryOut = { id: number; name: string };
export type CompanyOut  = { id: number; name: string };

export type ArticleOut = {
  id: number;
  title: string;
  summary: string;
  url: string | null;     // opcional
  image: string | null;   // URL da imagem de capa
  pdf: string | null;     // URL do PDF
  audio: string | null;   // URL do áudio
  published_at: string;   // ISO datetime
  categories: CategoryOut[];
  companies:  CompanyOut[];
};
