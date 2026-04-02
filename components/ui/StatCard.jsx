/* ============================================================
   StatCard
   Usage:
     <StatCard label="Total Records" value={412} />
     <StatCard label="Revenue" value="$84,200" trend="+12%" trendUp />
     <StatCard label="Overdue" value={7} trend="+3" trendUp={false} />

     // Colored variant — for dashboards with status-colored KPI cards
     <StatCard label="YTD: Revenue"  value="$844,418" variant="blue"   subtitle="Sum of Actual Revenue" />
     <StatCard label="YTD: Expenses" value="$871,760" variant="orange" subtitle="Sum of Actual Expenses" />
     <StatCard label="YTD: Profit"   value="-$27,342" variant="green"  subtitle="Sum of Actual Profit" />
     <StatCard label="Over Budget"   value={28}        variant="red" />
     <StatCard label="Task Over"     value={44}        variant="yellow" />

     // Wide variant — spans 2 columns in a grid-4 layout
     <StatCard label="Revenue As Of" value="4/1/2026 7:51am" wide />

   Props:
     label    — string, metric name
     value    — string | number, main display value
     subtitle — string, secondary description below label (optional)
     trend    — string, e.g. '+12%' or '-3' (optional)
     trendUp  — boolean, true = green, false = red
     variant  — 'default' | 'blue' | 'orange' | 'green' | 'red' | 'yellow'
     wide     — boolean, sets gridColumn span-2 for use in grid layouts
   ============================================================ */

const VARIANTS = {
  default: {
    bg:     'var(--color-bg-card)',
    border: 'var(--color-border)',
    label:  'var(--color-text-muted)',
    value:  'var(--color-text-primary)',
  },
  blue: {
    bg:     '#eff6ff',
    border: '#bfdbfe',
    label:  '#1d4ed8',
    value:  '#1d4ed8',
  },
  orange: {
    bg:     '#fff7ed',
    border: '#fed7aa',
    label:  '#c2410c',
    value:  '#c2410c',
  },
  green: {
    bg:     '#f0fdf4',
    border: '#bbf7d0',
    label:  '#15803d',
    value:  '#15803d',
  },
  red: {
    bg:     '#fef2f2',
    border: '#fecaca',
    label:  '#b91c1c',
    value:  '#b91c1c',
  },
  yellow: {
    bg:     '#fefce8',
    border: '#fde68a',
    label:  '#a16207',
    value:  '#a16207',
  },
}

export default function StatCard({ label, value, subtitle, trend, trendUp, variant = 'default', wide = false }) {
  const v = VARIANTS[variant] ?? VARIANTS.default

  return (
    <div style={{
      background:   v.bg,
      border:       `1px solid ${v.border}`,
      borderRadius: 'var(--radius-lg)',
      padding:      '16px 20px',
      boxShadow:    'var(--shadow-sm)',
      gridColumn:   wide ? 'span 2' : undefined,
    }}>

      {/* Label */}
      <div style={{
        fontSize:      11,
        fontWeight:    700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color:         v.label,
        marginBottom:  subtitle ? 2 : 8,
      }}>
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{
          fontSize:     11,
          color:        v.label,
          opacity:      0.75,
          marginBottom: 8,
          lineHeight:   1.4,
        }}>
          {subtitle}
        </div>
      )}

      {/* Value */}
      <div style={{
        fontSize:   variant === 'default' ? 24 : 28,
        fontWeight: 700,
        color:      v.value,
        lineHeight: 1,
      }}>
        {value ?? '—'}
      </div>

      {/* Trend */}
      {trend && (
        <div style={{
          marginTop:  8,
          fontSize:   12,
          fontWeight: 600,
          color:      trendUp ? 'var(--color-success)' : 'var(--color-danger)',
          display:    'flex',
          alignItems: 'center',
          gap:        3,
        }}>
          <span>{trendUp ? '↑' : '↓'}</span>
          {trend}
        </div>
      )}
    </div>
  )
}
