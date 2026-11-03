/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [key, value])
  return [value, setValue]
}

export function makeUserId() {
  const random = crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)
  return `brewer-${random.replace(/-/g, '').slice(0, 6)}`
}

export function AppProvider({ children }) {
  // Pseudo-authentication: every visitor gets a random ID on first launch.
  const [userId, setUserId] = usePersistentState('gfd-user-id', null)
  const [theme, setTheme] = usePersistentState('gfd-theme', 'espresso')
  const [showDetails, setShowDetails] = usePersistentState('gfd-show-details', false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!userId) setUserId(makeUserId())
  }, [userId, setUserId])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = {
    userId,
    newUserId: () => setUserId(makeUserId()),
    theme,
    setTheme,
    showDetails,
    setShowDetails,
    search,
    setSearch,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
