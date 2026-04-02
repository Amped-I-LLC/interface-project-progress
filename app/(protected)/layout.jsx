'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { PageProvider } from '@/lib/page-context'

/* ============================================================
   Protected Layout
   Every page inside app/(protected)/ automatically gets:
   - Sidebar (left nav)
   - Topbar (top bar — title/subtitle set per-page via usePageTitle())
   - Main content area
   Auth is enforced by middleware.js before this even renders.
   ============================================================ */
export default function ProtectedLayout({ children }) {
  return (
    <PageProvider>
      <LayoutShell>{children}</LayoutShell>
    </PageProvider>
  )
}

/* Separate shell so Topbar can read from PageContext */
function LayoutShell({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Fixed left sidebar — also sets breadcrumb section in context */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>

        {/* Sticky top bar — reads section + title from page context */}
        <Topbar />

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: '24px',
          background: 'var(--color-bg-page)',
        }}>
          {children}
        </main>

      </div>
    </div>
  )
}
