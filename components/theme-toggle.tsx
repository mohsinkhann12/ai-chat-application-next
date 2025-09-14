"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="transition-all duration-200">
        <Sun className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
    >
      <div className="relative">
        {theme === "dark" ? (
          <Sun className="w-4 h-4 transition-all duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 transition-all duration-300 rotate-0 scale-100" />
        )}
      </div>
    </Button>
  )
}
