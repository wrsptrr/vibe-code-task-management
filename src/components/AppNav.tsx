import { NavLink } from "react-router"
import { cn } from "cn"

const LINKS = [
  { to: "/", label: "Tugas" },
  { to: "/report", label: "Report" },
]

export function AppNav() {
  return (
    <nav className="flex gap-1" aria-label="Navigasi utama">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
