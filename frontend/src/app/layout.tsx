// app/layout.tsx  (ou src/app/layout.tsx)
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// 1. REMOVIDO o ThemeProvider daqui
// import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers"; // 👈 2. IMPORTADO o seu arquivo de providers
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tesko AI",
  description: "Notícias e insights sobre IA",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        {/* 3. O <Providers> envolve tudo que estava dentro do body */}
        <Providers>
          {/* 4. O <ThemeProvider> foi removido daqui */}
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}