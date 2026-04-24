import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const SPORT_COLORS: Record<string, string> = {
  padel:       '#3778F9',
  tennis:      '#F55127',
  golf:        '#00A358',
  pball:       '#9C4FED',
  tabletennis: '#3EC4C4',
}

const DEFAULT_COLOR = '#FF9829'

interface BrandThemeContextValue {
  brandColor: string
  setSports: (sports: string[]) => void
}

const BrandThemeContext = createContext<BrandThemeContextValue>({
  brandColor: DEFAULT_COLOR,
  setSports: () => {},
})

export function useBrandTheme() {
  return useContext(BrandThemeContext)
}

export function BrandThemeProvider({ children }: { children: ReactNode }) {
  const [brandColor, setBrandColor] = useState(DEFAULT_COLOR)

  const setSports = (sports: string[]) => {
    if (sports.length === 1) {
      const color = SPORT_COLORS[sports[0]]
      setBrandColor(color ?? DEFAULT_COLOR)
    } else {
      setBrandColor(DEFAULT_COLOR)
    }
  }

  useEffect(() => {
    document.body.style.setProperty('--color-brand', brandColor)
    document.body.style.setProperty(
      '--color-brand-soft',
      `${brandColor}1A`, // ~10% opacity hex
    )
  }, [brandColor])

  return (
    <BrandThemeContext.Provider value={{ brandColor, setSports }}>
      {children}
    </BrandThemeContext.Provider>
  )
}
