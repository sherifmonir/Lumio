import type { Theme } from "@/types"
import {  useEffect, useState, type ReactNode } from "react"
import { ThemeContext } from "./UseThemeContext"




function getInitialTheme(): Theme {
  const stored = localStorage.getItem("lumio-theme")
  if (stored === "dark" || stored === "light") return stored
  return "dark"
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

 useEffect(() => {
    const root = document.documentElement
    
    root.setAttribute("data-theme", theme)

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    localStorage.setItem("lumio-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}