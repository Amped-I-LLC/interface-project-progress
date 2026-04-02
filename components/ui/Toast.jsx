'use client'

import { useState, useCallback } from 'react'

/* ============================================================
   Toast — lightweight notification system
   Usage:
     // 1. Add <ToastContainer> once at page or layout level
     // 2. Use the useToast() hook to trigger toasts

     'use client'
     import { useToast, ToastContainer } from '@/components/ui/Toast'

     export default function MyPage() {
       const { toasts, toast } = useToast()

       async function handleSave() {
         const { error } = await supabase.from('...').insert(...)
         if (error) toast('Failed to save record.', 'error')
         else       toast('Record saved successfully.', 'success')
       }

       return (
         <>
           <ToastContainer toasts={toasts} />
           <button onClick={handleSave}>Save</button>
         </>
       )
     }

   toast(message, type) — type: 'success' | 'error' | 'info' (default: 'success')
   Auto-dismisses after 3.5 seconds.
   ============================================================ */

const STYLES = {
  success: {
    bg:    'var(--color-success)',
    icon:  '✓',
  },
  error: {
    bg:    'var(--color-danger)',
    icon:  '✕',
  },
  info: {
    bg:    'var(--color-primary)',
    icon:  'ℹ',
  },
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  return { toasts, toast }
}

export function ToastContainer({ toasts = [] }) {
  if (!toasts.length) return null

  return (
    <div style={{
      position:  'fixed',
      top:       20,
      right:     20,
      zIndex:    1000,
      display:   'flex',
      flexDirection: 'column',
      gap:       8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const s = STYLES[t.type] ?? STYLES.success
        return (
          <div
            key={t.id}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          10,
              padding:      '10px 16px',
              background:   s.bg,
              color:        '#fff',
              borderRadius: 'var(--radius-md)',
              fontSize:     13,
              fontWeight:   500,
              boxShadow:    'var(--shadow-md)',
              animation:    'toast-in 0.2s ease',
              maxWidth:     320,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700 }}>{s.icon}</span>
            {t.message}
          </div>
        )
      })}
    </div>
  )
}
