// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // você pode manter remotePatterns; aqui fica simples e direto:
    domains: ["placehold.co", "picsum.photos", "images.unsplash.com"],
    // (não habilitamos SVG globalmente; SafeImage já trata)
  },
};

export default nextConfig;


