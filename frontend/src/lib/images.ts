// frontend/src/lib/images.ts
export function normalizeImageUrl(url?: string, fallback = "/placeholder.png") {
  if (!url) return fallback;
  try {
    const u = new URL(url);
    if (u.hostname === "placehold.co") {
      const hasExt = /\.\w+$/.test(u.pathname);
      if (!hasExt) {
        // placehold.co aceita /<w>x<h>/png
        u.pathname = u.pathname.replace(/\/?$/, "/png");
      }
      return u.toString();
    }
    return url;
  } catch {
    return fallback;
  }
}
