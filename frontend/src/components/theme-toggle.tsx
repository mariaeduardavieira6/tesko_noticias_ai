"use client"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = theme === "dark" ? "light" : "dark"
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(next)} aria-label="Alternar tema">
      {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
    </Button>
  )
}
