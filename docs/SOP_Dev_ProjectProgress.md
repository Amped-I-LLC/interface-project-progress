# SOP — Dev Record: Project Progress Dashboard
**Interface:** `interface-project-progress`
**Repo:** `https://github.com/Amped-I-LLC/interface-project-progress`
**Last updated:** April 2026

---

## 1. What This Interface Does

The Project Progress Dashboard is a read-only, single-page internal dashboard for the Client Success team. It displays all active projects pulled live from Airtable, grouped and filtered by budget status, ops stage, and client. It gives leadership and PMs a real-time view of project health, budget consumption, and completion percentage across the active project portfolio.

There is no sidebar. The interface is a full-width custom layout with a sticky dark header, filter controls, and a main content area.

---

## 2. Who Uses It

- **Client Success / Leadership** — monitors overall portfolio health at a glance
- **Project Managers** — checks their own projects' budget and time status

---

## 3. Stack & Architecture

| Layer | Detail |
|---|---|
| Framework | Next.js 14.2.x (App Router, JavaScript only) |
| Auth | Supabase Auth via `@supabase/ssr` |
| Data | Airtable — read-only, fetched server-side via `/api/airtable` |
| Hosting | Vercel — Amped-I-LLC team |
| Middleware | `middleware.js` (entry point) → `proxy.js` (logic) |

**Important middleware note:** Next.js 14 requires the middleware entry point to be named `middleware.js`. The project template uses `proxy.js` for the middleware logic (anticipating a future Next.js convention change). The `middleware.js` file re-exports the `middleware` function from `proxy.js` but defines `config` (including the route matcher) statically in `middleware.js` itself — this is required because Next.js cannot statically analyze a re-exported `config` object. Do not move the `config` back into a single re-export.

---

## 4. File Structure

```
app/
  (auth)/login/page.jsx       — Login page (Supabase email + password)
  (protected)/
    layout.jsx                — Full-width passthrough layout (no sidebar/topbar)
    page.jsx                  — The entire dashboard (single page, self-contained)
  api/airtable/route.js       — Server-side Airtable proxy
  globals.css                 — Design system CSS variables and utility classes
  layout.jsx                  — Root layout (imports globals.css)
components/
  layout/
    Sidebar.jsx               — Template file, unused in this interface (kept for future use)
    Topbar.jsx                — Template file, unused in this interface (kept for future use)
middleware.js                 — Next.js middleware entry point
proxy.js                      — Route protection logic (session check + portal access check)
```

---

## 5. Data Source

| | Detail |
|---|---|
| Source | Airtable |
| Access | Server-side only via `/api/airtable` route |
| Airtable Base | Configured in Supabase `airtable_keys` table under `app_name = interface-project-progress` |
| Table | `All Projects` |
| Filter | `OR({Ops Stage}="Active",{Ops Stage}="Active (Accrual)",{Ops Stage}="Active (As-Builts)")` |

### Fields used

| Field Name in Airtable | Used As | Notes |
|---|---|---|
| `Level1Name` | Project name | Linked record field — code extracts first string value |
| `ClientName` | Client name | Linked record field — code extracts first string value |
| `Ops Stage` | Stage filter + stage tag | Plain string |
| `Contract` | Contract amount | Parsed as float |
| `JTD` | Job-to-date spend | Parsed as float |
| `Contract Remaining` | Remaining budget | Parsed as float; falls back to `Contract - JTD` if null |
| `Final Overall Budget Status` | Budget status | Parsed string — see status logic below |
| `ProjMgrName` | PM name | Linked record field — code extracts first string value |
| `PM Reported % Complete` | % complete bar | Handles both 0–1 (decimal) and 0–100 (integer) formats |
| `Planned Hours` | Baseline hours | Parsed as float |
| `Actual Hours` | Actual hours | Parsed as float |
| `Drawing Count` | Drawing count | Displayed as raw value |
| `PlanStartDate` | Plan start date | ISO date string |

---

## 6. Business Logic

### Budget Status
Derived by parsing the `Final Overall Budget Status` Airtable field string (uppercased):

| Result | Condition |
|---|---|
| `ok` (green) | String does not contain "OVER" |
| `warn` (yellow) | String contains "TASK OVER" |
| `over` (red) | String contains "OVER" but not "TASK OVER" |

### % Complete normalization
The `PM Reported % Complete` field can come in as either a decimal (0.0–1.0) or integer (0–100). The `normPct()` function detects which format by checking `n <= 1` and converts accordingly.

### Dollar formatting
All dollar amounts use `fmt$()` which formats to 2 decimal places in all cases:
- `>= $1M`: shown as `$X.XXM`
- `>= $1,000`: shown as `$X,XXX.XX`
- `< $1,000`: shown as `$X.XX`

### Client group rollup
Contract, JTD, and Remaining values are summed across all projects in a client group. The Remaining value can go negative (overage), in which case it displays in red labeled "Overage" instead of "Remaining".

### Project sort within client groups
Within each client group, projects are sorted: Over Budget → Task Over → OK, then alphabetically by project name within each status tier.

### Date sort fallback
In the flat date-sorted view, projects with no `PlanStartDate` sort to the end (ascending) or beginning (descending).

---

## 7. Auth & Access

- All routes are protected by `proxy.js` via `middleware.js`
- Unauthenticated users are redirected to `/login`
- If `NEXT_PUBLIC_APP_NAME` is set and the app is registered in `portal_apps`, users must also have a `portal_user_app_access` row — admins bypass this check
- Sign out uses Supabase `signOut()` and redirects to `/login`

---

## 8. Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Server-only — reads `airtable_keys` table |
| `NEXT_PUBLIC_APP_NAME` | `.env.local` + Vercel | `interface-project-progress` — enables portal access check |
| `NEXT_PUBLIC_PORTAL_URL` | `.env.local` + Vercel | Redirect target if user lacks portal access |

---

## 9. Known Limitations & Deferred Items

- **Filter options are hardcoded** — Budget status options (On Budget / Task Over / Over Budget) and Ops Stage options are hardcoded in the UI. They are not fetched dynamically from Airtable.
- **Drawing Count** — displays the raw value from the `Drawing Count` Airtable field. No logic determines "completed" vs. total drawings; it is a simple count display.
- **Read-only** — no editing, no write-back to Airtable. All data is display-only.
- **No project detail view** — clicking a project row does nothing. A drill-down detail page is deferred.
- **No export** — no CSV or PDF export. Deferred.
- **Single page** — this is a single-page interface. The sidebar and topbar template components are present in the repo but unused. They are retained for potential future use.

---

## 10. Deployment

- Hosted on Vercel under the Amped-I-LLC team
- Auto-deploys on push to `main`
- All five environment variables above must be set in Vercel project settings before first deploy
