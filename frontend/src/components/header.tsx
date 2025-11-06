"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useTheme } from "next-themes"
import { Search, Building2, TrendingUp, Sun, Moon, Laptop, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

export function Header() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showFab, setShowFab] = useState(false) // exibe a lupa flutuante ao rolar
  const [showFabSearch, setShowFabSearch] = useState(false) // overlay da busca

  useEffect(() => setMounted(true), [])

  // controla exibição da FAB após rolar a página
  useEffect(() => {
    const onScroll = () => setShowFab((window.scrollY || 0) > 120)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const companies = [
    "OpenAI",
    "Google",
    "Meta",
    "Microsoft",
    "Apple",
    "Anthropic",
    "xAI",
    "Mistral",
    "Cohere",
    "Hugging Face",
    "NVIDIA",
  ]

  const trendingTopics = [
    { name: "Reddit (r/artificial)", url: "https://www.reddit.com/r/ArtificialInteligence/" },
    { name: "X (#AI)", url: "https://twitter.com/search?q=%23AI&src=typed_query&f=live" },
    { name: "LinkedIn (IA)", url: "https://www.linkedin.com/feed/hashtag/inteligenciaartificial/" },
  ]

  const effectiveTheme = theme === "system" ? systemTheme : theme

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    console.log("Buscando por:", searchQuery)
    // ex.: router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setShowFabSearch(false)
  }

  return (
    <>
      {/* HEADER (não fixo) */}
      <header className="relative z-30 w-full border-b border-border bg-background">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Tesko AI Início">
            <span className="text-2xl font-extrabold tracking-wide leading-none bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] bg-clip-text text-transparent">
              TESKOAI
            </span>
          </Link>

          {/* Busca central – md+ (expande ao foco) */}
          <form
            onSubmit={onSubmit}
            className="hidden md:flex relative items-center mx-auto transition-[max-width] duration-300 ease-out max-w-lg focus-within:max-w-2xl w-full"
          >
            <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, categoria ou empresa…"
              className="h-9 w-full pl-10 pr-4 rounded-lg border border-input bg-background/70 text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:ring-0"
            />
          </form>

          {/* Ações / Ícones */}
          <div className="flex items-center gap-1">
            {/* Empresas */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-accent transition icon-glow"
                  aria-label="Empresas monitoradas"
                >
                  <Building2 className="w-5 h-5 icon-gradient" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-popover border-border p-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground px-2">Empresas Monitoradas</h3>
                  <div className="flex flex-col">
                    {companies.map((company) => (
                      <Link
                        key={company}
                        href={`/?source=${company}`}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        {company}
                      </Link>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Trending */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-accent transition icon-glow"
                  aria-label="Trending topics"
                >
                  <TrendingUp className="w-5 h-5 icon-gradient" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-popover border-border p-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground px-2">Trending Topics</h3>
                </div>
                <ul className="flex flex-col">
                  {trendingTopics.map((topic) => (
                    <li key={topic.name}>
                      <a
                        href={topic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        {topic.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            {/* Tema */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Alternar tema"
              onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
            >
              {!mounted ? (
                <Laptop className="w-5 h-5" />
              ) : effectiveTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Lupa flutuante (FAB) – aparece ao rolar */}
      {showFab && (
        <>
          <button
            aria-label="Abrir busca"
            onClick={() => setShowFabSearch((s) => !s)}
            className="fixed top-4 right-4 z-40 h-11 w-11 rounded-full border border-border bg-background/80 backdrop-blur
                       flex items-center justify-center
                       hover:scale-105 active:scale-95 transition
                       hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.55)]"
          >
            <Search className="h-5 w-5 text-foreground" />
          </button>

          {/* Mini overlay de busca */}
          {showFabSearch && (
            <div className="fixed top-16 right-4 z-40 w-[min(92vw,480px)] rounded-xl border border-input bg-background/95 p-2 shadow-lg backdrop-blur">
              <form onSubmit={onSubmit} className="relative">
                <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, categoria ou empresa…"
                  className="h-10 w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  aria-label="Fechar busca"
                  onClick={() => setShowFabSearch(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </>
  )
}
