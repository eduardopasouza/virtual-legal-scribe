import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Create context for mobile state
type MobileContextType = {
  isMobile: boolean
  toggleSidebar: () => void
  sidebarOpen: boolean
}

const MobileContext = React.createContext<MobileContextType | undefined>(undefined)

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const value = React.useMemo(() => ({
    isMobile,
    toggleSidebar,
    sidebarOpen,
  }), [isMobile, toggleSidebar, sidebarOpen])

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  )
}

export function useMobileContext() {
  const context = React.useContext(MobileContext)
  if (context === undefined) {
    throw new Error("useMobileContext must be used within a MobileProvider")
  }
  return context
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
