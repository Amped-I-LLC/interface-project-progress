'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/* ── Config ── */
const APP    = 'interface-project-progress'
const TABLE  = 'All Projects'
const FILTER = `{Status}="A"`

const F = {
  project:       'Level1Name',
  client:        'ClientName',
  stage:         'Ops Stage',
  projectStatus: 'Status',
  contract:      'Contract',
  jtd:           'JTD',
  remaining:     'Contract Remaining',
  budgetStatus:  'Final Overall Budget Status',
  pm:            'ProjMgrName',
  pct:           'PM Reported % Complete',
  baseline:      'Planned Hours',
  actual:        'Actual Hours',
  drawings:      'Drawing Count',
  planStart:     'PlanStartDate',
}

/* ── Utilities ── */
function fmt$(n) {
  if (n == null || isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (abs >= 1_000)     return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '$' + n.toFixed(2)
}

function fmtHrs(n) {
  if (!n && n !== 0) return '—'
  return Number(n).toLocaleString() + ' hrs'
}

function parseStatus(raw) {
  if (!raw) return 'ok'
  const s = String(raw).toUpperCase()
  if (s.includes('TASK OVER')) return 'warn'
  if (s.includes('OVER'))      return 'over'
  return 'ok'
}

function statusLabel(s) {
  return s === 'over' ? 'Over Budget' : s === 'warn' ? 'Task Over' : 'OK'
}

function strField(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string' && !val[0].startsWith('rec')) return val[0]
  return ''
}

function normPct(val) {
  if (val == null || val === '') return 0
  const n = parseFloat(val)
  if (isNaN(n)) return 0
  return n <= 1 ? Math.round(n * 100) : Math.round(n)
}

function fmtDate(raw) {
  if (!raw) return '—'
  try {
    const d = new Date(raw)
    return isNaN(d) ? raw : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return raw }
}

/* ── Status styles ── */
const STATUS = {
  ok:   { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  warn: { bg: '#fef9c3', text: '#a16207', dot: '#ca8a04' },
  over: { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626' },
}

/* ── Sub-components ── */

function Spinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(26,31,46,0.85)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 999, gap: 16,
    }}>
      <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 42, height: 42,
        border: '3px solid rgba(255,255,255,0.2)',
        borderTopColor: '#93c5fd', borderRadius: '50%',
        animation: '_spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 14, color: '#9ba5c0', margin: 0 }}>Fetching live data from Airtable…</p>
    </div>
  )
}

function StatPill({ num, label, color }) {
  return (
    <div style={{
      textAlign: 'center',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '8px 18px',
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color }}>{num}</div>
      <div style={{ fontSize: 10, color: '#9ba5c0', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
      background: s.bg, color: s.text,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {statusLabel(status)}
    </span>
  )
}

function MiniBadge({ status, count }) {
  const s = STATUS[status]
  const labels = { ok: 'OK', warn: 'Task Over', over: 'Over' }
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: s.bg, color: s.text }}>
      {count} {labels[status]}
    </span>
  )
}

