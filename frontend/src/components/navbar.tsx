// src/components/navbar.tsx
import { ThemeToggle } from "./theme-toggle" // Assumindo que o toggle está no mesmo diretório

export function Navbar() {
  return (
    // A Navbar deve usar as classes de tema para mudar de cor
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Título da Aplicação */}
        <h1 className="text-xl font-bold text-foreground">
          Tesko Notícias AI
        </h1>
        
        {/* Componente de Troca de Tema */}
        <ThemeToggle />
      </div>
    </header>
  )
}