# Amped I — Interface Template Rules
## Context document for Claude Code sessions

This file is loaded automatically by Claude Code when working in any repo stamped from this template.
It is the authoritative guide for how to build interfaces in this system.
Do not modify this file per project — feed project-specific details (table names, schema, etc.) during the session.

---

## 1. What This Template Is

This is the Amped I custom interface template. Every internal interface built at Amped I starts from this template. It provides:

- A consistent design system (CSS variables, no hardcoded colors)
- Supabase Auth with protected routes out of the box
- A sidebar + topbar layout shell
- A reusable UI component library
- A server-side Airtable integration pattern
- This `CLAUDE.md` as a knowledge base for Claude Code sessions

When working in a repo stamped from this template, follow every rule in this file.

---

## 2. Starting a New Interface — The Process

### Repo creation (manual — Claude does not create repos)
1. Go to [github.com/Amped-I-LLC](https://github.com/Amped-I-LLC) and open the `amped-i-custom-interface-development` repository.
2. Click **"Use this template"** → **"Create a new repository"**.
3. Set the owner to `Amped-I-LLC`, name the repo `interface-<interface-name>`, and set visibility to **Public** (switch to Private once Vercel Pro is confirmed).
   - Examples: `interface-sales-dashboard`, `interface-hr-portal`, `interface-finance-tracker`
4. Click **Create repository**. GitHub clones the full template into the new repo — no manual merge needed.
5. Clone the new repo locally:
   ```bash
   git clone https://github.com/Amped-I-LLC/interface-<name>.git
   cd interface-<name>
   npm install
   cp .env.local.example .env.local   # then fill in your Supabase values
   ```
6. For **existing deployed projects**, immediately create a working branch — never make changes directly on `main`:
   ```bash
   git checkout -b develop
   ```
   For **brand new projects** with no prior deployment, you may work directly on `main`.

### Stamp the new project (7 things to change)
| What | File | Change to |
|---|---|---|
| App display name | `components/layout/Sidebar.jsx` — logo block | Interface display name |
| Nav items | `components/layout/Sidebar.jsx` — `NAV_ITEMS` | Your pages and routes |
| Browser tab title | `app/layout.jsx` — `metadata.title` | Interface name |
| Supabase credentials | `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard → Project Settings → API |
| App name | `.env.local` | `NEXT_PUBLIC_APP_NAME` = the exact GitHub repo name (e.g. `interface-sales-dashboard`). Used by `proxy.js` to enforce portal access. Leave blank only if this interface is intentionally not listed in the App Portal. |
| Portal URL | `.env.local` | `NEXT_PUBLIC_PORTAL_URL` = `https://portal.amped-i.com` (only change if the portal domain changes) |
| Vercel env vars | Vercel project settings | All six values above — same as `.env.local` |

### Branch rules
- **New projects** (no prior deployment): work directly on `main` is allowed
- **Existing deployed projects**: always branch from `main` — use `develop` or `feature/<name>` or `fix/<name>`
- Merging back to `main` on existing projects requires a PR (see `docs/SOP_Custom_Interface_Development.md` Phase 8)

### Airtable pre-build requirement
If this interface uses Airtable, the `airtable_keys` row for this interface **must exist in Supabase before the build starts**. Before building any Airtable page, confirm with the dev:

> "Does the `airtable_keys` row for this interface already exist in Supabase? It needs to be there before we can build and test any Airtable page. If not, add it now: Supabase table editor → `airtable_keys` → insert a row with `app_name` matching this repo name, plus the `base_id` and `api_key` for the Airtable base."

Do not build any Airtable page until the dev confirms the row exists.

### Deploy to Vercel (one-time setup per project)
This is a manual step — Claude does not deploy. After the build is complete and reviewed:

1. Log in to [vercel.com/amped-i-llc](https://vercel.com/amped-i-llc) — confirm you are on the **Amped-I-LLC team**, not your personal account.
2. Click **Add New Project** → select the GitHub Org (`Amped-I-LLC`) and choose the repo.
3. Vercel auto-detects Next.js — no build configuration needed.
4. **Before clicking Deploy**, go to **Environment Variables** and add all values from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(server-only — never prefix with `NEXT_PUBLIC_`)*
5. Click **Deploy**. The app goes live at `[project-name].vercel.app` within ~60 seconds.

After setup, all future deploys are automatic — pushing to `main` triggers a rebuild and redeploy. For rollback and custom subdomains, see `docs/SOP_Technical_Reference.md` Section 9.

### Post-Deploy (complete after the interface is confirmed live)
Remind the dev to complete these steps before handing off to users:

1. **App Portal** — Add a row to `app_registry` in Supabase (`app_name`, `app_url`, `description`, `icon`, `status = live`) so the interface appears in the portal.
2. **User access** — Add initial users to `user_app_access` in Supabase, linking their `user_id` to the new `app_id`.
3. **Custom subdomain** — Set up `app-[name].amped-i.com` in Vercel → Project Settings → Domains.
4. **End User SOP to .docx** — Convert only if the interface is being shared with staff and they need a document.

---

## 3. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Interface repo | `interface-<name>` | `interface-sales-dashboard` |
| Portal repo | `portal-app` | `portal-app` |
| `airtable_keys.app_name` | Same as repo name | `interface-sales-dashboard` |
| New page route | `app/(protected)/<page-name>/page.jsx` | `app/(protected)/contacts/page.jsx` |
| New component | `components/ui/<ComponentName>.jsx` | `components/ui/ContactCard.jsx` |
| New API route | `app/api/<route-name>/route.js` | `app/api/airtable/route.js` |

---

## 4. Starting a Session — How to Gather Context

### Step 0 — Determine if this is a new build or an update
This is the first question to ask before anything else. The answer determines the entire workflow.

> "Are we building a **new interface** from scratch, or making **changes to an existing deployed interface**?"

- **New interface** → proceed with Steps 1–5 below, then follow the Phase 2–7 build flow (`docs/SOP_Custom_Interface_Development.md`)
- **Existing interface** → skip Steps 1–5 and go directly to the Phase 8 update flow: create a branch from `main`, make changes, get preview URL, open PR, merge. Do not re-stamp the project or re-ask scoping questions that were already answered during the original build.

### Step 1 — Check for a context document
At the start of every session, check if `docs/` contains a per-interface SOP, scope document, or project brief. If one exists, read it before asking any questions. If none exists, ask:

> "Do you have a scope document, project brief, or SOP for this interface? If so, share it and I'll use it as the starting point. If not, I'll ask a few questions to understand what we're building."

A scope document can be anything — a written brief, a Notion page pasted in, a bullet list of requirements. It does not need to be a formal SOP.

### Step 2 — Understand the interface before asking about implementation
Before asking about any specific files, components, or nav items, ask about the interface as a whole:

- What does this interface do and who uses it?
- What are the main sections or pages it needs?
- What data does the user need to see or interact with?

Derive nav items, file names, and component structure from the answers — do not ask about them directly.

### Step 3 — Establish the layout approach
The template ships with a built-in sidebar and topbar layout. These are the default for all interfaces. Present this to the user and confirm:

> "This template includes a sidebar navigation and topbar by default. I'll use those as the layout shell. Does that work for this interface, or do you need a different layout?"

Only deviate from the default layout if the user explicitly asks.

### Step 4 — Ask about data before building any page
**Every interface is bespoke. Never assume or use placeholder table names.**

Before building any page or component that touches data, confirm:
- What Supabase table does this page read from?
- What columns are relevant for this view?
- Is there an Airtable source for any of this data?
- What does the user need to do with this data — view only, or edit?

### Step 5 — App Portal inclusion
Ask whether this interface should be listed in the App Portal:

> "Should this interface appear in the App Portal (`portal.amped-i.com`) so staff can find and launch it from there? If yes, I'll document the portal registration details now so they're ready for post-deploy."

- **Yes** → collect and record in the per-interface SOP: `app_name` (matches repo name), a short `description` (1 sentence, shown on the portal card), and an `icon` (emoji). Also note which users or roles should have access — this determines the `user_app_access` rows that need to be inserted after deploy.
- **No** → skip `app_registry` and `user_app_access` steps in post-deploy. The interface will still require a valid Supabase session but will not appear in the portal.

### Step 6 — Auth and login page
The login page and Supabase Auth are always included — they are part of the template and are never optional. Do not ask about them. `proxy.js` protects all routes automatically.

---

## 5. Project Stack

- **Framework:** Next.js 14+ with App Router (no Pages Router)
- **Language:** JavaScript (no TypeScript)
- **Styling:** CSS variables from `app/globals.css` only
- **Auth:** Supabase Auth via `@supabase/ssr`
- **Primary data:** Supabase (PostgreSQL) — single shared project currently
- **Secondary data:** Airtable — server-side, read-only display only
- **Deployment:** Vercel — one project per interface repo

---

## 6. File Structure Rules

| New thing | Where it goes | Also do |
|---|---|---|
| New page | `app/(protected)/<page-name>/page.jsx` | Add to `NAV_ITEMS` in `Sidebar.jsx` |
| New API route | `app/api/<route-name>/route.js` | Server-side only |
| New UI component | `components/ui/<ComponentName>.jsx` | Use CSS variables only |
| New data helper | `lib/<helper>.js` | |
| New layout component | `components/layout/<Name>.jsx` | |

**Never:**
- Create a `pages/` directory — App Router only
- Add `.ts` or `.tsx` files
- Create files outside the structure above without explicit instruction

---

## 7. Design System Rules

All colors, spacing, typography, and radius values come from CSS variables in `app/globals.css`. **Never hardcode hex values, pixel values for colors, or font names directly in components.**

### Color variables
```css
/* Brand */
--color-primary          /* #3b6ef6 — buttons, active states */
--color-primary-hover    /* darker blue on hover */
--color-primary-light    /* very light blue — highlights */

/* Sidebar */
--color-sidebar-bg       --color-sidebar-text
--color-sidebar-active   --color-sidebar-active-text
--color-sidebar-label    --color-sidebar-hover
--color-sidebar-border

/* Page */
--color-bg-page          /* page background */
--color-bg-card          /* card/panel background */
--color-bg-input         /* input field background */

/* Text */
--color-text-primary     /* headings, strong text */
--color-text-secondary   /* body text */
--color-text-muted       /* hints, placeholders */

/* Borders */
--color-border           --color-border-focus

/* Status */
--color-success / --color-success-light
--color-warning / --color-warning-light
--color-danger  / --color-danger-light
--color-info    / --color-info-light
```

### Layout, spacing, radius, shadow variables
```css
--sidebar-width: 240px    --topbar-height: 56px
--space-1: 4px  --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px --space-6: 24px  --space-8: 32px
--radius-sm: 4px  --radius-md: 8px  --radius-lg: 12px
--radius-xl: 16px --radius-full: 9999px
--shadow-sm  --shadow-md  --shadow-lg
```

### CSS utility classes (use in `className` props)
```
.card  .card-header
.btn   .btn-primary  .btn-secondary  .btn-danger  .btn-sm  .btn-lg
.badge .badge-success .badge-warning .badge-danger .badge-info .badge-neutral
.input .select .textarea .input-label .form-group
.table-wrapper
.page-header  .page-content
.grid-2  .grid-3  .grid-4
.skeleton  .section-label  .divider
.text-muted  .text-primary  .text-brand  .text-sm  .text-xs
```

---

## 8. Available UI Components

Always use these before building custom equivalents.

### Core components
| Component | Import | Key props |
|---|---|---|
| `Button` | `@/components/ui/Button` | `variant` (primary/secondary/danger), `size` (sm/md/lg), `disabled`, `onClick` |
| `Badge` | `@/components/ui/Badge` | `variant` (success/warning/danger/info/neutral) |
| `Card` | `@/components/ui/Card` | `title`, `action` (ReactNode for header right slot) |
| `StatCard` | `@/components/ui/StatCard` | `label`, `value`, `subtitle`, `trend`, `trendUp`, `variant`, `wide` |
| `DataTable` | `@/components/ui/DataTable` | `columns` (array), `data` (array), `pageSize` |
| `EmptyState` | `@/components/ui/EmptyState` | `icon`, `title`, `message`, `action` (ReactNode) |
| `LoadingSkeleton` | `@/components/ui/LoadingSkeleton` | `lines`, `height`, `card` (boolean) |
| `ProgressBar` | `@/components/ui/ProgressBar` | `value`, `max`, `color` (auto/primary/success/warning/danger), `showLabel`, `height` |
| `FilterBar` + `FilterDropdown` | `@/components/ui/FilterBar` | See component file for usage |
| `BarChart` | `@/components/ui/BarChart` | `data`, `xKey`, `bars` ([{key, label, color?}]), `height`, `legend`, `yTickFormat` |
| `ToastContainer` + `useToast` | `@/components/ui/Toast` | See component file for usage |

### StatCard variants
```jsx
<StatCard label="YTD: Revenue"  value="$844,418" variant="blue"   subtitle="Sum of actual revenue" />
<StatCard label="YTD: Expenses" value="$871,760" variant="orange" />
<StatCard label="YTD: Profit"   value="-$27,342" variant="green"  />
<StatCard label="Over Budget"   value={28}        variant="red"   />
<StatCard label="Task Over"     value={44}        variant="yellow"/>
<StatCard label="Revenue As Of" value="4/1/2026"  wide />   {/* spans 2 cols */}
```

### DataTable columns format
```js
const columns = [
  { key: 'name',     label: 'Name',     sortable: true },
  { key: 'progress', label: 'Progress', render: (val) => <ProgressBar value={val} /> },
  { key: 'status',   label: 'Status',   render: (val) => <Badge variant="success">{val}</Badge> },
]
```

### BarChart usage
```jsx
// Single bar
<BarChart data={data} xKey="month" bars={[{ key: 'revenue', label: 'Revenue' }]} />

// Grouped bars — colors follow the chart palette automatically
<BarChart
  data={data}
  xKey="month"
  bars={[
    { key: 'revenue',  label: 'Revenue' },
    { key: 'expenses', label: 'Expenses' },
  ]}
  height={320}
/>
```

### FilterBar usage
```jsx
const [filters, setFilters] = useState({ client: '', status: '' })

<FilterBar onReset={() => setFilters({ client: '', status: '' })}>
  <FilterDropdown
    label="Clients"
    value={filters.client}
    options={clientOptions}
    onChange={v => setFilters(f => ({ ...f, client: v }))}
  />
  <FilterDropdown
    label="Status"
    value={filters.status}
    options={statusOptions}
    onChange={v => setFilters(f => ({ ...f, status: v }))}
  />
</FilterBar>
```

### Toast usage
```jsx
import { useToast, ToastContainer } from '@/components/ui/Toast'

const { toasts, toast } = useToast()

// In your handler:
toast('Record saved.', 'success')
toast('Something went wrong.', 'error')

// In JSX:
<ToastContainer toasts={toasts} />
```

### Inline confirmation pattern
For delete or destructive actions, handle confirmation inline — no modal overlay. Transform the row or button in place:
```jsx
const [confirming, setConfirming] = useState(false)

{confirming ? (
  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Are you sure?</span>
    <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
    <button className="btn btn-secondary btn-sm" onClick={() => setConfirming(false)}>Cancel</button>
  </span>
) : (
  <button className="btn btn-secondary btn-sm" onClick={() => setConfirming(true)}>Delete</button>
)}
```

---

## 8b. Sidebar Nav — Sub-Items

Nav items in `Sidebar.jsx` can have nested children. Children expand/collapse on click of the parent. The parent label automatically becomes the breadcrumb section in the Topbar.

```js
// Direct link (no sub-items)
{ label: 'Dashboard', href: '/', icon: '▦' }

// Parent with sub-items (click to expand)
{
  label: 'Finance',
  icon: '$',
  children: [
    { label: 'Scorecard', href: '/finance/scorecard' },
    { label: 'Expenses',  href: '/finance/expenses' },
  ]
}
```

The breadcrumb renders as `Finance › Scorecard` in the Topbar automatically — no extra code needed in the page.

## 8c. Complex Component Libraries

For complex visualizations, use these libraries. They are **not pre-installed** — install them when the interface requires them.

| Component | Library | Install |
|---|---|---|
| Kanban board | `@hello-pangea/dnd` | `npm install @hello-pangea/dnd` |
| Gantt / Timeline | `frappe-gantt` | `npm install frappe-gantt` |
| Pivot table | `react-pivottable` | `npm install react-pivottable` |

**Rules for complex components:**
- Always use the design system chart color palette (`--chart-1` through `--chart-6`) — never hardcode colors
- Ask the dev to confirm data structure and grouping before building
- These are customized per interface — do not build a generic wrapper; implement to spec

## 9. Auth & Security Rules

- `proxy.js` protects all routes not in `PUBLIC_ROUTES` — do not add auth checks in page components
- `proxy.js` runs two checks on every request:
  1. **Session check** — no valid Supabase session → redirect to `/login`
  2. **Portal access check** — if `NEXT_PUBLIC_APP_NAME` is set and the app is registered in `portal_apps`, the user must have a `portal_user_app_access` row for this app. Admins (`portal_profiles.is_admin = true`) bypass this check. Unauthorized users are redirected to `NEXT_PUBLIC_PORTAL_URL`.
- Use `@/lib/supabase/client` in Client Components (`'use client'`)
- Use `@/lib/supabase/server` in Server Components and API routes

### Cross-App SSO — How It Works

All interfaces share the **same Supabase project**. Whether a user logged in on one app is automatically logged in on another depends entirely on whether they share a domain:

**Current state (separate Vercel domains — e.g. `app-a.vercel.app`, `app-b.vercel.app`):**
- Browser cookies are domain-scoped — the portal session cookie is not visible to the estimator or any other app
- Each app requires its own login — there is no automatic session sharing

**After custom domain setup (e.g. `portal.amped-i.com`, `estimator.amped-i.com`):**
- Configure all Supabase clients in every app to set cookies on the shared root domain:
  ```js
  // In lib/supabase/client.js, lib/supabase/server.js, and proxy.js
  cookieOptions: { domain: '.amped-i.com' }
  ```
- The browser then sends the same session cookie to every `*.amped-i.com` subdomain
- User logs in once at the portal → automatically authenticated on all other apps — no extra login prompt
- The `proxy.js` portal access check still runs on each app to enforce per-user access grants

**Important:** Even with SSO active, each app still enforces its own `portal_user_app_access` check. A valid session does not grant access to every app — the user must also have an explicit access row for that app. This is handled automatically by the template's `proxy.js`.

**When setting up the custom domain:** update `cookieOptions` in all three Supabase helper files (`lib/supabase/client.js`, `lib/supabase/server.js`, and `proxy.js`) in every interface repo. See `docs/SOP_Custom_Interface_Development.md` Phase 7 for the checklist step.

### Service Role Key Rules
The `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies. It is used only in `app/api/airtable/route.js` to read the `airtable_keys` table. Strict rules:
- **Never** prefix with `NEXT_PUBLIC_` — this keeps it out of the browser JS bundle
- **Never** import or reference it in any `'use client'` component
- **Never** log it with `console.log` or any logging — not even in server routes
- **Never** commit the actual value — it lives in `.env.local` and Vercel env vars only
- **Only** use it in `app/api/` server routes, and only when the user session is validated first

### Airtable Keys Security Model
The `airtable_keys` table has **no RLS read policy** for authenticated users. Users cannot query it from the browser. Only the service role can read it, and only the server-side Airtable route uses the service role — after first validating the user is authenticated via their session.

---

## 10. Data Layer Rules

### Supabase (primary — all writes go here)
```js
// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase.from('table_name').select('*')

// Server Component or API route
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Airtable (secondary — read-only display only)
```js
import { fetchAirtable } from '@/lib/airtable'
const records = await fetchAirtable({ app: 'interface-<name>', table: 'TableName' })
```

### Rules
- **All writes go to Supabase only** — never write to Airtable from an interface
- Airtable is for displaying operational data that lives there — read-only
- All Airtable reads go through `/api/airtable/route.js` — never call Airtable directly from a component
- Airtable API keys live in the Supabase `airtable_keys` table — never in `.env` or any client file
- The `app` param in `fetchAirtable()` must match `airtable_keys.app_name`, which matches the repo name (`interface-<name>`)

### Logo pattern
The app logo/branding is fetched from a Supabase storage table at runtime — it is not hardcoded. When implementing logo display, read it from Supabase rather than embedding a static file.

---

## 11. Page Title Pattern

Every page sets its Topbar title via the `usePageTitle` hook:

```js
'use client'
import { usePageTitle } from '@/lib/page-context'

export default function MyPage() {
  usePageTitle('Page Title', 'Optional subtitle')
  // ...
}
```

---

## 12. Scaffold Files — Use These, Don't Recreate

The template ships with two scaffold files. Always use them as the starting point — do not write new pages from scratch.

### `app/(protected)/page.jsx` — Home / Dashboard page
This is the default landing page after login. Replace its content with the real home view for this interface. Do not create a new file — edit this one in place.

### `app/(protected)/sample/page.jsx` — First data page scaffold
This file demonstrates the full Supabase + Airtable data fetching pattern with StatCards, DataTable, LoadingSkeleton, EmptyState, and Badge. When building the first data page:
1. Rename or repurpose this file to match the first real page route
2. Replace the placeholder constants (`SUPABASE_TABLE`, `AIRTABLE_APP`, `AIRTABLE_TABLE`) with confirmed real values
3. Update columns to match the actual data structure
4. Once the first real page is complete, delete the sample file if it was not converted — do not leave it in the repo

For subsequent pages (after the first), use the following as the base structure:

```jsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePageTitle } from '@/lib/page-context'
import Card from '@/components/ui/Card'
import DataTable from '@/components/ui/DataTable'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'

const TABLE_NAME = 'confirmed_table_name'

const columns = [
  { key: 'field', label: 'Label', sortable: true },
]

export default function PageName() {
  usePageTitle('Page Title', 'Subtitle')

  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from(TABLE_NAME)
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setData(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>Page Title</h1>
        <p>Page description.</p>
      </div>
      <div className="page-content">
        <Card title="Data">
          {loading ? <LoadingSkeleton lines={5} /> :
           error   ? <EmptyState icon="⚠️" title="Error" message={error} /> :
                     <DataTable columns={columns} data={data} />}
        </Card>
      </div>
    </div>
  )
}
```

---

## 13. Per-Interface SOP

Every interface built from this template must have its own SOP document inside its repo at `docs/SOP_<InterfaceName>.md`. That document covers:

- What the interface does and who uses it
- What Supabase tables it reads from and writes to
- What Airtable sources it displays
- What each page does
- Any business rules specific to that interface

This per-interface SOP is separate from this template SOP and does not affect the template repo.

---

## 14. Output Rules for Generated Files

When generating a new page or component:
1. Output the complete file — no partial snippets
2. State the exact file path
3. State the `NAV_ITEMS` entry to add to `Sidebar.jsx`
4. Note any new Supabase tables or columns required
5. Never use placeholder table names — always confirm real names first
6. Never output hardcoded test data — use loading/empty states

---

## 15. End-of-Build SOP Generation

At the end of every interface build — once all pages are complete and reviewed — run through the following steps in order:

**Step 1 — Remind the dev to run the final security checklist** before generating docs or deploying:
> "Before we wrap up, run through the security checklist (`docs/SOP_Technical_Reference.md` Section 10):
> - `.env.local` is in `.gitignore` and not committed to GitHub
> - `airtable_keys` table has RLS enabled in Supabase
> - Airtable keys are only read inside `app/api/` server routes
> - All protected pages redirect to `/login` when opened in incognito
> - `service_role` key is not used in any frontend component
> - Repository is set to Private in the GitHub Org
> - Vercel project is linked to the Amped-I-LLC team, not a personal account
> - No sensitive data is logged to the browser console"

**Step 2 — Generate a tailored smoke test** based on the actual pages built in this interface. Output a checklist the dev can run manually before deploying:

```
Smoke Test — [Interface Name]

Generic checks (all interfaces):
 [ ] Login page loads at /login
 [ ] Invalid credentials show an error message
 [ ] Valid credentials redirect to the home page
 [ ] Opening a protected page in incognito redirects to /login
 [ ] Log out button ends the session and redirects to /login

Page checks (confirm data loads and no console errors):
 [ ] [Home page] — stat cards load, no loading spinner stuck
 [ ] [Page 2 name] — table loads, rows visible
 [ ] [Page 3 name] — ...
 (one line per page based on what was built)

If any Airtable pages were built:
 [ ] Airtable data loads without a 500 error
 [ ] Network tab shows Airtable call going to /api/airtable, not directly to airtable.com
```

Replace the bracketed page names with the actual pages built in this session.

**Step 3 — Generate the two SOP documents** and save them to `docs/` in the interface repo.

### Document 1 — Dev SOP
**File:** `docs/SOP_Dev_[InterfaceName].md`

A technical record of what was built. Covers:
- What the interface does and who it is for
- Every Supabase table used (reads and writes), with relevant columns
- Every Airtable source used (base, table, fields displayed)
- Every page: what it shows, what data it uses, what the user can do
- Any business logic, calculated fields, or rules implemented
- Known limitations or deferred items
- Component and library choices specific to this interface

This document is for developers maintaining or extending the interface.

### Document 2 — End User SOP
**File:** `docs/SOP_User_[InterfaceName].md`

A formal, non-technical user guide. Rename `docs/SOP_User_[InterfaceName]_Template.md` to `docs/SOP_User_[InterfaceName].md` (using the actual interface name) and fill in every section based on what was built:
- Replace all placeholder text with real interface content
- Document every page in Section 4 — one subsection per sidebar page
- Write Common Tasks (Section 5) for the most frequent actions a user will take
- Fill in Key Terms, Status Indicators, and Support contacts
- Use formal language — the audience is non-technical staff

**After writing the markdown**, inform the dev:
> "Both SOPs have been saved to `docs/`. To generate the End User SOP as a formatted Word document (.docx) for sharing with staff, ask me to convert `docs/SOP_User_[InterfaceName].md` to docx."

Do not auto-generate the docx — wait for the dev to request it explicitly.

---

*This file is read automatically by Claude Code from the repo root. Do not modify it per project — feed project-specific details during the session.*
