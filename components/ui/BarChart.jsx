'use client'

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

/* ============================================================
   BarChart — Recharts wrapper with design system colors
   Usage:
     // Single bar
     <BarChart
       data={monthlyData}
       xKey="month"
       bars={[{ key: 'revenue', label: 'Revenue' }]}
     />

     // Grouped bars
     <BarChart
       data={monthlyData}
       xKey="month"
       bars={[
         { key: 'revenue',  label: 'Revenue' },
         { key: 'expenses', label: 'Expenses' },
       ]}
       height={320}
     />

     // Custom colors (override default palette)
     <BarChart
       data={data}
       xKey="month"
       bars={[{ key: 'value', label: 'Value', color: '#8b5cf6' }]}
     />

   Props:
     data        — array of objects, each row is one bar group
     xKey        — string, key in data to use for x-axis labels
     bars        — [{ key, label, color? }] — each entry = one bar series
     height      — number, chart height in px (default: 300)
     legend      — boolean, show legend (default: true when >1 bar)
     yTickFormat — fn(value) => string, format y-axis tick labels
                   Default: number abbreviation (1000 → 1K, 1000000 → 1M)

   Default chart color palette (matches globals.css --chart-N variables):
     bar[0] → --chart-1  (primary blue)
     bar[1] → --chart-2  (orange)
     bar[2] → --chart-3  (green)
     bar[3] → --chart-4  (red)
     bar[4] → --chart-5  (purple)
     bar[5] → --chart-6  (cyan)
   ============================================================ */

export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

function defaultYFormat(value) {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`
  return value
}

export default function BarChart({
  data = [],
  xKey,
  bars = [],
  height = 300,
  legend,
  yTickFormat = defaultYFormat,
}) {
  const showLegend = legend !== undefined ? legend : bars.length > 1

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        barCategoryGap="30%"
        barGap={2}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={yTickFormat}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background:   '#fff',
            border:       '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize:     12,
            boxShadow:    '0 4px 12px rgba(0,0,0,0.08)',
          }}
          cursor={{ fill: 'rgba(59,110,246,0.04)' }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
        )}
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            radius={[3, 3, 0, 0]}
            maxBarSize={60}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
