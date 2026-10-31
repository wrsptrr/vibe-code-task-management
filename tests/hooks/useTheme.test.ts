import { act, renderHook } from "@testing-library/react"
import { useTheme } from "@/hooks/useTheme"
import { THEME_STORAGE_KEY } from "@/services/themeStorage"

function stubPrefersDark(matches: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches }))
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove("dark")
})
afterEach(() => vi.unstubAllGlobals())

describe("useTheme", () => {
  it("uses the stored theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark")
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement).toHaveClass("dark")
  })

  it("falls back to the system preference", () => {
    stubPrefersDark(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
  })

  it("defaults to light without storage or matchMedia", () => {
    vi.stubGlobal("matchMedia", undefined)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("light")
    expect(document.documentElement).not.toHaveClass("dark")
  })

  it("toggles the theme, persists it and updates the html class", () => {
    stubPrefersDark(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("dark")
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark")
    expect(document.documentElement).toHaveClass("dark")
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("light")
    expect(document.documentElement).not.toHaveClass("dark")
  })
})
