# Amped I — Project Preferences & Decisions Log
## Running record of confirmed decisions, pending items, and deferred discussions

Last updated: 2026-04-01

---

## UI Defaults

This section documents the default layout, components, and visual patterns for all interfaces built from this template. These are the confirmed starting points — interfaces customize from here.

### Layout Shell

| Element | Default | Notes |
|---|---|---|
| Sidebar | Fixed left, 240px wide, dark navy (`#1e2d4d`) | Always present on all protected pages |
| Sidebar nav items | Grouped by section label, expandable sub-items on click | Parent item click = expand/collapse. Active child auto-expands parent |
| Topbar | White, 56px tall, sticky | Breadcrumb left (`Section › Page`), user avatar + logout right |
| Breadcrumb | `Parent Nav Item › Page Title` | Section set by sidebar, title set by `usePageTitle()` in page |
| Login page | Centered card, max 380px, email + password | "Access is managed by your administrator" footer note |
| Page background | `#f0f4ff` (light blue-gray) | From `--color-bg-page` |

### Stat Cards (KPI Summary Cards)

Used at the top of dashboards and summary pages. Supports colored variants for status-driven KPIs.

| Variant | Background | Use For |
|---|---|---|
| `default` | White | Neutral metrics |
| `blue` | Light blue | Revenue, positive financial metrics |
| `orange` | Light orange | Expenses, cost metrics |
| `green` | Light green | Profit, completion metrics |
| `red` | Light red | Over-budget, alert metrics |
| `yellow` | Light yellow | Warning, task-over metrics |
| `wide` prop | Spans 2 columns | Timestamp cards, wide KPIs |

### Data Tables

Default: search filter + sortable columns + pagination (10 rows). Built into `DataTable` component — no extra setup needed. Empty state handled automatically.

### Charts

Default library: **Recharts** (pre-installed). Use `BarChart` component from `@/components/ui/BarChart`.

| Chart type | Component | Notes |
|---|---|---|
| Bar (single or grouped) | `BarChart` | Default for most dashboards |
| Line / Area | Recharts `LineChart` / `AreaChart` directly | Use CHART_COLORS palette from BarChart.jsx |
| Pie / Donut | Recharts `PieChart` directly | Use CHART_COLORS palette |

**Chart color palette** (always use these — never hardcode):
| Variable | Color | Use |
|---|---|---|
| `--chart-1` | `#3b6ef6` — blue | Primary series, Revenue |
| `--chart-2` | `#f59e0b` — orange | Secondary series, Expenses |
| `--chart-3` | `#10b981` — green | Positive / Profit |
| `--chart-4` | `#ef4444` — red | Negative / Over budget |
| `--chart-5` | `#8b5cf6` — purple | 5th series |
| `--chart-6` | `#06b6d4` — cyan | 6th series |

### Progress Bars

Inline horizontal bar used in table rows and cards (e.g. JTD vs Contract %). Use `ProgressBar` component. Auto-colors based on value: green < 75%, orange 75-100%, red > 100%.

### Filter Bars

Dropdown filter row at the top of data pages. Use `FilterBar` + `FilterDropdown` from `@/components/ui/FilterBar`. Filters left, Reset button right.

### Forms

| Pattern | Class / Component | Use |
|---|---|---|
| Single column | `form-group` + `input-label` + `input` | Default for most forms |
| Two column | `form-2col` wrapper + `form-group` inside | Side-by-side field pairs |
| Required field | `input-required` on label | Adds red asterisk |
| Textarea | `textarea` class | Multi-line text input |
| Submit + Clear | `btn btn-primary` + `btn btn-secondary` | Always at bottom, right-aligned |

### Notifications

Post-action feedback: `Toast` component (auto-dismisses after 3.5s). Use `useToast()` hook — no external library.

### Destructive Action Confirmation

Inline only — no modals. Transform the button in place to show "Are you sure? [Cancel] [Delete]". See CLAUDE.md Section 8 for code pattern.

### Two-Column List + Detail Layout

For pages like Proposals where a list panel sits left and detail panel right. Build as two `div`s side by side — left ~35% width, right ~65%. No dedicated component — implement per interface.

### Complex Components (install when needed)

| Component | Library | Install command |
|---|---|---|
| Kanban board | `@hello-pangea/dnd` | `npm install @hello-pangea/dnd` |
| Gantt / Timeline | `frappe-gantt` | `npm install frappe-gantt` |
| Pivot table | `react-pivottable` | `npm install react-pivottable` |

These are not pre-installed in the template. Install only when the interface requires them. Always use the chart color palette — never hardcode colors.

---

## Design System

| Decision | Status | Notes |
|---|---|---|
| Font: Inter | Confirmed for now | Revisit when brand guidelines are formalized |
| Colors: navy `#1e2d4d` + blue `#3b6ef6` | Confirmed for now | Revisit when brand guidelines are formalized |
| Light mode only | Confirmed | Dark mode logged as future improvement in SOP |
| Logo served from Supabase Storage table | Confirmed | Interfaces fetch logo file from a Supabase table at runtime — not hardcoded |

