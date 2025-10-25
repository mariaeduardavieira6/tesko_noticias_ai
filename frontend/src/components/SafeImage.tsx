// src/components/SafeImage.tsx
import Image from "next/image";

/**
 * Renderiza <Image> quando seguro; cai para <img> se:
 * - a URL for SVG, ou
 * - o host não estiver na whitelist.
 * Também força /jpg para placehold.co (evita SVG por padrão).
 */
const allowed = new Set(["placehold.co", "picsum.photos", "images.unsplash.com"]);

export default function SafeImage({
  src,
  alt,
  w = 800,
  h = 480,
  className = "object-cover rounded-2xl",
}: {
  src?: string;
  alt: string;
  w?: number;
  h?: number;
  className?: string;
}) {
  if (!src) return null;
  try {
    const u = new URL(src);
    const host = u.hostname;

    // placehold.co retorna SVG quando não há extensão -> força JPG
    const hasExt = /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname);
    if (host === "placehold.co" && !hasExt) {
      u.pathname = u.pathname.replace(/\/?$/, "/jpg"); // /800x480 → /800x480/jpg
      src = u.toString();
    }

    // se for SVG explícito, usa <img> (evita dangerouslyAllowSVG)
    if (/\.svg$/i.test(u.pathname)) {
      return <img src={src} alt={alt} className={className + " w-full h-auto"} loading="lazy" />;
    }

    // hosts permitidos -> usa next/image
    if (allowed.has(host)) {
      return <Image src={src} alt={alt} width={w} height={h} className={className} />;
    }
  } catch {
    // URL inválida: cai no fallback
  }
  return <img src={src} alt={alt} className={className + " w-full h-auto"} loading="lazy" />;
}
