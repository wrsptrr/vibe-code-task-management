import { loadTheme, saveTheme, THEME_STORAGE_KEY } from "@/services/themeStorage"

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe("themeStorage", () => {
  it("returns null when nothing is stored", () => {
    expect(loadTheme()).toBeNull()
  })

  it("round-trips a saved theme", () => {
    saveTheme("dark")
    expect(loadTheme()).toBe("dark")
  })

  it("returns null for an invalid stored value", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple")
    expect(loadTheme()).toBeNull()
  })

  it("does not throw when storage fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    expect(loadTheme()).toBeNull()
    expect(() => saveTheme("dark")).not.toThrow()
  })
})
