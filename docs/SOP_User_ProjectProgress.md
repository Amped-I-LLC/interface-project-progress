# Project Progress Dashboard — User Guide
**Amped I — Internal Use Only**
**Last updated:** April 2026

---

## 1. Overview

The Project Progress Dashboard gives the Client Success team a live view of all active projects. It shows budget health, hours used, and completion percentage for every active project, pulled directly from Airtable in real time.

The dashboard is read-only. No data can be edited here.

---

## 2. Accessing the Dashboard

1. Navigate to the dashboard URL provided by your administrator
2. Sign in with your Amped I email and password
3. The dashboard loads automatically and displays all active projects

If you do not have access, you will be redirected to the App Portal. Contact your administrator to request access.

---

## 3. The Dashboard at a Glance

When the page loads, a spinner briefly appears while data is fetched from Airtable. Once loaded, the page displays:

- A **sticky header** at the top with summary counts and controls
- A **filter bar** for narrowing which projects are shown
- An **ops stage bar** for filtering by project stage
- A **legend** explaining the color codes
- The **main content area** with all active projects

---

## 4. Header

The dark header at the top of the page stays visible as you scroll.

### Summary Pills
Four numbers update live based on the current filters:

| Pill | What It Shows |
|---|---|
| **Active Projects** | Total number of projects matching current filters |
| **On Budget** | Projects within budget (shown in green) |
| **Task Over** | Projects where hours exceeded baseline but contract is not breached (shown in yellow) |
| **Over Budget** | Projects where job-to-date spend has exceeded the contract amount (shown in red) |

### Buttons
- **Refresh** — re-fetches all project data from Airtable. Use this to get the latest numbers without reloading the page.
- **Sign out** — ends your session and returns you to the login page.

---

## 5. Filtering and Sorting

### Budget Status Filter
Located in the filter bar. Click any pill to narrow the view:

| Option | Shows |
|---|---|
| **All** | All active projects (default) |
| **✅ On Budget** | Only projects within budget |
| **⚠️ Task Over** | Only projects with hours over baseline |
| **🔴 Over Budget** | Only projects that have exceeded their contract amount |

The header counts and main content update immediately when you change this filter.

### Sort Buttons
Three sort options control how projects are displayed:

| Button | View |
|---|---|
| **Group by Client** | Projects grouped under collapsible client sections, sorted A–Z by client (default) |
| **Start Date ↑** | All projects in one flat table, earliest plan start date first |
| **Start Date ↓** | All projects in one flat table, latest plan start date first |

### Search
The search box (right side of the filter bar) filters projects in real time by **project name** or **client name**. It works across whichever view and filters are currently active. Clear the box to show all results.

### Ops Stage Filter
The secondary bar below the main filter bar narrows by project stage:

| Option | Shows |
|---|---|
| **All Active** | All three active stages (default) |
| **Active** | Standard active projects only |
| **Active (Accrual)** | Projects in accrual stage |
| **Active (As-Builts)** | Projects in as-builts stage |

The ops stage filter and budget status filter work together — both apply at the same time.

---

## 6. Legend

The color legend below the filter bars explains the status indicators used throughout the dashboard:

- **Green** — On Budget (OK)
- **Yellow** — Task Over (hours exceeded baseline, but contract not breached)
- **Red** — Over Budget (contract amount exceeded)
- **Purple bar** — % Complete (PM-reported)

The **Last updated** timestamp on the right shows when data was last fetched from Airtable.

---

## 7. Reading the Project Table

### Group by Client View (default)

Each client appears as a collapsible card. The card header shows:
- **Client name**
- **Mini status badges** — quick count of how many projects are OK, Task Over, or Over Budget for that client
- **Total Contract** — sum of all contract values for that client's projects
- **JTD Spent** — total job-to-date spend for that client (shown in red if it exceeds total contract)
- **Remaining / Overage** — budget remaining (green if healthy, yellow if under 10%, red if overrun)

Click the card header to **collapse or expand** the project list for that client.

Within each client card, projects are sorted by severity: Over Budget first, then Task Over, then On Budget — then alphabetically within each group.

### Flat Date View (Start Date ↑ or ↓)

All projects appear in a single table with two additional columns: **Plan Start** (date) and **Client**. Projects sort by their planned start date. Projects with no start date recorded appear at the end.

### Project Row Columns

| Column | What It Shows |
|---|---|
| **Project Name** | Project name. An ops stage tag appears next to the name if the stage is not plain "Active". The PM name appears in smaller text below. |
| **Status** | Colored badge: OK (green), Task Over (yellow), or Over Budget (red) |
| **Budget Used** | A progress bar showing JTD spend vs. contract. Green/yellow/red matches the project status. Below the bar: JTD amount and contract amount (or overage amount if exceeded). |
| **% Complete** | A purple bar showing the PM-reported percent complete, with the number below. |
| **Time Actual / Baseline** | Actual hours logged, baseline hours, and what percentage of the baseline has been used. Shows "No baseline set" if no baseline hours are recorded. |
| **Drawings** | The drawing count for this project as recorded in Airtable. |

---

## 8. Status Definitions

| Status | Color | Meaning |
|---|---|---|
| **OK** | Green | Project spend is within the contract amount |
| **Task Over** | Yellow | Hours have exceeded the planned baseline, but the overall contract amount has not been breached |
| **Over Budget** | Red | Job-to-date spend has exceeded the contract amount |

Status is determined by the **Final Overall Budget Status** field in Airtable, updated by the project accounting system.

---

## 9. Common Tasks

### Check which projects are over budget
1. Click **🔴 Over Budget** in the filter bar
2. The view narrows to only over-budget projects
3. Review the Budget Used column for each — the bar will be full red with the overage amount shown
4. Click **All** to reset the filter

### Find a specific project or client
1. Type the project name or client name in the **search box** (top right of the filter bar)
2. Results filter live as you type
3. Clear the box to show all projects again

### Compare projects by start date
1. Click **Start Date ↑** to sort by earliest start date first
2. Click **Start Date ↓** to reverse the order
3. Click **Group by Client** to return to the default view

### Get the latest data
Click the **Refresh** button in the top-right header. A loading spinner will appear briefly while data is re-fetched from Airtable.

### Sign out
Click the **Sign out** button in the top-right header. You will be returned to the login page.

---

## 10. If Something Looks Wrong

| Symptom | What to do |
|---|---|
| No projects appear | Check your filters — you may have a status or stage filter active. Click **All** and **All Active** to reset. |
| Red error banner at the top | Airtable data failed to load. Click **Refresh** to try again. If it persists, contact your administrator. |
| Numbers seem outdated | Click **Refresh** to pull the latest data from Airtable. |
| A project is missing | It may not be in an active ops stage. The dashboard only shows projects in Active, Active (Accrual), or Active (As-Builts) stages. |

---

## 11. Support

For access issues or data questions, contact your Amped I administrator.
For data accuracy questions (e.g. wrong budget amounts), the source of truth is Airtable — contact the project accounting team.
