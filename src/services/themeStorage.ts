import type { Theme } from "@/types/theme"

export const THEME_STORAGE_KEY = "task-manajemen:theme"

export function loadTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    return raw === "light" || raw === "dark" ? raw : null
  } catch {
    return null
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // storage unavailable or full; ignore
  }
}
