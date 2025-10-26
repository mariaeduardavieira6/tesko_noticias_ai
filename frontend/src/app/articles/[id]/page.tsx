// src/app/articles/[id]/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticle } from "@/services/articles";
import type { ArticleOut } from "@/types/article";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// -------- SEO dinâmico --------
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  try {
    const article: ArticleOut = await fetchArticle(id);
    const img = (article as any).image ?? (article as any).image_url;

    const title = article.title || "Artigo";
    const description = (article.summary ?? "Detalhes do artigo").slice(0, 160);
    const canonical = `${SITE}/articles/${article.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "article",
        title,
        description,
        images: img ? [{ url: img }] : undefined,
        url: canonical,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: img ? [img] : undefined,
      },
    };
  } catch {
    return { title: "Artigo", description: "Detalhes do artigo" };
  }
}

// -------- Client section --------
function ArticleClient({ article }: { article: ArticleOut }) {
  const img = (article as any).image ?? (article as any).image_url;

  const published = new Date(article.published_at);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(published);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: new Date(article.published_at).toISOString(),
    image: img ? [img] : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/articles/${article.id}` },
    description: article.summary,
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <script
        key="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-sm text-gray-600">Publicado em {formatted}</p>

        {(article.categories?.length || article.companies?.length) ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.categories?.map((c) => (
              <span key={c.id} className="text-xs px-2 py-1 rounded-full bg-gray-100">
                #{c.name}
              </span>
            ))}
            {article.companies?.map((c) => (
              <span key={c.id} className="text-xs px-2 py-1 rounded-full bg-gray-100">
                @{c.name}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {img && (
        <div className="relative w-full h-64 md:h-96 mb-6 overflow-hidden rounded-2xl">
          <SafeImage src={img} alt={article.title} w={1200} h={630} />
        </div>
      )}

      {article.summary && <p className="text-lg leading-7 mb-6">{article.summary}</p>}

      <section className="grid sm:grid-cols-2 gap-4 mb-8">
        <a
          href={article.pdf ?? "#"}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`px-4 py-3 rounded-xl text-center border transition
            ${article.pdf ? "hover:shadow" : "opacity-50 cursor-not-allowed"}`}
          aria-disabled={!article.pdf}
          download={Boolean(article.pdf) || undefined}
        >
          {article.pdf ? "Baixar PDF" : "PDF indisponível"}
        </a>

        <div className="rounded-xl border p-4">
          <p className="text-sm mb-2 font-medium">Ouvir notícia</p>
          {article.audio ? (
            <audio controls className="w-full" preload="none">
              <source src={article.audio} type="audio/mpeg" />
              Seu navegador não suporta o player de áudio.
            </audio>
          ) : (
            <p className="text-sm text-gray-600">Áudio indisponível</p>
          )}
        </div>
      </section>

      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm underline"
        >
          Ver fonte original
        </a>
      )}

      <div className="mt-8">
        <Link href="/" className="text-sm underline">
          ← Voltar para a dashboard
        </Link>
      </div>
    </main>
  );
}

// -------- Server: busca e 404 --------
export default async function ArticlePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const article = await fetchArticle(id);
    if (!article?.id) notFound();
    return (
      <Suspense fallback={<div />}>
        <ArticleClient article={article} />
      </Suspense>
    );
  } catch {
    notFound();
  }
}
