// src/hooks/usearticles.ts
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export type Category = { id: number; name: string };
export type Company  = { id: number; name: string };
export type Article = {
  id: number; title: string; summary: string; url: string; published_at: string;
  categories: Category[]; companies: Company[];
};

export function useArticles(params: {
  q?: string; category?: string[]; company?: string[]; limit?: number; offset?: number;
}) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => getJSON<Article[]>("/api/articles", params),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getJSON<Category[]>("/api/categories"),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getJSON<Company[]>("/api/companies"),
  });
}
