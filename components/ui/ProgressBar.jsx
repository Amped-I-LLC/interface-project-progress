/* ============================================================
   ProgressBar
   Usage:
     <ProgressBar value={46.24} />
     <ProgressBar value={129.53} showLabel />
     <ProgressBar value={37} max={100} color="success" />

   Props:
     value      — number, current value
     max        — number, maximum value (default: 100)
     color      — 'auto' | 'primary' | 'success' | 'warning' | 'danger'
                  'auto' = green <75%, warning 75-100%, red >100%
     showLabel  — boolean, show percentage text after bar (default: true)
     height     — number, bar height in px (default: 6)

   Auto-coloring mirrors the over-budget pattern seen in dashboards:
     < 75%   → success (green)
     75-100% → warning (orange)
     > 100%  → danger (red)
   ============================================================ */

const COLOR_MAP = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
}

export default function ProgressBar({ value = 0, max = 100, color = 'auto', showLabel = true, height = 6 }) {
  const pct = max > 0 ? (value / max) * 100 : 0

  let resolvedColor
  if (color === 'auto') {
    resolvedColor = pct > 100 ? COLOR_MAP.danger : pct >= 75 ? COLOR_MAP.warning : COLOR_MAP.success
  } else {
    resolvedColor = COLOR_MAP[color] ?? COLOR_MAP.primary
  }

  // Cap fill at 100% visually — the label shows the real number
  const fillPct = Math.min(pct, 100)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex:         1,
        background:   'var(--color-border)',
        borderRadius: 'var(--radius-full)',
        height:       height,
        overflow:     'hidden',
      }}>
        <div style={{
          width:        `${fillPct}%`,
          background:   resolvedColor,
          height:       '100%',
          borderRadius: 'var(--radius-full)',
          transition:   'width 0.3s ease',
        }} />
      </div>
      {showLabel && (
        <span style={{
          fontSize:   11,
          fontWeight: 600,
          color:      resolvedColor,
          minWidth:   40,
          textAlign:  'right',
        }}>
          {pct.toFixed(2)}%
        </span>
      )}
    </div>
  )
}
