"use client"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      {/* linha de degradê finíssima */}
      <div className="h-px w-full bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] opacity-60" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* <<< Altura fixa do rodapé >>> */}
        {/* 📍 CORRIGIDO:
            - Removido 'h-9' e 'items-center'
            - Adicionado 'flex-col md:flex-row', 'gap-3', 'py-4'
            - 'items-center' adicionado para centralizar no celular
        */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-4">
          {/* 📍 CORRIGIDO: Adicionado 'text-center md:text-left' para alinhar no celular */}
          <span className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Tesko AI. Todos os direitos reservados.
          </span>

          {/* 📍 CORRIGIDO: Adicionado 'justify-center' para o caso de quebra de linha */}
          <nav className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
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