import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeToggle } from "@/components/ThemeToggle"

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove("dark")
  vi.stubGlobal("matchMedia", () => ({ matches: false }))
})
afterEach(() => vi.unstubAllGlobals())

describe("ThemeToggle", () => {
  it("switches between light and dark mode", async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole("button", { name: "Aktifkan mode gelap" }))
    expect(document.documentElement).toHaveClass("dark")
    await userEvent.click(screen.getByRole("button", { name: "Aktifkan mode terang" }))
    expect(document.documentElement).not.toHaveClass("dark")
  })
})