function BudgetBar({ jtd, contract, status }) {
  const exceeded  = jtd > contract && contract > 0
  const pct       = contract > 0 ? Math.min((jtd / contract) * 100, 100) : 0
  const overage   = jtd - contract
  const barColors = {
    ok:   'linear-gradient(90deg, #4ade80, #22c55e)',
    warn: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
    over: 'linear-gradient(90deg, #f87171, #ef4444)',
  }
  return (
    <div style={{ minWidth: 180 }}>
      <div style={{ background: '#f0f2f5', borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 6,
          width: exceeded ? '100%' : `${pct.toFixed(1)}%`,
          background: barColors[status],
          boxShadow: exceeded ? 'inset 0 0 0 2px rgba(255,255,255,0.3)' : undefined,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {exceeded ? (
          <>
            <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>{fmt$(jtd)} JTD</span>
            <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>+{fmt$(overage)} over</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{fmt$(jtd)} JTD</span>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{fmt$(contract)} contract</span>
          </>
        )}
      </div>
    </div>
  )
}

function PctBar({ pct }) {
  return (
    <div style={{ minWidth: 100 }}>
      <div style={{ background: '#f0f2f5', borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 6, width: `${pct}%`, background: 'linear-gradient(90deg, #818cf8, #6366f1)' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', marginTop: 3, display: 'block' }}>{pct}%</span>
    </div>
  )
}

function TableHead({ showDate = false, showClient = false }) {
  const thStyle = (right = false, center = false) => ({
    fontSize: 10, fontWeight: 700, color: '#9ba5c0',
    textTransform: 'uppercase', letterSpacing: '0.6px',
    padding: '10px 16px 8px',
    textAlign: right ? 'right' : center ? 'center' : 'left',
    borderBottom: '1px solid #f0f2f5', background: '#fafbfc',
    whiteSpace: 'nowrap',
  })
  return (
    <thead>
      <tr>
        {showDate   && <th style={thStyle()}>Plan Start</th>}
        {showClient && <th style={thStyle()}>Client</th>}
        <th style={thStyle()}>Project Name</th>
        <th style={thStyle()}>Status</th>
        <th style={thStyle()}>Budget Used (JTD / Contract)</th>
        <th style={thStyle()}>% Complete</th>
        <th style={thStyle(true)}>Time Actual / Baseline</th>
        <th style={thStyle(false, true)}>Drawings</th>
      </tr>
    </thead>
  )
}

function ProjectRow({ project, showDate = false, showClient = false }) {
  const { name, client, stage, status, contract, jtd, pct, baseline, actual, drawings, pm, planStart } = project
  const timeUsed   = baseline > 0 ? Math.round((actual / baseline) * 100) : null
  const timeCls    = timeUsed == null ? 'ok' : timeUsed > 100 ? 'over' : timeUsed > 85 ? 'warn' : 'ok'
  const timeLabel  = timeUsed == null ? 'Not started' : `${timeUsed}% used`
  const timeColors = { ok: '#16a34a', warn: '#ca8a04', over: '#dc2626' }
  const stageTag   = stage && stage !== 'Active'
    ? <span style={{ fontSize: 10, background: '#e0e7ff', color: '#4338ca', padding: '1px 6px', borderRadius: 8, fontWeight: 600, marginLeft: 4 }}>{stage}</span>
    : null

  const tdBase = { padding: '12px 16px', verticalAlign: 'middle' }

  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      {showDate && (
        <td style={{ ...tdBase, minWidth: 110 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1f2e' }}>{fmtDate(planStart)}</div>
        </td>
      )}
      {showClient && (
        <td style={{ ...tdBase, minWidth: 160, fontSize: 12, fontWeight: 600, color: '#4f46e5' }}>
          {client}
        </td>
      )}
      <td style={{ ...tdBase, minWidth: 210 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1f2e', lineHeight: 1.3 }}>
          {name}{stageTag}
        </div>
        {pm && <div style={{ fontSize: 11, color: '#9ba5c0', marginTop: 1 }}>PM: {pm}</div>}
      </td>
      <td style={tdBase}>
        <StatusBadge status={status} />
      </td>
      <td style={tdBase}>
        <BudgetBar jtd={jtd} contract={contract} status={status} />
      </td>
      <td style={tdBase}>
        <PctBar pct={pct} />
      </td>
      <td style={{ ...tdBase, textAlign: 'right', minWidth: 120 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1f2e' }}>{fmtHrs(actual)}</div>
        <div style={{ fontSize: 11, color: '#9ba5c0', marginTop: 1 }}>
          {baseline ? `of ${fmtHrs(baseline)} baseline` : 'No baseline set'}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: timeColors[timeCls] }}>{timeLabel}</div>
      </td>
      <td style={{ ...tdBase, textAlign: 'center', minWidth: 90 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', lineHeight: 1 }}>{String(drawings)}</div>
      </td>
    </tr>
  )
}

function ClientSection({ group, collapsed, onToggle }) {
  const { name, projects, contract, jtd, remaining } = group
  const isCollapsed = collapsed.has(name)
  const nOk   = projects.filter(p => p.status === 'ok').length
  const nWarn = projects.filter(p => p.status === 'warn').length
  const nOver = projects.filter(p => p.status === 'over').length
  const remColor = remaining < 0 ? '#dc2626' : remaining < contract * 0.1 ? '#ca8a04' : '#16a34a'
  const remLabel = remaining < 0 ? 'Overage' : 'Remaining'

  return (
    <div style={{
      background: 'white', borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
      marginBottom: 16, overflow: 'hidden',
      border: '1px solid #e8eaed',
    }}>
      <div
        onClick={() => onToggle(name)}
        style={{
          display: 'flex', alignItems: 'center',
          padding: '14px 20px', cursor: 'pointer', userSelect: 'none',
          background: '#f8f9fc',
          borderBottom: isCollapsed ? 'none' : '1px solid #e8eaed',
          gap: 12,
        }}
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="#9ba5c0" strokeWidth="2.5"
          style={{ transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', flex: 1 }}>{name}</div>

        <div style={{ display: 'flex', gap: 5, marginRight: 8 }}>
          {nOk   > 0 && <MiniBadge status="ok"   count={nOk} />}
          {nWarn > 0 && <MiniBadge status="warn" count={nWarn} />}
          {nOver > 0 && <MiniBadge status="over" count={nOver} />}
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {[
            { label: 'Total Contract', val: fmt$(contract),             color: '#1a1f2e'                         },
            { label: 'JTD Spent',      val: fmt$(jtd),                  color: jtd > contract ? '#dc2626' : '#1a1f2e' },
            { label: remLabel,         val: fmt$(Math.abs(remaining)),   color: remColor                          },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#9ba5c0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHead />
            <tbody>
              {projects.map(p => <ProjectRow key={p.id} project={p} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FlatView({ rows, direction }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid #e8eaed', overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 20px', background: '#f8f9fc',
        borderBottom: '1px solid #e8eaed',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8"  y1="2" x2="8"  y2="6" />
          <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1f2e' }}>
          All Active Projects — sorted by Plan Start Date
        </span>
        <span style={{ fontSize: 11, color: '#9ba5c0' }}>
          {direction > 0 ? 'Earliest first' : 'Latest first'} · {rows.length} projects
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHead showDate showClient />
          <tbody>
            {rows.map(p => <ProjectRow key={p.id} project={p} showDate showClient />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Button style helpers ── */
const filterBtnStyle = active => ({
  border: '1px solid', borderRadius: 20,
  padding: '5px 14px', fontSize: 12, cursor: 'pointer',
  background:  active ? '#1a1f2e' : 'white',
  color:       active ? 'white'   : '#374151',
  borderColor: active ? '#1a1f2e' : '#d1d5db',
  transition: 'all 0.15s',
})

const sortBtnStyle = active => ({
  border: '1px solid', borderRadius: 20,
  padding: '5px 14px', fontSize: 12, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 5,
  background:  active ? '#4f46e5' : 'white',
  color:       active ? 'white'   : '#374151',
  borderColor: active ? '#4f46e5' : '#d1d5db',
  transition: 'all 0.15s',
})

const stageBtnStyle = active => ({
  border: '1px solid', borderRadius: 20,
  padding: '4px 12px', fontSize: 11, cursor: 'pointer',
  background:  active ? '#2d3550' : 'white',
  color:       active ? 'white'   : '#374151',
  borderColor: active ? '#2d3550' : '#d1d5db',
  transition: 'all 0.15s',
})

/* ── Main page ── */
export default function ProjectProgressPage() {
  const [records,      setRecords]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [lastFetched,  setLastFetched]  = useState(null)
  const [sortMode,     setSortMode]     = useState('client')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stageFilter,  setStageFilter]  = useState(new Set())
  const [searchQuery,  setSearchQuery]  = useState('')
  const [collapsed,    setCollapsed]    = useState(new Set())

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ app: APP, table: TABLE, filter: FILTER })
      const res = await fetch(`/api/airtable?${params}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Failed to load data (${res.status})`)
      }
      const data = await res.json()
      setRecords(data)
      setLastFetched(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  /* Enrich raw Airtable records */
  const enriched = useMemo(() => records.map(rec => {
    const f        = rec.fields
    const contract = parseFloat(f[F.contract]) || 0
    const jtd      = parseFloat(f[F.jtd])      || 0
    const rawRem   = parseFloat(f[F.remaining])
    return {
      id:        rec.id,
      name:      strField(f[F.project]) || 'Unnamed Project',
      client:    strField(f[F.client])  || 'Unknown Client',
      stage:     String(f[F.stage] || ''),
      status:    parseStatus(f[F.budgetStatus]),
      contract,
      jtd,
      remaining: isNaN(rawRem) ? contract - jtd : rawRem,
      pct:       normPct(f[F.pct]),
      baseline:  parseFloat(f[F.baseline]) || 0,
      actual:    parseFloat(f[F.actual])   || 0,
      drawings:  f[F.drawings] ?? '—',
      pm:        strField(f[F.pm]),
      planStart: f[F.planStart] || '',
    }
  }), [records])

  /* Apply filters + search */
  const filtered = useMemo(() => {
    let r = enriched
    if (stageFilter.size > 0) r = r.filter(p => stageFilter.has(p.stage))
    if (statusFilter !== 'all') r = r.filter(p => p.status === statusFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q))
    }
    return r
  }, [enriched, stageFilter, statusFilter, searchQuery])

  /* Header stats */
  const stats = useMemo(() => ({
    total: filtered.length,
    ok:    filtered.filter(p => p.status === 'ok').length,
    warn:  filtered.filter(p => p.status === 'warn').length,
    over:  filtered.filter(p => p.status === 'over').length,
  }), [filtered])

  /* Client-grouped view */
  const clientGroups = useMemo(() => {
    if (sortMode !== 'client') return []
    const map = {}
    for (const p of filtered) {
      if (!map[p.client]) map[p.client] = { projects: [], contract: 0, jtd: 0, remaining: 0 }
      map[p.client].projects.push(p)
      map[p.client].contract  += p.contract
      map[p.client].jtd       += p.jtd
      map[p.client].remaining += p.remaining
    }
    const ORDER = { over: 0, warn: 1, ok: 2 }
    for (const g of Object.values(map)) {
      g.projects.sort((a, b) => {
        const d = ORDER[a.status] - ORDER[b.status]
        return d !== 0 ? d : a.name.localeCompare(b.name)
      })
    }
    return Object.keys(map).sort().map(name => ({ name, ...map[name] }))
  }, [filtered, sortMode])

  /* Flat date-sorted view */
  const flatRows = useMemo(() => {
    if (sortMode === 'client') return []
    const dir = sortMode === 'date-asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const da = a.planStart ? new Date(a.planStart).getTime() : dir > 0 ? Infinity : -Infinity
      const db = b.planStart ? new Date(b.planStart).getTime() : dir > 0 ? Infinity : -Infinity
      return (da - db) * dir
    })
  }, [filtered, sortMode])

  const toggleCollapse = useCallback(name => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f0f2f5', color: '#1a1f2e', minHeight: '100vh' }}>

      {loading && <Spinner />}

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3550 100%)',
        color: 'white', padding: '22px 32px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.3px', margin: 0 }}>Project Progress Dashboard</h1>
          <p style={{ fontSize: 12, color: '#9ba5c0', marginTop: 2, marginBottom: 0 }}>Client Success — Active Projects</p>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <StatPill num={loading ? '—' : stats.total} label="Active Projects" color="#93c5fd" />
          <StatPill num={loading ? '—' : stats.ok}    label="On Budget"       color="#4ade80" />
          <StatPill num={loading ? '—' : stats.warn}  label="Task Over"       color="#facc15" />
          <StatPill num={loading ? '—' : stats.over}  label="Over Budget"     color="#f87171" />
          <button
            onClick={loadData}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', borderRadius: 8, padding: '8px 14px', fontSize: 12,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.51" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '8px 14px', fontSize: 12,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '14px 32px', fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ display: 'block', marginBottom: 4 }}>⚠ Could not load data from Airtable</strong>
          {error}
        </div>
      )}

      {/* ── Filter bar ── */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e6ed',
        padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4 }}>Filter:</span>
        {[
          { label: 'All',            val: 'all'  },
          { label: '✅ On Budget',   val: 'ok'   },
          { label: '⚠️ Task Over',   val: 'warn' },
          { label: '🔴 Over Budget', val: 'over' },
        ].map(({ label, val }) => (
          <button key={val} onClick={() => setStatusFilter(val)} style={filterBtnStyle(statusFilter === val)}>{label}</button>
        ))}

        <div style={{ width: 1, height: 20, background: '#e2e6ed', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort:</span>
          <button onClick={() => setSortMode('client')} style={sortBtnStyle(sortMode === 'client')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
              <path d="M17 20H5M17 4H5M12 12H5"/><circle cx="19" cy="12" r="2"/>
            </svg>
            Group by Client
          </button>
          <button onClick={() => setSortMode('date-asc')} style={sortBtnStyle(sortMode === 'date-asc')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
              <polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
            Start Date ↑
          </button>
          <button onClick={() => setSortMode('date-desc')} style={sortBtnStyle(sortMode === 'date-desc')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
              <polyline points="8 18 12 22 16 18"/><line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
            Start Date ↓
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍  Search project or client…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            marginLeft: 'auto', border: '1px solid #d1d5db', borderRadius: 20,
            padding: '5px 14px', fontSize: 12, width: 220, outline: 'none', color: '#374151',
          }}
        />
      </div>

      {/* ── Ops stage bar ── */}
      <div style={{
        background: '#f8f9fc', borderBottom: '1px solid #e2e6ed',
        padding: '9px 32px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ba5c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4 }}>Ops Stage:</span>
        <button
          onClick={() => setStageFilter(new Set())}
          style={stageBtnStyle(stageFilter.size === 0)}
        >
          All Active
        </button>
        {['Active', 'Active (Accrual)', 'Active (As-Builts)'].map(val => (
          <button
            key={val}
            onClick={() => setStageFilter(prev => {
              const next = new Set(prev)
              if (next.has(val)) next.delete(val)
              else next.add(val)
              return next.size === 0 ? new Set() : next
            })}
            style={stageBtnStyle(stageFilter.has(val))}
          >
            {val}
          </button>
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '10px 32px', fontSize: 11, color: '#6b7280',
        background: '#f8f9fc', borderBottom: '1px solid #e8eaed', flexWrap: 'wrap',
      }}>
        <strong style={{ color: '#374151', marginRight: 6 }}>Legend:</strong>
        {[
          { color: '#22c55e', label: 'On Budget (OK)' },
          { color: '#f59e0b', label: 'Task Over (hours exceeded, contract OK)' },
          { color: '#ef4444', label: 'Over Budget (contract exceeded)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <div style={{ height: 8, width: 40, borderRadius: 6, background: 'linear-gradient(90deg, #818cf8, #6366f1)' }} />
          % Complete
        </div>
        {lastFetched && (
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#9ba5c0' }}>
            Last updated: {lastFetched}
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 32px', color: '#9ba5c0' }}>
            <h3 style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>No active projects found</h3>
            <p style={{ margin: 0 }}>Check your filters or try refreshing.</p>
          </div>
        )}

        {sortMode === 'client'
          ? clientGroups.map(group => (
              <ClientSection key={group.name} group={group} collapsed={collapsed} onToggle={toggleCollapse} />
            ))
          : flatRows.length > 0 && (
              <FlatView rows={flatRows} direction={sortMode === 'date-asc' ? 1 : -1} />
            )
        }
      </div>

      <footer style={{ textAlign: 'center', padding: '24px', fontSize: 11, color: '#9ba5c0' }}>
        Live data from Airtable · {new Date().toLocaleDateString()}
      </footer>

    </div>
  )
}
