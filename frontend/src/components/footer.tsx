"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      {/* linha de degradê finíssima */}
      <div className="h-px w-full bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] opacity-60" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* <<< Altura fixa do rodapé >>> */}
        <div className="flex h-9 items-center justify-between">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tesko AI. Todos os direitos reservados.
          </span>

          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/politicas" className="hover:underline">Políticas</Link>
            <span className="opacity-40">•</span>
            <Link href="/sobre" className="hover:underline">Sobre</Link>
            <span className="opacity-40">•</span>
            <Link href="/contato" className="hover:underline">Contato</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