---

## Data & Supabase

| Decision | Status | Notes |
|---|---|---|
| One shared Supabase project for all interfaces | Confirmed for now | Multi-project support logged as future improvement in SOP |
| Airtable = read-only display only | Confirmed | No writes to Airtable from interfaces. Airtable write support logged as future improvement |
| `airtable_keys.app_name` naming convention | Confirmed | Must match `interface-<interface-name>` (same as repo name) |
| Claude asks about tables per component before building | Confirmed | Devs must not defer to default/placeholder table names. Each interface is bespoke |
| Each new interface requires its own interface-specific SOP | Confirmed | See Process section below |

---

## Security

| Decision | Status | Notes |
|---|---|---|
| `airtable_keys` RLS — service role only, no authenticated read | **Resolved** | Removed authenticated read policy. Server route uses `SUPABASE_SERVICE_ROLE_KEY` to read keys after validating user session. Users cannot query the table from the browser. |
| `user_app_access` + `app_registry` RLS | **Deferred to portal build** | This is a portal-app concern, not a template concern. Discuss and implement when building `portal-app`. Only admin users see the full list; authenticated users see only their assigned apps. |
| Vercel preview URL protection | **Resolved — no action needed** | Preview URLs are randomly generated, not indexed, not discoverable. Data is behind Supabase Auth regardless. With a small dev team, no sharing = no risk. |

---

## Deployment & Infrastructure

| Decision | Status | Notes |
|---|---|---|
| Domain: `amped-i.com` and subdomains | **Not blocking** | Interfaces use `*.vercel.app` until domain confirmed. Switchover = DNS change only, no redeployment |
| Vercel team under `Amped-I-LLC` org | **Done** | Team created, connected to GitHub org. Upgrade to Pro before deploying private repos |
| One Supabase project currently | Confirmed | Same as data section — multi-project is future |
| Each interface = own Vercel project = own subdomain | Confirmed | `app-<name>.amped-i.com` pattern |

---

## Process

| Decision | Status | Notes |
|---|---|---|
| Repo creation is manual | Confirmed | Dev creates repo on GitHub under `Amped-I-LLC`, pulls template, works from there. This process does NOT auto-create repos. |
| Repo naming convention | Confirmed | `interface-<interface-name>` for interfaces, `portal-app` for the portal |
| `airtable_keys.app_name` convention | Confirmed | Must match repo name: `interface-<interface-name>` |
| `main` branch always protected | Confirmed | Require PR + review before merging to main |
| Always branch off `main` for new work | Confirmed | Never work directly on `main`. Create a branch immediately after cloning the template |
| Template SOP is maintained by Amped I | Confirmed | Changes to the template SOP are pushed to this repo only |
| Per-interface SOP is separate | Confirmed | Each new interface project has its own SOP documenting what that interface does. Changes there do NOT push back to the template |
| Template is standalone | Confirmed | Edits made in new interface projects do not affect the template repo |
| `CLAUDE.md` is a starting point | Confirmed | No need to modify per project. Feed specifics (table names, schema, etc.) to Claude Code during the session as needed |

---

## The App Portal

| Decision | Status | Notes |
|---|---|---|
| Portal work status | In progress | Repo: `interface-portal-app` under `Amped-I-LLC` |
| Portal mockup | Available | Feed the mockup directly to Claude Code when starting portal work |
| App statuses | Confirmed | `live`, `maintenance`, `coming_soon` |
| Access management | Confirmed | Admins manage `user_app_access` and `app_registry` directly in Supabase — no admin UI needed initially |

---

## GitHub / Commits

| Decision | Status | Notes |
|---|---|---|
| Commit authorship | Confirmed | Commits are by whichever dev worked on the build — no shared bot account |
| Branch protection on `main` | Confirmed | Always enforced from day one on every repo |

---

## Future Improvements Log
*(Items confirmed for future but not current scope)*

- [ ] Dark mode support
- [ ] Multi-Supabase project support per interface
- [ ] Airtable write support (with sync-back to Supabase)
- [ ] Domain confirmation and DNS setup — `amped-i.com` (**crucial, pending**)
- [ ] Vercel team setup under `Amped-I-LLC` (**crucial, pending**)
- [ ] RLS scoping on `airtable_keys` per app (security — deferred)
- [ ] RLS on `user_app_access` and `app_registry` (security — deferred)
- [ ] Vercel preview URL protection (security — deferred)
- [ ] Admin UI for managing `user_app_access` (portal — future)
- [ ] Logo management UI (currently Supabase Storage direct)

---

## Open / Deferred Items
*(Needs a dedicated discussion before implementing)*

- Security model for `airtable_keys` RLS — should it be scoped per app or per user?
- Security model for `user_app_access` + `app_registry` RLS
- Vercel preview URL access control policy
