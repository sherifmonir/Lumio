import { createContext, useContext } from "react"
import type { ThemeContextType } from "@/types"

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)


export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useThemeContext must be used within a ThemeProvider")
  return context
}