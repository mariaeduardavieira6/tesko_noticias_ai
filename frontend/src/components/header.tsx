"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { useTheme } from "next-themes"
import { Search, Building2, TrendingUp, Sun, Moon, Laptop, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Header() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [showFabSearch, setShowFabSearch] = useState(false)

  // qual painel aberto: "companies" | "trending" | null
  const [openPanel, setOpenPanel] = useState<null | "companies" | "trending">(null)

  // refs e altura real do header p/ posicionar os painéis/mini-busca
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [headerH, setHeaderH] = useState(0)

  const companiesRef = useRef<HTMLDivElement | null>(null)
  const trendingRef = useRef<HTMLDivElement | null>(null)
  const companiesBtnRef = useRef<HTMLButtonElement | null>(null)
  const trendingBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const measure = () => setHeaderH(headerRef.current?.offsetHeight ?? 0)
    measure()
    const ro = new ResizeObserver(measure)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  // FAB da busca ao rolar
  useEffect(() => {
    const onScroll = () => setShowFab((window.scrollY || 0) > 120)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // fechar ao clicar fora / Esc
  useEffect(() => {
    function handleDown(e: MouseEvent) {
      const t = e.target as Node
      const inCompanies =
        companiesRef.current?.contains(t) || companiesBtnRef.current?.contains(t)
      const inTrending =
        trendingRef.current?.contains(t) || trendingBtnRef.current?.contains(t)
      if (!inCompanies && !inTrending) setOpenPanel(null)
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenPanel(null)
    }
    document.addEventListener("mousedown", handleDown)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleDown)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // fechar ao rolar (scroll/wheel/touch)
  useEffect(() => {
    if (!openPanel) return
    const close = () => setOpenPanel(null)
    window.addEventListener("scroll", close, { passive: true })
    window.addEventListener("wheel", close, { passive: true })
    window.addEventListener("touchmove", close, { passive: true })
    return () => {
      window.removeEventListener("scroll", close)
      window.removeEventListener("wheel", close)
      window.removeEventListener("touchmove", close)
    }
  }, [openPanel])

  const companies = [
    "OpenAI","Google","Meta","Microsoft","Apple",
    "Anthropic","xAI","Mistral","Cohere","Hugging Face","NVIDIA",
  ]
  const trendingTopics = [
    { name: "Reddit (r/artificial)", url: "https://www.reddit.com/r/artificial/" },
    { name: "X (#AI)", url: "https://twitter.com/search?q=%23AI&src=typed_query&f=live" },
    { name: "LinkedIn (IA)", url: "https://www.linkedin.com/feed/hashtag/inteligenciaartificial/" },
  ]

  const effectiveTheme = (theme === "system" ? systemTheme : theme) ?? "light"
  const isDark = effectiveTheme === "dark"

  // === NOVO: tons dos painéis por tema ===
  // LIGHT -> usa seus tokens: bg-popover (branco), texto escuro, borda sutil, sombra leve
  // DARK  -> fundo petróleo escuro, texto claro, borda suave, sombra forte
  const panelTone = isDark
    ? "bg-[#0b0f14] text-white border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
    : "bg-popover text-popover-foreground border-border shadow-[0_10px_30px_rgba(2,6,23,0.10)]"

  // Base do "pill" (item dos painéis)
  const pillBase =
    "transition-all duration-200 px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F0]/30"

  // Texto do item por tema
  const pillText = isDark ? "text-white/85 hover:text-white" : "text-foreground hover:text-foreground"

  // Fundo hover do item por tema (sutil no light, um pouco mais forte no dark)
  const pillHoverBg = isDark ? "hover:bg-white/5" : "hover:bg-blue-500/10"

  // Links do Trending por tema (azul coerente no light; no dark azul vivo)
  const trendingLinkText = isDark
    ? "text-[#78b2ff] hover:text-white"
    : "text-blue-600 hover:text-blue-700"

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setShowFabSearch(false)
  }

  return (
    <>
      {/* HEADER */}
      <header className="relative z-30 w-full bg-background border-b border-border">
        <div
          ref={headerRef}
          className="container mx-auto max-w-7xl flex h-[44px] items-center justify-between gap-4 px-4 md:px-6"
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Tesko AI Início">
            <span className="text-2xl font-extrabold tracking-wide leading-none bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] bg-clip-text text-transparent">
              TESKOAI
            </span>
          </Link>

          {/* Busca central */}
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

          {/* Ícones */}
          <div className="flex items-center gap-1">
            <Button
              ref={companiesBtnRef}
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:bg-accent transition icon-glow"
              aria-label="Empresas monitoradas"
              onClick={() => setOpenPanel(p => (p === "companies" ? null : "companies"))}
            >
              <Building2 className="w-6 h-6 icon-gradient" />
            </Button>

            <Button
              ref={trendingBtnRef}
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:bg-accent transition icon-glow"
              aria-label="Trending topics"
              onClick={() => setOpenPanel(p => (p === "trending" ? null : "trending"))}
            >
              <TrendingUp className="w-6 h-6 icon-gradient" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Alternar tema"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {!mounted ? (
                <Laptop className="w-6 h-6" />
              ) : isDark ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Linha degradê base */}
        <div className="h-px w-full bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] opacity-60" />
      </header>

      {/* Overlay para fechar ao clicar fora */}
      {openPanel && (
        <button
          type="button"
          aria-hidden="true"
          onClick={() => setOpenPanel(null)}
          className="fixed inset-0 z-[9998] bg-transparent cursor-default"
        />
      )}

      {/* Painéis — AGORA adaptados por tema */}
      {openPanel === "companies" && (
        <div
          ref={companiesRef}
          className={`fixed right-4 z-[9999] w-56 rounded-xl border p-3 ${panelTone}`}
          style={{ top: headerH + 8 }}
          role="dialog"
          aria-label="Empresas Monitoradas"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-sm px-2">Empresas Monitoradas</h3>
            <div className="flex flex-col gap-1">
              {companies.map((company) => (
                <Link
                  key={company}
                  href={`/?source=${company}`}
                  className={`${pillBase} ${pillText} ${pillHoverBg} block`}
                  onClick={() => setOpenPanel(null)}
                >
                  {company}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {openPanel === "trending" && (
        <div
          ref={trendingRef}
          className={`fixed right-4 z-[9999] w-64 rounded-xl border p-3 ${panelTone}`}
          style={{ top: headerH + 8 }}
          role="dialog"
          aria-label="Trending Topics"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-sm px-2">Trending Topics</h3>
            <ul className="flex flex-col gap-1">
              {trendingTopics.map((topic) => (
                <li key={topic.name}>
                  <a
                    href={topic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${pillBase} ${pillHoverBg} ${trendingLinkText} hover:underline block`}
                    onClick={() => setOpenPanel(null)}
                  >
                    {topic.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* FAB e mini-busca (sem alterações de tema) */}
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

          {showFabSearch && (
            <div
              className="fixed right-4 z-40 w-[min(92vw,480px)] rounded-xl border border-input bg-background/95 p-2 shadow-lg backdrop-blur"
              style={{ top: headerH + 8 }}
            >
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
