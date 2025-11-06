"use client"

import { useEffect, useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Search,
  Building2,
  TrendingUp,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"

const categories = ["Lançamentos", "Pesquisas", "Ferramentas", "Políticas"]
const companies = [
  "OpenAI", "Google", "Meta", "Microsoft", "Apple", "Anthropic",
  "xAI", "Mistral", "Cohere", "Hugging Face", "NVIDIA",
]
const trendingTopics = [
  { name: "Reddit (r/artificial)", url: "https://www.reddit.com/r/ArtificialInteligence/" },
  { name: "X (#AI)", url: "https://twitter.com/search?q=%23AI&src=typed_query&f=live" },
  { name: "LinkedIn (IA)", url: "https://www.linkedin.com/feed/hashtag/inteligenciaartificial/" },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const { theme, setTheme, systemTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hideCategories, setHideCategories] = useState(false)

  const activeCategory = sp.get("category") ?? "Últimas notícias"
  const effectiveTheme = theme === "system" ? systemTheme : theme

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    setSearchQuery(sp.get("q") || "")
  }, [sp, mounted])

  useEffect(() => {
    let lastScroll = 0
    const handleScroll = () => {
      const current = window.scrollY
      setHideCategories(current > lastScroll && current > 80)
      lastScroll = current
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const createCategoryURL = (category: string) => {
    const next = new URLSearchParams(sp.toString())
    category === "Últimas notícias" ? next.delete("category") : next.set("category", category)
    return `/?${next.toString()}`
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-[1000] w-full bg-background border-b border-border shadow-md">
      {/* Top bar */}
      <div className="flex items-center h-16 px-4 md:px-6 max-w-7xl mx-auto justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] bg-clip-text text-transparent"
        >
          TESKOAI
        </Link>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          className="relative hidden md:flex flex-1 max-w-3xl mx-6 transition-all group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 group-hover:scale-110 group-hover:text-blue-400 transition-transform duration-200" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, categoria ou empresa..."
            className={cn(
              "w-full h-10 pl-9 pr-4 rounded-full border border-input text-foreground focus:outline-none focus:ring-0",
              effectiveTheme === "dark"
                ? "bg-black/40 placeholder:text-gray-400"
                : "bg-white shadow-sm placeholder:text-gray-500"
            )}
          />
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Empresas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl transition-all hover:shadow-[0_0_12px_rgba(77,88,240,0.45)]",
                  effectiveTheme === "dark"
                    ? "bg-[#0A0A0F] text-white"
                    : "bg-white text-black border border-gray-300"
                )}
              >
                <Building2 className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[9999] w-64 rounded-xl border border-border shadow-2xl bg-white dark:bg-[#0A0A0F]"
            >
              <div className="px-3 py-2">
                <h3 className="font-bold text-sm mb-1">Empresas Monitoradas</h3>
                <ul className="space-y-1">
                  {companies.map((c) => (
                    <li key={c}>
                      <Link
                        href={`/?source=${encodeURIComponent(c)}`}
                        className="block px-3 py-1.5 rounded-md text-sm transition-all hover:bg-gradient-to-r hover:from-[#2BB1E8] hover:via-[#4D58F0] hover:to-[#A63F8E] hover:text-white"
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Trending */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl transition-all hover:shadow-[0_0_12px_rgba(77,88,240,0.45)]",
                  effectiveTheme === "dark"
                    ? "bg-[#0A0A0F] text-white"
                    : "bg-white text-black border border-gray-300"
                )}
              >
                <TrendingUp className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[9999] w-64 rounded-xl border border-border shadow-2xl bg-white dark:bg-[#0A0A0F]"
            >
              <div className="px-3 py-2">
                <h3 className="font-bold text-sm mb-1">Trending Topics</h3>
                <ul className="space-y-1">
                  {trendingTopics.map((topic) => (
                    <li key={topic.name}>
                      <a
                        href={topic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1.5 rounded-md text-sm text-blue-500 hover:text-blue-400 hover:underline transition-all"
                      >
                        {topic.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
            className={cn(
              "rounded-xl transition-all hover:shadow-[0_0_12px_rgba(77,88,240,0.45)]",
              effectiveTheme === "dark"
                ? "bg-[#0A0A0F] text-white"
                : "bg-white text-black border border-gray-300"
            )}
          >
            {!mounted ? <Laptop className="w-6 h-6" /> : effectiveTheme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Categorias (some no scroll) */}
      {pathname === "/" && (
        <nav
          className={cn(
            "max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center gap-4 border-t border-border transition-transform duration-300",
            hideCategories && "-translate-y-full"
          )}
        >
          {["Últimas notícias", ...categories].map((category) => {
            const isActive = activeCategory === category
            return (
              <Link
                key={category}
                href={createCategoryURL(category)}
                className={cn(
                  "text-sm font-semibold px-3 py-1.5 rounded-md transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-[#2BB1E8] via-[#4D58F0] to-[#A63F8E] text-white shadow-[0_0_12px_rgba(77,88,240,0.45)]"
                    : cn(
                        "hover:shadow-[0_0_12px_rgba(77,88,240,0.45)]",
                        effectiveTheme === "dark"
                          ? "hover:bg-[#1A1A22] text-white"
                          : "hover:bg-[#E8E9FC] text-black"
                      )
                )}
              >
                {category}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
