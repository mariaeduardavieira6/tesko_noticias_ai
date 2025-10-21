import "./globals.css"
import type { Metadata } from "next"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "Tesko Notícias AI",
  description: "Dashboard de notícias com IA",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

