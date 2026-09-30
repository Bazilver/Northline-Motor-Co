/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type MarketplaceValue = {
  saved: string[]
  toggleSaved: (id: string) => void
}

const MarketplaceContext = createContext<MarketplaceValue | null>(null)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([])
  const value = useMemo(() => ({
    saved,
    toggleSaved: (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
  }), [saved])

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (!context) throw new Error('useMarketplace must be used inside MarketplaceProvider')
  return context
}
