import "./globals.css"
import type { Metadata } from "next"
import Providers from "./providers"
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Tesko Notícias AI",
  description: "Dashboard de notícias com IA",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen">
        <SkipLink /> {/* 2. Adicione o componente aqui */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

