import { ThemeToggle } from "../theme-toggle"
import { Input } from "@/components/ui/input"


export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <div className="text-xl font-semibold">Tesko Notícias AI</div>
        <div className="ml-auto flex items-center gap-3">
          <Input placeholder="Buscar..." className="w-64" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
