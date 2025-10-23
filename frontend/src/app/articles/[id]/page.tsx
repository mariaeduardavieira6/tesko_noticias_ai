// app/articles/[id]/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchArticle } from "@/services/articles";
import type { ArticleOut } from "@/types/article";

export const dynamic = "force-dynamic"; // evita cache do Next para este route

// -------------------- SEO dinâmico --------------------
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const article: ArticleOut = await fetchArticle(params.id);

    const title = article.title || "Artigo";
    const description =
      (article.summary ?? "Detalhes do artigo").slice(0, 160);
    const ogImage = article.image ? [{ url: article.image }] : undefined;
    const canonical = `/articles/${article.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "article",
        title,
        description,
        images: ogImage,
        url: canonical,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: article.image ? [article.image] : undefined,
      },
    };
  } catch {
    return {
      title: "Artigo",
      description: "Detalhes do artigo",
    };
  }
}

// -------------------- Client Section --------------------
function ArticleClient({ article }: { article: ArticleOut }) {
  const published = new Date(article.published_at);
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(published);

  // JSON-LD para SEO (schema.org/Article)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: new Date(article.published_at).toISOString(),
    image: article.image ? [article.image] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/articles/${article.id}`,
    },
    description: article.summary,
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-sm text-gray-600">Publicado em {formatted}</p>

        {(article.categories?.length || article.companies?.length) ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.categories?.map((c) => (
              <span
                key={c.id}
                className="text-xs px-2 py-1 rounded-full bg-gray-100"
              >
                #{c.name}
              </span>
            ))}
            {article.companies?.map((c) => (
              <span
                key={c.id}
                className="text-xs px-2 py-1 rounded-full bg-gray-100"
              >
                @{c.name}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {article.image && (
        <div className="relative w-full h-64 md:h-96 mb-6 overflow-hidden rounded-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.summary && (
        <p className="text-lg leading-7 mb-6">{article.summary}</p>
      )}

      <section className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Botão de PDF */}
        <a
          href={article.pdf ?? "#"}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`px-4 py-3 rounded-xl text-center border transition
            ${article.pdf ? "hover:shadow" : "opacity-50 cursor-not-allowed"}
          `}
          aria-disabled={!article.pdf}
          // O atributo download pode ser ignorado cross-origin, mas não atrapalha:
          download={Boolean(article.pdf) || undefined}
        >
          {article.pdf ? "Baixar PDF" : "PDF indisponível"}
        </a>

        {/* Player de áudio */}
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

      {/* Link original, se existir */}
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

      {/* Voltar */}
      <div className="mt-8">
        <a href="/" className="text-sm underline">
          ← Voltar para a dashboard
        </a>
      </div>
    </main>
  );
}

// -------------------- Server: busca e trata 404 --------------------
export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const article = await fetchArticle(params.id);
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
