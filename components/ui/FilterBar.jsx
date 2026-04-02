'use client'

import { useState } from 'react'

/* ============================================================
   FilterBar — composable filter row
   Usage:
     const [filters, setFilters] = useState({ client: '', status: '' })

     <FilterBar onReset={() => setFilters({ client: '', status: '' })}>
       <FilterDropdown
         label="Clients"
         value={filters.client}
         options={[{ value: 'ComEd', label: 'ComEd' }]}
         onChange={v => setFilters(f => ({ ...f, client: v }))}
       />
       <FilterDropdown
         label="Status"
         value={filters.status}
         options={[{ value: 'active', label: 'Active' }]}
         onChange={v => setFilters(f => ({ ...f, status: v }))}
       />
     </FilterBar>

   FilterBar props:
     onReset    — fn, called when Reset button is clicked
     children   — FilterDropdown components (or any elements)

   FilterDropdown props:
     label      — string, button label when no value selected
     value      — string, currently selected value
     options    — [{ value, label }]
     onChange   — fn(value), called when selection changes
   ============================================================ */

export function FilterDropdown({ label, value, options = [], onChange }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          6,
          padding:      '6px 12px',
          fontSize:     12,
          fontWeight:   500,
          color:        value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          background:   value ? 'var(--color-primary-light)' : '#fff',
          border:       `1px solid ${value ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          cursor:       'pointer',
          transition:   'all 0.15s',
        }}
      >
        {selected ? selected.label : label}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position:    'absolute',
            top:         'calc(100% + 4px)',
            left:        0,
            zIndex:      50,
            background:  '#fff',
            border:      '1px solid var(--color-border)',
            borderRadius:'var(--radius-md)',
            boxShadow:   'var(--shadow-md)',
            minWidth:    160,
            overflow:    'hidden',
          }}>
            {/* Clear option */}
            <button
              onClick={() => { onChange(''); setOpen(false) }}
              style={{
                display:    'block',
                width:      '100%',
                padding:    '8px 12px',
                textAlign:  'left',
                fontSize:   12,
                color:      'var(--color-text-muted)',
                background: 'transparent',
                border:     'none',
                borderBottom: '1px solid var(--color-border)',
                cursor:     'pointer',
              }}
            >
              All {label}
            </button>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  display:    'block',
                  width:      '100%',
                  padding:    '8px 12px',
                  textAlign:  'left',
                  fontSize:   12,
                  fontWeight: opt.value === value ? 600 : 400,
                  color:      opt.value === value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  background: opt.value === value ? 'var(--color-primary-light)' : 'transparent',
                  border:     'none',
                  cursor:     'pointer',
                }}
                onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = 'var(--color-bg-input)' }}
                onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function FilterBar({ children, onReset }) {
  return (
    <div style={{
      display:    'flex',
      alignItems: 'center',
      gap:        8,
      flexWrap:   'wrap',
      marginBottom: 'var(--space-5)',
    }}>
      {children}
      {onReset && (
        <button
          onClick={onReset}
          style={{
            marginLeft:   'auto',
            fontSize:     12,
            color:        'var(--color-text-muted)',
            background:   'transparent',
            border:       '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding:      '6px 12px',
            cursor:       'pointer',
          }}
        >
          Reset
        </button>
      )}
    </div>
  )
}
