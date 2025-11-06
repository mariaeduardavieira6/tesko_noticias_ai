"use client"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6
                      flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © 2025 Tesko AI. Todos os direitos reservados.
        </p>
        <nav className="flex gap-4 text-xs">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
        </nav>
      </div>
    </footer>
  )
}
