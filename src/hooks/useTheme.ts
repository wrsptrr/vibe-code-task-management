import { useCallback, useEffect, useState } from "react"
import { loadTheme, saveTheme } from "@/services/themeStorage"
import type { Theme } from "@/types/theme"

function getInitialTheme(): Theme {
  const stored = loadTheme()
  if (stored) return stored
  const prefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    saveTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    [],
  )

  return { theme, toggleTheme }
}
