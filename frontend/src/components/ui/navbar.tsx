import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Input } from "@/components/ui/input";


export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Link para Home com prefetch={false} */}
        <Link href="/" prefetch={false} className="text-xl font-semibold hover:text-blue-600 transition-colors">
          Tesko Notícias AI
        </Link>

        {/* Links de Navegação com prefetch={false} */}
        <div className="hidden sm:flex items-center gap-4 ml-6">
          <Link href="/articles" prefetch={false} className="text-sm hover:text-blue-600 transition-colors">
            Artigos
          </Link>
          <Link href="/companies" prefetch={false} className="text-sm hover:text-blue-600 transition-colors">
            Empresas
          </Link>
          <Link href="/trending" prefetch={false} className="text-sm hover:text-blue-600 transition-colors">
            Trending Topics
          </Link>
        </div>

        {/* Busca e Toggle de Tema (Estrutura original) */}
        <div className="ml-auto flex items-center gap-3">
          <Input placeholder="Buscar..." className="w-40 sm:w-64" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
