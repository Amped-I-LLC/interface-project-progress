# STANDARD OPERATING PROCEDURE
# [Interface Display Name]
## End User Guide

---

| Document Info | Details |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Active |
| **Audience** | [Target user group — e.g. Project Managers, Finance Team, All Staff] |
| **Classification** | Confidential — Internal Use Only |
| **Interface URL** | [Vercel URL or custom domain] |
| **Last Updated** | [Date] |
| **Prepared By** | Amped I Development Team |

---

## Table of Contents

1. [Purpose & Overview](#1-purpose--overview)
2. [Accessing the Interface](#2-accessing-the-interface)
3. [Navigation](#3-navigation)
4. [Pages & Features](#4-pages--features)
5. [Common Tasks](#5-common-tasks)
6. [Understanding the Data](#6-understanding-the-data)
7. [Troubleshooting](#7-troubleshooting)
8. [Support & Access Requests](#8-support--access-requests)

---

## 1. Purpose & Overview

### 1.1 What This Interface Does

[1–2 sentences describing what the interface is and what business problem it solves.]

**Example:** The Finance Dashboard provides the Finance team with a real-time view of revenue, expenses, and project profitability sourced from Deltek and Airtable. It replaces manual spreadsheet reporting with a live, filtered view of key financial metrics.

### 1.2 Who Uses It

[Describe the intended users and their role in relation to this interface.]

### 1.3 Data Sources

This interface displays data from the following sources:

| Source | What It Provides |
|---|---|
| [e.g. Supabase] | [e.g. Project records, user data] |
| [e.g. Airtable — Finance Base] | [e.g. Revenue and expense actuals] |

> **Note:** All data displayed is read from live sources. Figures update automatically as the underlying data changes.

---

## 2. Accessing the Interface

### 2.1 How to Log In

1. Open your web browser and go to: **[Interface URL]**
2. Enter your company email address and password.
3. Click **Sign in**.
4. You will be taken to the Dashboard upon successful login.

> If you do not have login credentials, contact your administrator. Access is managed centrally and must be granted before you can log in.

### 2.2 Logging Out

Click your name or avatar in the top-right corner of the screen, then click **Log out**. Your session will end immediately.

### 2.3 Session Timeout

Your session remains active while you are using the interface. If you close the browser tab and return within the session window, you will not need to log in again. For security, close the browser when finished on a shared computer.

---

## 3. Navigation

### 3.1 Sidebar

The left sidebar is the main navigation for the interface. It contains:

- **Section labels** (e.g. MAIN, REPORTS) — these group related pages together
- **Nav items** — click any item to go to that page
- **Expandable sections** — some nav items have sub-pages that expand when clicked

### 3.2 Topbar

The top bar shows:
- **Breadcrumb** — your current location (e.g. `Finance › Scorecard`)
- **Your name** — displayed in the top-right corner
- **Log out button** — ends your session

### 3.3 Page Structure

Every page follows the same structure:

| Area | What It Shows |
|---|---|
| Page title and description | Name of the page and a brief explanation of its purpose |
| Summary cards (if present) | Key metrics or counts at a glance |
| Filters (if present) | Dropdowns to narrow the data shown |
| Main content | Data table, chart, form, or a combination |

---

## 4. Pages & Features

> *This section is generated per interface. Each page is documented below.*

---

### 4.1 Dashboard

**Purpose:** [What this page shows and why it matters.]

**What you will see:**

| Element | Description |
|---|---|
| [Stat card label] | [What the number means and how it is calculated] |
| [Chart name] | [What data the chart shows, what the axes mean] |
| [Table name] | [What records are shown and what each column means] |

**Available actions:**
- [e.g. Click a stat card to drill into the underlying records]
- [e.g. Use the date filter to change the reporting period]

---

### 4.2 [Page Name]

**Purpose:** [What this page shows and why it matters.]

**What you will see:**

| Element | Description |
|---|---|
| [Element] | [Description] |

**Available actions:**
- [Action 1]
- [Action 2]

---

### 4.3 [Page Name]

**Purpose:** [What this page shows and why it matters.]

**What you will see:**

| Element | Description |
|---|---|
| [Element] | [Description] |

**Available actions:**
- [Action 1]
- [Action 2]

---

*[Add additional page sections as needed. Each page in the sidebar gets its own subsection.]*

---

## 5. Common Tasks

> *Step-by-step instructions for the most frequent actions a user will take in this interface.*

### Task 1 — [Task Name, e.g. "Filter data by client"]

1. Navigate to the [Page Name] page using the sidebar.
2. Locate the **[Filter Name]** dropdown at the top of the page.
3. Click the dropdown and select the desired value.
4. The page will update automatically to show only matching records.
5. To clear the filter, click **Reset**.

---

### Task 2 — [Task Name, e.g. "Submit a form"]

1. Navigate to the [Page Name] page using the sidebar.
2. Fill in all required fields (marked with a red asterisk **\***).
3. Review your entries for accuracy.
4. Click **Submit**.
5. A confirmation message will appear at the top of the screen if the submission was successful.

> If you see an error message, check that all required fields are filled in and that values are in the correct format.

---

### Task 3 — [Task Name]

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 6. Understanding the Data

### 6.1 Data Refresh

[Describe how often the data updates — e.g. "Data is live and reflects the current state of the source system at the time you load the page." or "Data refreshes every 15 minutes."]

### 6.2 Key Terms and Definitions

| Term | Definition |
|---|---|
| [Term] | [Plain-English definition as it applies to this interface] |
| [Term] | [Plain-English definition] |
| [Term] | [Plain-English definition] |

### 6.3 Status Indicators

Color-coded badges and indicators are used throughout the interface:

| Color / Label | Meaning |
|---|---|
| 🟢 Green / Active | [What this status means in context] |
| 🟡 Yellow / Pending | [What this status means in context] |
| 🔴 Red / Over Budget | [What this status means in context] |
| ⚪ Grey / Inactive | [What this status means in context] |

---

## 7. Troubleshooting

| Issue | Likely Cause | What To Do |
|---|---|---|
| Cannot log in | Incorrect password or no access granted | Use the password reset link on the login page, or contact your administrator |
| Page shows no data | Filter is active with no matching results, or data source is temporarily unavailable | Check if a filter is applied and reset it. If the issue persists, contact support |
| Page takes a long time to load | Large dataset or slow connection | Wait 10–15 seconds and refresh the page. If it continues, contact support |
| Numbers look unexpected | Data may have been updated in the source system | Refresh the page to get the latest data. If figures still look incorrect, contact the data owner |
| "Unauthorized" or redirected to login unexpectedly | Session expired | Log in again. If this happens repeatedly, contact support |

---

## 8. Support & Access Requests

### 8.1 Who to Contact

| Need | Contact |
|---|---|
| Login access or password reset | [Administrator name or email] |
| Data questions (incorrect figures, missing records) | [Data owner or team] |
| Technical issues (page not loading, errors) | [IT or development contact] |
| Feature requests or feedback | [Product owner or development contact] |

### 8.2 Reporting an Issue

When reporting a technical issue, please include:
- The page you were on
- What you were trying to do
- What you saw (screenshot if possible)
- The time and date of the issue

---

## Change Log

*Updated with every production change to this interface. Written in plain English for non-technical readers.*

| Date | Description | Type | PR |
|---|---|---|---|
| [YYYY-MM-DD] | [Plain English description of what changed and why] | [New Feature / Update / Bug Fix / Removed] | #[number] |

> **Type definitions:** New Feature = new page, section, or capability added. Update = existing page or feature changed. Bug Fix = something was broken and corrected. Removed = page, feature, or option taken out. Combinations are allowed (e.g. `Bug Fix / Removed`).

---

*Document Version 1.0 | Confidential — Internal Use Only*
*Prepared by Amped I Development Team*
