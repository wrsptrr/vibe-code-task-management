import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { AppNav } from "@/components/AppNav"

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppNav />
    </MemoryRouter>,
  )
}

describe("AppNav", () => {
  it("links to the task and report pages", () => {
    renderAt("/")
    expect(screen.getByRole("link", { name: "Tugas" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Report" })).toHaveAttribute("href", "/report")
  })

  it("marks the current page as active", () => {
    renderAt("/report")
    expect(screen.getByRole("link", { name: "Report" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Tugas" })).not.toHaveAttribute("aria-current")
  })
})
