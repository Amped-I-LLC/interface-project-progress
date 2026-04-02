'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { usePageMeta } from '@/lib/page-context'

/* ============================================================
   NAV CONFIG
   To add a new page, add an entry here.
   'href' must match the route in app/(protected)/

   Items with 'children' expand/collapse on click.
   The parent label becomes the breadcrumb section name.

   Example with sub-items:
   {
     label: 'Finance',
     icon: '$',
     children: [
       { label: 'Scorecard', href: '/finance/scorecard' },
       { label: 'Expenses',  href: '/finance/expenses' },
     ]
   }

   Example without sub-items (direct link):
   { label: 'Dashboard', href: '/', icon: '▦' }
   ============================================================ */
const NAV_ITEMS = [
  { section: 'MAIN', items: [
    { label: 'Dashboard', href: '/', icon: '▦' },
  ]},
  { section: 'DATA', items: [
    { label: 'Records',  icon: '☰', children: [
      { label: 'All Records', href: '/records' },
      { label: 'Reports',     href: '/reports' },
    ]},
  ]},
  { section: 'SETTINGS', items: [
    { label: 'Settings', href: '/settings', icon: '⚙' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const { setSection } = usePageMeta() ?? {}
  const [expanded, setExpanded] = useState(new Set())

  /* Auto-expand the parent containing the active route */
  useEffect(() => {
    for (const group of NAV_ITEMS) {
      for (const item of group.items) {
        if (item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))) {
          setExpanded(prev => new Set([...prev, item.label]))
        }
      }
    }
  }, [pathname])

  /* Set breadcrumb section in context based on active route */
  useEffect(() => {
    if (!setSection) return
    for (const group of NAV_ITEMS) {
      for (const item of group.items) {
        if (item.children) {
          const active = item.children.find(c => pathname === c.href || pathname.startsWith(c.href + '/'))
          if (active) { setSection(item.label); return }
        }
      }
    }
    setSection('')
  }, [pathname, setSection])

  function toggleExpand(label) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function isChildActive(item) {
    return item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
  }

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--color-sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
    }}>

      {/* Logo / App Name */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--color-sidebar-border)',
      }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.01em' }}>
          Amped I
        </div>
        {/* Replace with the current interface name when stamping a new project */}
        <div style={{ fontSize: 11, color: 'var(--color-sidebar-label)', marginTop: 2 }}>
          Interface Name v1.0
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div className="section-label">{section}</div>
            {items.map((item) => {
              const hasChildren = Boolean(item.children?.length)
              const isExpanded  = expanded.has(item.label)
              const parentActive = isChildActive(item)

              /* Parent item with children — toggle only */
              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        margin: '1px 8px',
                        borderRadius: 'var(--radius-md)',
                        width: 'calc(100% - 16px)',
                        textAlign: 'left',
                        background: parentActive ? 'var(--color-sidebar-active)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: parentActive ? 600 : 400,
                        color: parentActive
                          ? 'var(--color-sidebar-active-text)'
                          : 'var(--color-sidebar-text)',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        if (!parentActive) e.currentTarget.style.background = 'var(--color-sidebar-hover)'
                      }}
                      onMouseLeave={e => {
                        if (!parentActive) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <span style={{ fontSize: 15, opacity: parentActive ? 1 : 0.7 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 10, opacity: 0.6 }}>{isExpanded ? '▾' : '▸'}</span>
                    </button>

                    {/* Sub-items */}
                    {isExpanded && (
                      <div style={{ paddingLeft: 8 }}>
                        {item.children.map(child => {
                          const isActive = pathname === child.href || pathname.startsWith(child.href + '/')
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '7px 12px 7px 28px',
                                margin: '1px 8px',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                fontSize: 12,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive
                                  ? 'var(--color-sidebar-active-text)'
                                  : 'var(--color-sidebar-text)',
                                background: isActive
                                  ? 'rgba(59,110,246,0.3)'
                                  : 'transparent',
                                transition: 'background 0.15s, color 0.15s',
                              }}
                              onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = 'var(--color-sidebar-hover)'
                              }}
                              onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = 'transparent'
                              }}
                            >
                              <span style={{ opacity: 0.5, fontSize: 10 }}>–</span>
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              /* Top-level direct link */
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 12px',
                    margin: '1px 8px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? 'var(--color-sidebar-active-text)'
                      : 'var(--color-sidebar-text)',
                    background: isActive
                      ? 'var(--color-sidebar-active)'
                      : 'transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--color-sidebar-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: 15, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — version info */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--color-sidebar-border)',
        fontSize: 11,
        color: 'var(--color-sidebar-label)',
      }}>
        Amped I · Template v1.0
      </div>
    </aside>
  )
}
