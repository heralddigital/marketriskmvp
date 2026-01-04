'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

const COLOR_THEME_STORAGE_KEY = 'marketrisk_color_theme_v1'

type ColorTheme = 'default' | 'risk-red' | 'mint-citrus' | 'sage-forest' | 'ocean-blue'

interface ThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'default'
    try {
      const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) || 'default'
      return stored === 'risk-red' || stored === 'mint-citrus' || stored === 'sage-forest' || stored === 'ocean-blue' ? stored : 'default'
    } catch {
      return 'default'
    }
  })

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
    try {
      localStorage.setItem(COLOR_THEME_STORAGE_KEY, theme)
    } catch {
      // ignore storage failures
    }
  }

  useEffect(() => {
    if (colorTheme === 'risk-red' || colorTheme === 'mint-citrus' || colorTheme === 'sage-forest' || colorTheme === 'ocean-blue') {
      document.documentElement.setAttribute('data-theme', colorTheme)
      document.body?.setAttribute?.('data-theme', colorTheme)
    } else {
      document.documentElement.removeAttribute('data-theme')
      document.body?.removeAttribute?.('data-theme')
    }
  }, [colorTheme])

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

