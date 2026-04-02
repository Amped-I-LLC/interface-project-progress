# Custom Interface Development — System Overview

| | |
|---|---|
| **Audience** | C-Suite / Leadership |
| **Classification** | Confidential — Internal Use Only |

---

## 1. What We Are Building

Amped I builds custom internal web interfaces for staff — dashboards, reporting tools, project trackers, and data entry forms. Each interface is purpose-built for a specific team or workflow, secured behind user authentication, and connected to the company's data systems.

All interfaces are built from a single shared template. This ensures every interface looks the same, follows the same security rules, and can be maintained by any developer on the team.

---

## 2. The Technology Stack

| Layer | Tool | What It Does | Cost Model |
|---|---|---|---|
| UI Framework | Next.js (React) | Builds the web pages and components | Free, open source |
| Authentication | Supabase Auth | User login, session management | Free tier available; Pro ~$25/month |
| Primary Database | Supabase (PostgreSQL) | Stores all company data | Included in Supabase plan |
| Operational Data | Airtable | Read-only data display from existing Airtable bases (conditional — not all interfaces use Airtable) | Existing company subscription |
| Hosting & Deployment | [Vercel — Amped-I-LLC Team](https://vercel.com/amped-i-llc) | Hosts the live app; auto-deploys on code push | Free for public repos; Pro ~$20/month for private repos |
| Source Control | [GitHub — Amped-I-LLC Org](https://github.com/Amped-I-LLC) | Version control, code governance, deployment trigger | Free for teams |
| AI-Assisted Development | Claude Code (Anthropic) | Accelerates interface builds using the template rules | Per-usage API cost or subscription |
| Task Tracking | [Airtable Task Tracker](https://airtable.com/workspaces/wspC1JuMyCgEf8zjN) | Tracks all interface requests and development work | Existing company subscription |

**Total infrastructure cost per interface:** approximately $45–$50/month at production scale (Supabase Pro + Vercel Pro). Most interfaces share the same Supabase project, so the database cost is shared.

---

## 3. How a New Interface Gets Built

Every interface follows the same process: a request is logged in the task tracker, a scoping session is held with the requester, a developer builds the interface from the shared template, and it is deployed to Vercel and registered in the App Portal for authorized staff.

For the complete step-by-step process including all developer tasks, commands, and checklists, see `docs/SOP_Custom_Interface_Development.md`.

**Typical build time:** 1–3 days for a standard interface (5–8 pages with data tables and charts). Complex interfaces with custom visualizations may take longer. See Section 7 for full timeline expectations.

---

## 4. Security Model

Security is enforced at multiple layers:

| Layer | What It Does |
|---|---|
| Supabase Auth middleware | Every page redirects to login if the user has no valid session — before any content loads |
| Row Level Security (RLS) | Database tables restrict what each authenticated user can read or write |
| Server-side API routes | Airtable API keys and the Supabase service role key never reach the browser |
| Private GitHub repositories | Source code is not publicly accessible |
| Environment variables | All secrets live in Vercel's encrypted environment — never committed to GitHub |

**The Airtable security pattern specifically:** API keys for Airtable are stored in a Supabase database table that only the server can read. When a user requests Airtable data, the server validates their session first, then fetches the key server-side, then calls Airtable — the key never leaves the server.

---

## 5. The App Portal

The App Portal is a central hub where staff log in once and see every interface they have access to. Access is managed per user in Supabase — an admin adds or removes a row in a table to grant or revoke access. No code changes are needed to manage user permissions.

The portal also displays company-wide announcements (new interface launches, notices) managed by any admin through the portal UI.

**Single sign-on (SSO):** All interfaces share the same Supabase project, so the same user accounts apply everywhere. Once all interfaces are moved to a custom root domain (e.g. `portal.amped-i.com`, `estimator.amped-i.com`), session cookies will be shared across all subdomains — a user who logs in to the portal will be automatically authenticated on every other interface without a separate login prompt. Until the custom domain is in place, each interface requires its own login. The access control layer (which apps a user is allowed to see) is enforced independently on each interface regardless of SSO status.

---

## 6. Cost Summary

| Item | Monthly Cost | Notes |
|---|---|---|
| Supabase Pro | ~$25 | Shared across all interfaces |
| Vercel Pro | ~$20 | Required for private repos; covers all interfaces |
| Airtable | Existing subscription | No additional cost |
| GitHub | Free | Org plan if needed: ~$4/user/month |
| Claude Code | ~$20–50 | Depends on build volume; shared team account |
| **Estimated total** | **~$65–115/month** | Scales minimally as more interfaces are added |

---

## 7. Build Timeline Expectations

| Interface Type | Typical Timeline | Notes |
|---|---|---|
| Simple (3–5 pages, read-only data) | 1 day | Data tables, stat cards, no forms |
| Standard (5–8 pages, forms + charts) | 2–3 days | Most interfaces fall here |
| Complex (10+ pages, Kanban/Gantt/custom logic) | 1–2 weeks | Custom visualizations, complex business rules |

These timelines assume the scope is complete and table/column names are confirmed before the build starts. Incomplete scope is the most common cause of delays.

---

## 8. Where to Find More Detail

| Document | Location | Audience |
|---|---|---|
| Custom Interface Development SOP (step-by-step process) | `docs/SOP_Custom_Interface_Development.md` | Developers |
| Technical Reference (architecture and implementation detail) | `docs/SOP_Technical_Reference.md` | Developers |
| UI Defaults and component decisions | `docs/UI_Defaults_and_Preferences.md` | Developers |
| Per-interface dev record | `docs/SOP_Dev_[InterfaceName].md` in each interface repo | Developers |
| Per-interface end user guide | `docs/SOP_User_[InterfaceName].md` in each interface repo | End users / Staff |

---

*Confidential — Internal Use Only*
*Prepared by Amped I Development Team*
