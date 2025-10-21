// src/app/page.tsx
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    // O flex-col min-h-screen garante que a página ocupe toda a altura
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Área Principal da Dashboard */}
      <main className="flex-1 p-4 md:p-8">
        
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Dashboard Tesko Notícias AI
        </h1>
        
        <p className="mb-8 text-muted-foreground">
          (Semana 1: Tema Claro/Escuro completo! Agora, construindo o layout Pinterest.)
        </p>

        {/* --- Card de Teste: Este card deve trocar de cor! --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card text-card-foreground p-6 rounded-lg shadow-xl border border-border">
            <h2 className="text-xl font-semibold">Tema Funcional!</h2>
            <p className="mt-2 text-muted-foreground">
              Se este card mudar de cor ao clicar no 🌞/🌙, a configuração está 100%.
            </p>
            <p className="mt-2 text-primary">
              (Esta cor deve ser o seu Primary)
            </p>
          </div>
        </div>
      </main>
      
      {/* Você pode adicionar um Footer simples aqui se quiser */}
    </div>
  )
}
