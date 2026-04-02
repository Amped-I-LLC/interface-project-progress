# Custom Interface Development — Developer Onboarding Guide

| | |
|---|---|
| **Version** | 1.0 |
| **Status** | Active |
| **Audience** | Internal Developers |
| **Classification** | Confidential — Internal Use Only |

> This is the complete developer onboarding and process reference for building interfaces at Amped I. It covers every manual step from tool access through post-deploy, for both new builds and updates to existing interfaces. For a high-level system overview for leadership, see `docs/System_Overview.md`. For full technical detail on any step, see `docs/SOP_Technical_Reference.md`.

---

## How to Read This Map

| Column | What It Means |
|---|---|
| **Step** | The action the developer takes |
| **Sub-steps** | Specific actions within that step |
| **Responsible** | Who does this — Dev, Requester, Claude Code, or System |
| **Effort** | Rough time estimate |
| **Blocking?** | Whether this must be complete before moving forward |
| **Notes** | Anything a new dev should know |

---

## Phase 1 — Prerequisites
> Complete once per developer. After initial setup, skip directly to Phase 2 for new interfaces.

### 1a — Tool Access

All tools require admin approval. To request access to any tool, contact **Bryan Pyka**, **Bob Reed**, or any current developer (Hiro, Jerson). All developers hold full admin rights across all tools — confirm with Bob or Bryan if unsure.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **1.1 Get GitHub access** | Request membership to the [Amped-I-LLC GitHub org](https://github.com/Amped-I-LLC). Any current dev or admin can add you. | Dev + Admin | 5 min | Yes | Must be an org member to create repos from the template. Full admin rights required. |
| **1.2 Get Vercel access** | Request membership to the [Amped-I-LLC Vercel team](https://vercel.com/amped-i-llc). Any current dev or admin can add you. | Dev + Admin | 5 min | Yes | Must be on the Amped-I-LLC team — not your personal Vercel account. Full admin rights required. |
| **1.3 Get Supabase access** | Request access to the [Amped I Supabase org](https://supabase.com/dashboard/org/zwkofdawwdfqzzewkrzq). Any current dev or admin can add you. | Dev + Admin | 5 min | Yes | Full admin rights required. |
| **1.4 Get Airtable access** | Request access to the [Amped I Airtable workspace](https://airtable.com/workspaces/wspC1JuMyCgEf8zjN). Any current dev or admin can add you. | Dev + Admin | 5 min | Yes | Airtable is optional per interface, but all devs should be onboarded to the workspace. Also contains the project/task tracker used by devs and leadership. |
| **1.5 Get Claude Code access** | Claude Code runs on a shared team account. Request credentials from Bryan, Bob, or a current dev. | Dev + Admin | 5 min | No — only needed for Claude Code path | Credentials are managed by admin. Do not create a personal account for org work. |
| **1.6 Get Slack/Teams access** | Request access to the team's Slack or Microsoft Teams workspace. Used for project communication, sharing specs, and stakeholder updates. | Dev + Admin | 5 min | Yes | Primary channel for receiving interface briefs and communicating with requesters |

### 1b — Local Machine Setup

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **1.7 Install Node.js** | Download and install Node.js v18+ from nodejs.org. Verify: `node --version` (must return v18+) | Dev | 10 min | Yes | Also installs npm automatically |
| **1.8 Install Git** | Download from git-scm.com. Verify: `git --version` (must return 2.x+) | Dev | 5 min | Yes | Required for cloning repos and pushing code |
| **1.9 Install IDE** | Use VS Code (code.visualstudio.com) or Cursor (cursor.com). Both are self-provided — no company account or license needed. | Dev | 10 min | Yes | Cursor is recommended for Claude Code sessions — it shows Claude's changes inline. VS Code works for both paths. |
| **1.10 Configure Git identity** | Run in terminal: `git config --global user.name "Your Name"` then `git config --global user.email "you@amped-i.com"` | Dev | 2 min | Yes | Required for commits to be attributed correctly |
| **1.11 Set up Git authentication** | **HTTPS (simpler — recommended for beginners):** When you first push, Git will prompt for your GitHub username and a Personal Access Token (PAT). Generate one at GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → New token → check `repo` scope. **SSH (advanced):** Generate a key with `ssh-keygen -t ed25519 -C "you@amped-i.com"` then add the public key to GitHub → Settings → SSH Keys | Dev | 10–20 min | Yes | HTTPS is easier to set up. SSH is more convenient long-term since you don't re-enter credentials. Either works. |
| **1.12 Install Claude Code** | Run: `npm install -g @anthropic-ai/claude-code` then run `claude` in any project folder to authenticate with the shared account credentials | Dev | 5 min | No — only needed for Claude Code path | Required only if building with Claude Code (recommended). Skip if building manually. |

---

## Phase 2 — Scoping & Discovery
> Complete once per interface, before any code is written.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **2.1 Confirm request is in the task tracker** | Before scheduling anything, verify the interface request exists as a task in the [Amped I Airtable task tracker](https://airtable.com/workspaces/wspC1JuMyCgEf8zjN). If it doesn't exist yet, log it now. | Dev or Requester | 5 min | Yes | All work must be traceable to a task. Either the requester logs the request, or the dev logs it after being approached. Both are valid. |
| **2.2 Schedule and hold discovery session** | Dev schedules a session with the requester (or requester reaches out to a dev directly — either is fine). In the session, capture: what the interface does, who uses it, what data it shows, what each page does, what actions users can take, who gets access at launch | Dev + Requester | 30–60 min | Yes | This is the most important step. Unclear scope is the #1 cause of rework. Invite anyone relevant — no approval needed from Bryan or Bob to proceed. |
| **2.3 Document the scope** | Write the scope document immediately after the session. It can be a simple document, bullet list, or prose — format does not matter. Contents must cover: interface purpose, user list, pages, data sources, and user actions. Store it in the Airtable task tracker until the build starts. | Dev | 30 min | Yes | This document lives in the task tracker during scoping. When the build starts (Phase 4), it gets fed to Claude Code and committed to `docs/` in the interface repo. It will become the foundation for the per-interface Dev SOP at the end of the build. |
| **2.4 Confirm data sources** | Identify: which Supabase tables and columns are needed, which Airtable bases are needed (if any), whether the interface reads data only or also writes | Dev + Requester | 15 min | Yes | Table and column names must be confirmed — never assume or use placeholders. Follow up with the requester or data owner if any are unknown. |
| **2.5 Confirm user access list** | Get from the requester: which staff members need access to this interface at launch | Dev + Requester | 10 min | No — can be done before Phase 6 | Needed for Phase 6 when adding users to Supabase |

---

## Phase 3 — Repository Setup
> Complete once per interface.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **3.1 Create repo from template** | 1. Go to [github.com/Amped-I-LLC](https://github.com/Amped-I-LLC) 2. Open [`amped-i-custom-interface-development`](https://github.com/Amped-I-LLC/amped-i-custom-interface-development) 3. Click **"Use this template"** → **"Create a new repository"** 4. Set owner to **Amped-I-LLC** (not your personal account) 5. Name it `interface-[name]` (e.g. `interface-sales-dashboard`) 6. Set visibility to **Public** for now (switch to Private after Vercel Pro is confirmed) 7. Click **Create repository** | Dev | 5 min | Yes | Never clone the template directly — always use "Use this template" to get a clean copy |
| **3.2 Clone the repo locally** | 1. On the new repo page, click the green **Code** button 2. Copy the HTTPS URL (e.g. `https://github.com/Amped-I-LLC/interface-[name].git`) 3. In your terminal, run: `git clone https://github.com/Amped-I-LLC/interface-[name].git` 4. Run: `cd interface-[name]` | Dev | 3 min | Yes | Use HTTPS unless you have SSH configured. HTTPS is the default and works for everyone. |
| **3.3 Install dependencies** | Run: `npm install` — wait for it to complete | Dev | 2–5 min | Yes | This installs all required packages. Must be done before running the app locally. |
| **3.4 Create the .env.local file** | 1. Run: `cp .env.local.example .env.local` 2. Open `.env.local` in your IDE | Dev | 2 min | Yes | `.env.local` is already in `.gitignore` — it will never be committed to GitHub |
| **3.5 Copy Supabase keys** | 1. Go to the [Supabase dashboard](https://supabase.com/dashboard) → open the project for this interface 2. Go to **Project Settings → API** 3. Copy each value into `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` ← **Project URL**, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← **anon public** key, `SUPABASE_SERVICE_ROLE_KEY` ← **service_role** key | Dev | 5 min | Yes | The service_role key is sensitive — never share it or commit it. Keep it only in `.env.local` and Vercel env vars. |
| **3.6 Create working branch** | Run: `git checkout -b develop` | Dev | 1 min | Yes — for existing projects. Optional for brand-new projects. | New project with no existing users: you can work directly on `main`. Existing deployed project: always create a branch first. |
| **3.7 Verify local setup** | Run: `npm run dev` — open `http://localhost:3000` in your browser. You should see the login page. | Dev | 2 min | Yes | If you see an error, most likely cause is missing or incorrect `.env.local` values. Double-check all three Supabase keys. |
| **3.8 Add Airtable key row (conditional)** | Only if this interface uses Airtable: 1. Go to the Supabase dashboard → Table Editor → `airtable_keys` 2. Insert a new row: `app_name` = repo name (e.g. `interface-sales-dashboard`), `base_id` = Airtable Base ID, `api_key` = Airtable API key 3. Confirm the row is saved before starting the build | Dev | 5 min | Yes — if using Airtable | This must exist before building or testing any Airtable page. Claude Code will prompt for this confirmation. |

---

## Phase 4 — Build
> The main development phase. Two paths: Claude Code (recommended) or Manual.

### Path A — Building with Claude Code (Recommended)

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **4A.1 Open project in IDE** | Open the cloned repo folder in VS Code or Cursor: **VS Code:** File → Open Folder → select `interface-[name]`. **Cursor:** Same, or drag the folder onto the Cursor icon | Dev | 1 min | Yes | Cursor is preferred for Claude Code sessions — it shows Claude's changes inline |
| **4A.2 Start Claude Code session** | In the IDE terminal, run: `claude` — Claude will read `CLAUDE.md` automatically | Dev + Claude Code | 2 min | Yes | If prompted to authenticate, follow the browser flow |
| **4A.3 Feed the scope document** | Paste or share the scope document from Phase 2 at the start of the session. Claude will read it, ask any remaining questions, and confirm the build plan before writing any code | Dev + Claude Code | 10–15 min | Yes | If no scope doc exists, Claude will ask the questions directly. Answer all of them before coding starts. |
| **4A.4 Stamp the project** | Claude will update or prompt you to update the 5 stamp items: sidebar app name, nav items, browser tab title in `app/layout.jsx`, confirm `.env.local` is filled, remind you to add Vercel env vars after deploy | Dev + Claude Code | 5 min | Yes | These 5 changes must happen before any feature pages are built |
| **4A.5 Build pages** | Claude builds each page based on the scope. For each page: Claude asks for confirmed table names and columns → builds the page → dev reviews and approves in the IDE | Dev + Claude Code | Varies | — | Review every file Claude writes. You are responsible for the final code. |
| **4A.6 Commit progress regularly** | After each page or logical chunk: **Via Claude Code:** ask Claude to commit — e.g. "commit the current changes" — Claude will stage, write a commit message, and push. **Manually:** 1. `git add .` 2. `git commit -m "add [page name] page"` 3. `git push origin develop` (or `main` for new projects) | Dev | 2 min per commit | No — but strongly recommended | Regular commits protect your work and give you rollback points. Either method works — use whichever is faster in the moment. |
| **4A.7 Test locally as you build** | After each page, open `http://localhost:3000` and verify: page loads, data displays correctly, filters work, no console errors | Dev | 5–10 min per page | No — but required before moving to next page | Keep `npm run dev` running in a separate terminal tab while building |

### Path B — Building Manually (Without Claude Code)

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **4B.1 Open project in IDE** | Open the cloned repo folder in VS Code or Cursor | Dev | 1 min | Yes | |
| **4B.2 Review CLAUDE.md** | Read `CLAUDE.md` fully before writing any code — it defines all naming conventions, file structure, design system rules, and component usage | Dev | 15 min | Yes | CLAUDE.md is the law for this codebase. Every rule in it applies whether Claude Code is used or not. |
| **4B.3 Review scope document** | Re-read the scope doc from Phase 2. Confirm you have all table names, column names, and page requirements before writing any code | Dev | 10 min | Yes | |
| **4B.4 Stamp the project** | Manually update the 5 stamp items: sidebar app name (`components/layout/Sidebar.jsx`), nav items (`NAV_ITEMS` array), browser tab title (`app/layout.jsx`), confirm `.env.local` is filled | Dev | 10 min | Yes | |
| **4B.5 Build pages using scaffold files** | For the first data page: edit `app/(protected)/sample/page.jsx` in place — replace placeholder constants with real table/column names. For subsequent pages: create `app/(protected)/[page-name]/page.jsx` using the template in CLAUDE.md Section 12 | Dev | Varies | — | Always add each new page to `NAV_ITEMS` in `Sidebar.jsx` |
| **4B.6 Commit progress regularly** | Same as Path A Step 4A.6 | Dev | 2 min per commit | No — but strongly recommended | |
| **4B.7 Test locally as you build** | Same as Path A Step 4A.7 | Dev | 5–10 min per page | No — but required | |

---

## Phase 5 — Pre-Deploy Verification
> Complete before every deployment to production.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **5.1 Run security checklist** | Go through every item below. All must pass before deploying. | Dev | 15 min | Yes | Do not skip. This protects company data. |
| **5.1a — .env.local not committed** | Run `git status` — `.env.local` must not appear in the output. Run `cat .gitignore` — confirm `.env.local` is listed. Also check that no plain `.env` file exists with real values — Next.js does NOT auto-ignore `.env` (only `.env*.local`). | Dev | 2 min | Yes | If `.env.local` appears in `git status`, run `git rm --cached .env.local` immediately and do not push. If a plain `.env` file exists with real values, add it to `.gitignore` before committing. |
| **5.1b — No secrets in committed files** | Search the codebase for the actual values of your Supabase keys: in VS Code use Ctrl+Shift+F (or Cmd+Shift+F on Mac) and paste each key value. Zero results expected. Also search for the Airtable API key value if you have it locally. | Dev | 3 min | Yes | If a key appears in any file other than `.env.local`, remove it immediately and rotate the key in Supabase or Airtable. |
| **5.1c — RLS enabled on airtable_keys** | Supabase dashboard → Table Editor → `airtable_keys` → confirm the RLS toggle is ON | Dev | 1 min | Yes — if using Airtable | |
| **5.1d — Airtable keys only in server routes** | In VS Code, search for `api_key` and `airtable` — results should only appear in `app/api/airtable/route.js` and `lib/airtable.js`. Never in page files or components. | Dev | 2 min | Yes — if using Airtable | |
| **5.1e — Auth protection works** | Open an incognito browser window → go to `http://localhost:3000` → you must be redirected to `/login` automatically | Dev | 2 min | Yes | If any protected page loads without redirecting, the proxy is broken — do not deploy. |
| **5.1f — service_role key not in frontend** | Search the codebase for `SUPABASE_SERVICE_ROLE_KEY` — it should only appear in `app/api/` files. Never in `components/` or `app/(protected)/`. | Dev | 1 min | Yes | |
| **5.1g — No sensitive data in browser dev tools** | Open `http://localhost:3000` in Chrome → open DevTools (F12) → check: **Console** tab — no API keys or secrets printed. **Network** tab → if the interface uses Airtable, trigger an Airtable page load and confirm the request goes to `/api/airtable` (your own server), NOT directly to `airtable.com` — if it goes directly to Airtable, the key is exposed. **Network** tab → click any API request → **Response** — no raw API keys returned in the response body. **Application** tab → Local Storage / Session Storage — no secrets stored. | Dev | 5 min | Yes | The Airtable network check is the most critical — a direct call to `airtable.com` from the browser means the API key is exposed in the request headers. |
| **5.1h — Repository is private (when applicable)** | GitHub repo page → check the visibility label next to the repo name. Should show Private once Vercel Pro is active. | Dev | 1 min | No — conditional on Vercel Pro | |
| **5.2 Generate end-of-build SOPs** | **Claude Code path:** Ask Claude to generate `docs/SOP_Dev_[Name].md` and `docs/SOP_User_[Name].md`. Claude will prompt for this automatically at end of build. **Manual path:** Fill in the SOP templates in `docs/` manually. | Dev + Claude Code | 15–30 min | No — but required before handoff | Generate these before the interface is shared with any users |
| **5.3 Run smoke test** | **Generic smoke test (always):** 1. Open the app at `http://localhost:3000` 2. Log in with a test account 3. Confirm every page in the sidebar loads without error 4. Confirm data loads on each data page (not empty, not an error state) 5. Log out — confirm you are redirected to `/login` 6. Open an incognito window, go directly to a protected URL — confirm redirect to `/login` **Interface-specific smoke test:** Claude generates a tailored checklist based on the interface's pages and features. Ask Claude: "Generate a smoke test for this interface." | Dev | 15–30 min | Yes | A smoke test is a quick pass to confirm nothing is broken — not a full QA. If anything fails, fix before deploying. |
| **5.4 Commit all final changes** | 1. `git add .` 2. `git commit -m "final build — ready for deploy"` 3. `git push origin develop` (or `main`) | Dev | 2 min | Yes | |
| **5.5 Merge to main (existing projects only)** | 1. Go to the GitHub repo 2. Click **Pull Requests** → **New Pull Request** 3. Base: `main` ← Compare: `develop` 4. Write a PR description: what was changed, what was tested, any known issues 5. Approve and merge 6. Delete the branch after merging | Dev | 5 min | Yes — for existing projects | New project with no prior deployment: skip this step, you are already on `main`. |

---

## Phase 6 — Deploy to Vercel
> One-time setup per interface. After setup, all future deploys are automatic.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **6.1 Open Vercel team dashboard** | Go to [vercel.com/amped-i-llc](https://vercel.com/amped-i-llc) — confirm the team switcher (top-left) shows **Amped-I-LLC**, not your personal account | Dev | 1 min | Yes | If you deploy from your personal account, the project will not be under the org |
| **6.2 Create new project** | Click **Add New Project** → select the **Amped-I-LLC** GitHub org → find and select `interface-[name]` → click **Import** | Dev | 2 min | Yes | Vercel auto-detects Next.js — no build configuration needed |
| **6.3 Add environment variables** | Before clicking Deploy, go to **Environment Variables** and add all three values from your `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. For each: type the key name, paste the value, click **Add**. | Dev | 5 min | Yes | If you skip this step, the app will deploy but will fail to connect to Supabase. You can add env vars after deploy, but you will need to redeploy. |
| **6.4 Deploy** | Click **Deploy** — Vercel builds and deploys. Wait ~60 seconds. | Dev | 1 min + wait | Yes | |
| **6.5 Verify live deployment** | Click the deployment URL (e.g. `interface-[name].vercel.app`) → confirm login page loads → log in → confirm the interface works on production data | Dev | 5 min | Yes | If the app loads but shows errors, check Vercel → Project → Deployments → click the deployment → Runtime Logs |
| **6.6 Run smoke test on live URL** | Repeat the smoke test from Step 5.3 on the live Vercel URL — not localhost | Dev | 15 min | Yes | Production can behave differently from local. Always re-test on the live URL. |

---

## Phase 7 — Post-Deploy
> Complete after the interface is confirmed live and stable.

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **7.1 Register in App Portal** | 1. Go to the Supabase dashboard → Table Editor → `app_registry` 2. Insert a new row with: `app_name` = display name (e.g. "Sales Dashboard"), `app_url` = full Vercel URL, `description` = one sentence describing the interface, `icon` = an emoji, `status` = `live`, `is_new` = `true` 3. Save the row | Dev | 5 min | Yes | This makes the interface appear in the App Portal for authorized users. Until this row exists, the portal will not show the interface. |
| **7.2 Grant user access** | 1. Get the `id` of the new app from `app_registry` (copy it from the row you just created) 2. For each user who needs access: go to `user_app_access` → insert a row with `user_id` (the user's Supabase Auth UUID) and `app_id` (the app's UUID from step 1) 3. Confirm with the requester that the correct users have been added | Dev | 10 min | Yes | To find a user's UUID: Supabase dashboard → Authentication → Users → find the user → copy their UUID |
| **7.3 Set up custom subdomain (when ready)** | 1. Vercel → Project Settings → Domains → Add Domain 2. Enter `app-[name].amped-i.com` 3. Vercel will show a CNAME record to add in your DNS settings 4. Add the CNAME in your domain registrar 5. Wait for DNS propagation (5 min – 48 hours) | Dev | 10 min + DNS wait | No — conditional on domain confirmation | Skip until `amped-i.com` DNS access is confirmed. The `*.vercel.app` URL works in the meantime. |
| **7.3a — Enable SSO cookie sharing** | After the custom subdomain is confirmed live: 1. Open `lib/supabase/client.js`, `lib/supabase/server.js`, and `proxy.js` in this interface repo 2. In all three files, add `cookieOptions: { domain: ".amped-i.com" }` to the `createBrowserClient` / `createServerClient` call 3. Commit and push 4. Repeat for every other interface repo once their custom subdomain is live | Dev | 10 min | No — required for SSO | Enables single sign-on across all interfaces. Once applied to every app, a user who logs in to the portal is automatically authenticated everywhere — no separate login per interface. **Do not apply until the custom domain is confirmed live.** |
| **7.4 Notify requester** | Send the live URL to the requester and the initial user list. Confirm access works for at least one user before signing off. | Dev + Requester | 5 min | Yes | Do not hand off without confirming at least one end user can log in successfully |
| **7.5 Generate End User SOP .docx (when needed)** | If the interface is being rolled out to non-technical staff: 1. Confirm `docs/SOP_User_[Name].md` is complete and reviewed 2. Ask Claude to convert it to `.docx`: "Convert `docs/SOP_User_[Name].md` to a formatted Word document" 3. Share the `.docx` with the requester or upload to Google Drive | Dev + Claude Code | 10 min | No — conditional | Not required for every interface. Only generate when end users need a formal guide. |
| **7.6 Archive scope and notes** | Ensure `docs/SOP_Dev_[Name].md` is committed and pushed to the interface repo. This is the permanent record of what was built and why. | Dev | 2 min | Yes | Future developers will read this when maintaining or extending the interface |

---

## Phase 8 — Updating an Existing Interface
> Use this phase when making any change to an interface that is already deployed and in use — bug fixes, new features, updates to existing pages.

### Change Log Types

Every change to a live interface must be logged in the interface's End User SOP (`docs/SOP_User_[Name].md`). Use these types — combos are allowed (e.g. `Bug Fix / Removed`):

| Type | When to use |
|---|---|
| **New Feature** | A new page, section, filter, or capability was added |
| **Update** | An existing page or feature was changed — new column, revised logic, different data source |
| **Bug Fix** | Something was broken and has been corrected |
| **Removed** | A page, feature, or option was taken out |

### Change Process

| Step | Sub-steps | Responsible | Effort | Blocking? | Notes |
|---|---|---|---|---|---|
| **8.1 Create a branch** | From the interface repo, run: `git checkout main && git pull origin main && git checkout -b fix/[short-description]` or `feature/[short-description]` | Dev | 2 min | Yes | Always branch from the latest `main`. Never make changes directly on `main` for a live interface. Use `fix/` prefix for bug fixes, `feature/` for new work. |
| **8.2 Make the changes** | Build using Claude Code (Path A) or manually (Path B) — same as Phase 4. For small bug fixes, changes may be made directly without a full Claude Code session. | Dev | Varies | — | For bug fixes: focus only on the broken thing. Do not refactor or "improve" surrounding code. |
| **8.3 Test locally** | Run `npm run dev` and verify: the change works as expected, existing pages are unaffected, no console errors | Dev | 5–15 min | Yes | Test both the changed area and adjacent pages to confirm nothing was accidentally broken. |
| **8.4 Push branch and get preview URL** | 1. `git add .` 2. `git commit -m "fix: [description]"` or `"feat: [description]"` 3. `git push origin fix/[description]` 4. Go to the [Amped-I-LLC Vercel team](https://vercel.com/amped-i-llc) → open the project → **Deployments** tab → find the branch deployment → copy the preview URL | Dev | 5 min | Yes | Vercel automatically builds a live preview for every pushed branch. The preview URL uses real data and real auth — it behaves exactly like production. |
| **8.5 Verify on preview URL** | Open the preview URL in a browser and confirm: the change works correctly on the live preview, login still works, no broken pages | Dev | 5–10 min | Yes | The preview deployment is the closest thing to production. Catch issues here before merging. |
| **8.6 Share preview URL for sign-off (larger changes)** | For new features or changes that affect how users work: share the preview URL with the requester or stakeholder and get confirmation before merging. For bug fixes: dev sign-off is sufficient — no need to involve requester. | Dev + Requester | 5–15 min | No — judgment call | Bug fix = dev confirms and merges. New feature or significant update = share preview and wait for requester confirmation. |
| **8.7 Create PR on GitHub** | 1. Go to the GitHub repo → **Pull Requests** → **New Pull Request** 2. Base: `main` ← Compare: your branch 3. Write a PR description (see PR documentation standard below) 4. Click **Create Pull Request** | Dev | 5 min | Yes | |
| **8.8 Merge to main** | 1. Review the PR diff one more time 2. Click **Merge pull request** → **Confirm merge** 3. Click **Delete branch** after merging 4. Vercel will automatically redeploy production within ~60 seconds | Dev | 2 min | Yes | After merging, check the Vercel dashboard to confirm the production deployment completes without error. |
| **8.9 Verify production** | Open the live production URL and confirm the change is working correctly | Dev | 5 min | Yes | Takes ~60 seconds after merge for Vercel to finish deploying. |
| **8.10 Update change log in End User SOP** | Open `docs/SOP_User_[Name].md` → go to the Change Log section → add a new row: `Date`, `Description` (plain English — written for non-technical users), `Type`, `PR` (the PR number, e.g. `#12`) → commit and push | Dev | 5 min | Yes | Always update the change log — even for small bug fixes. This is the record end users and stakeholders reference to understand what has changed. |

### PR Description Standard

Every PR must include:

```
## What changed
[1–3 sentences in plain English describing what was changed and why]

## What was tested
- [Specific thing tested]
- [Specific thing tested]
- Preview URL: [paste Vercel preview URL]

## Type
[Bug Fix / New Feature / Update / Removed — combos allowed]
```

For simple bug fixes, a two-line description is acceptable. For multi-page changes, use the full format.

### Change Log Format (in End User SOP)

Add a **Change Log** section at the bottom of `docs/SOP_User_[Name].md` and update it with every production change:

```markdown
## Change Log

| Date | Description | Type | PR |
|---|---|---|---|
| 2026-04-02 | Added filter by client on the Projects page | New Feature | #12 |
| 2026-03-15 | Fixed login redirect not working after password reset | Bug Fix | #11 |
```

Write the Description in plain English — assume the reader is a non-technical staff member.

---

## Phase 9 — App Portal Administration
> Ongoing tasks performed after interfaces are live. No code changes required for any of these — all done through the portal UI or Supabase dashboard.

### Who Can Do This

Any user with admin access in the portal: **devs (Hiro, Jerson) and admins (Bryan Pyka, Bob Reed)**. All four have full access to both the portal and Supabase.

---

### 9a — Posting Announcements

Announcements are company-wide notices displayed to all portal users. Examples: new interface launched, scheduled downtime, data update notice.

| Step | Sub-steps | Responsible | Effort | Notes |
|---|---|---|---|---|
| **Post an announcement** | 1. Log in to the App Portal 2. Go to **Announcements** in the sidebar 3. Click **New Announcement** 4. Write the message — plain English, visible to all users 5. Optionally set an **Expires On** date (leave blank to show indefinitely) 6. Click **Post Announcement** | Dev or Admin | 5 min | Use this for new interface launches, updates, and any notice that all staff should see |
| **Remove or expire an announcement** | Set an expiry date when posting, or manually delete from the Announcements admin page | Dev or Admin | 2 min | Expired announcements stop showing automatically |

> **Planned:** End User SOPs will be renderable directly in the portal (markdown rendered inline — no `.docx` needed). When this is implemented, new interface announcements can include the full user guide in the portal itself. This requires a portal app update to add markdown rendering support.

---

### 9b — Managing User Access

Access is per-user only — an app only appears in a user's portal if they have a row in `user_app_access`. Apps in `app_registry` are not visible to anyone without an explicit access grant.

| Step | Sub-steps | Responsible | Effort | Notes |
|---|---|---|---|---|
| **Grant access to an interface** | 1. Supabase dashboard → Table Editor → `user_app_access` 2. Insert a new row: `user_id` = the user's Supabase Auth UUID, `app_id` = the interface's UUID from `app_registry` 3. To find a user's UUID: Supabase → Authentication → Users → find the user → copy UUID | Dev or Admin | 5 min per user | The interface will appear in the user's portal immediately — no redeployment needed |
| **Revoke access to an interface** | 1. Supabase dashboard → Table Editor → `user_app_access` 2. Find the row matching the user's `user_id` and the app's `app_id` 3. Delete the row | Dev or Admin | 2 min | Access is revoked immediately |
| **Add a new user to the system** | 1. The user must first register or be invited via Supabase Auth 2. Once they have a Supabase Auth account, grant interface access using the steps above | Dev or Admin | 5–10 min | Users without any `user_app_access` rows will see an empty portal after login |

---

### 9c — Registering a New Interface

When a new interface is deployed, it must be registered before it appears in the portal.

| Step | Sub-steps | Responsible | Effort | Notes |
|---|---|---|---|---|
| **Add interface to app_registry** | Supabase dashboard → Table Editor → `app_registry` → insert a row: `app_name` (repo name, e.g. `interface-sales-dashboard`), `app_url` (Vercel URL or custom subdomain), `description` (plain English — shown on portal card), `icon` (emoji or icon identifier), `status = live` | Dev | 5 min | This is covered in Phase 7 post-deploy — listed here for reference as an admin task |

---

## Quick Reference — Effort Summary

| Phase | Total Effort (First Time) | Recurring Per Interface |
|---|---|---|
| Phase 1 — Prerequisites | 45–60 min (one-time only) | 0 |
| Phase 2 — Scoping | — | 1–2 hours |
| Phase 3 — Repo Setup | — | 20–30 min |
| Phase 4 — Build | — | 1 day – 2 weeks (depends on complexity) |
| Phase 5 — Pre-Deploy | — | 1–2 hours |
| Phase 6 — Deploy | — | 20–30 min |
| Phase 7 — Post-Deploy | — | 30–60 min |
| Phase 8 — Interface Update | — | 30 min – 2 hours per change |

---


---

*Version 1.0 | Confidential — Internal Use Only*
