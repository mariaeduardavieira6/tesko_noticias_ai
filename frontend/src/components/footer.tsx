"use client"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-[11px] gap-2 md:gap-4">
        <p>© 2025 Tesko AI. Todos os direitos reservados.</p>
        <nav className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Sobre</a>
          <a href="#" className="hover:text-foreground transition-colors">Contato</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
        </nav>
      </div>
    </footer>
  )
}
