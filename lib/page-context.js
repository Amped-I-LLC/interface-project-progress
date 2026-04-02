'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const PageContext = createContext(null)

export function PageProvider({ children }) {
  const [title,    setTitle]    = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [section,  setSection]  = useState('')   // set by Sidebar based on active route
  return (
    <PageContext.Provider value={{ title, setTitle, subtitle, setSubtitle, section, setSection }}>
      {children}
    </PageContext.Provider>
  )
}

/* ---- Hook for layout/topbar to read current page meta ---- */
export function usePageMeta() {
  return useContext(PageContext)
}

/* ---- Hook for pages to set their title ---- */
export function usePageTitle(title, subtitle = '') {
  const ctx = useContext(PageContext)
  useEffect(() => {
    ctx?.setTitle(title)
    ctx?.setSubtitle(subtitle)
  }, [title, subtitle])
}
