---
name: testing-medvault
description: Test MedVault AI end-to-end (demo mode). Use when verifying OCR upload, Select labels, timeline, emergency card, or Base UI warnings.
---

# Testing MedVault AI

MedVault AI runs fully in **demo mode** with no external credentials: mock auth,
in-memory seeded data (resets on server restart), and mock AI.
This makes almost all UI flows testable locally without secrets.

**Demo login:** the `/login` page is an email + password form — **any** values work
(e.g. `test@medvault.ai` / anything). A "Welcome back!" toast then redirects to
`/dashboard`. (An OTP path may also exist elsewhere; the default login form does not
require one.)

## Devin Secrets Needed
- None for demo-mode testing.
- Live paths (only if explicitly testing them): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  + `CLERK_SECRET_KEY` (auth), `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (storage/RLS), `GEMINI_API_KEY` (AI). Without them the app silently uses fallbacks —
  so a "passing" AI/auth test in demo mode does NOT prove the live integration.

## Run it
```
cd <repo> && npm run dev   # http://localhost:3000
```
Verify gates before UI testing: `npm run typecheck`, `npx eslint .`, `npm run build`.
Note: this is Next.js 16 (not 15) with Turbopack — see AGENTS.md; read
`node_modules/next/dist/docs/` before changing framework conventions.

## Golden path to demo
1. `/dashboard/upload` — pick a family member, **Browse files**, upload a
   prescription image. Wait for "Scan complete". Confirm the OCR-extracted
   Doctor / Diagnosis / Date / Hospital / Medicines, then Save → redirects to timeline.
2. `/dashboard/timeline` — natural-language search (e.g. "Show all diabetes reports").
3. `/dashboard/medicines` — AI explain dialog (has the required medical disclaimer).
4. `/dashboard/emergency` — emergency card + QR.
5. Theme toggle (top-right) for dark mode.

An OCR fixture may live at `/home/ubuntu/medvault-test/report.png`
(Apollo Hospital · Dr. Mehta · Type 2 Diabetes · Metformin/Glimepiride/Atorvastatin),
but it is **not guaranteed to exist** (it's not committed and temp dirs get wiped).
If it's missing and OCR isn't what you're testing, cover the shared CRUD/MemberSelect
code via the medicine/reminder dialogs instead (see below); or generate a fixture image.

## Shared CRUD + MemberSelect flow (fast, no OCR needed)
The `src/lib/api-crud.ts` helpers (`queryByMember`/`addItem`/`updateItem`/`deleteItem`),
the `createResourceHooks` factory (`use-medicines/records/reminders`), and the shared
`MemberSelect` are all exercised entirely through the medicine/reminder pages:
- `/dashboard/medicines` → **Add medicine** (MemberSelect + POST/`addItem`; card should
  appear, Active count increments), reminder **Switch** (PUT/`updateItem` — reload to
  confirm it persisted server-side), **trash** icon (DELETE/`deleteItem`).
- `/dashboard/reminders` → **New reminder** (MemberSelect + POST/`addItem`, list is
  date-sorted), **Mark done** (PUT), **trash** (DELETE).
- `/dashboard/emergency` → MemberSelect drives the whole card; switching member should
  swap age/blood group/conditions/contact.

## Things that have broken before (check these)
- **OCR extraction** (`src/lib/extract.ts`): medicine parsing may miss plain
  `Name 500mg` lines (only matching `Tab./Cap.` prefixes), and the doctor regex
  can cross a newline and grab the next field label ("Mehta Diagnosis"). Verify a
  plain prescription fills Medicines and the doctor is just the name.
- **Base UI Select trigger** shows the raw `value` (e.g. member id `m1`, or `all`
  for filters) unless `<Select.Root items={[{value,label}]}>` is provided. Check
  that member/filter triggers show human labels, not ids.
- **Base UI Button rendered as a link** (`<Button render={<Link/>}>`) warns unless
  `nativeButton` is false. The `Button` wrapper defaults it to false when a
  `render` prop is present. Verify the Next.js dev indicator shows 0 issues and
  anchor buttons don't carry `type="button"`.
- **`group-hover:` reveal is unreliable here** (Tailwind v4). Buttons hidden with
  `opacity-0 group-hover:opacity-100` (e.g. the timeline Delete + the added
  Summarise button) can stay invisible even when the parent `.group` is `:hover`.
  Prefer always-visible controls for anything a demo/judge must find. When testing,
  don't assume a control is missing just because hover didn't reveal it — check the
  DOM (`document.querySelectorAll('button')`) and its computed `opacity`.
- **Seed date drift**: medicine "active vs expired" is computed from `expiryDate`
  against the *system clock*. Seed meds (e.g. Amlodipine med2, expiry 2026-03-01)
  may already be Expired on a future-dated VM, so they won't appear in the Active
  list. The Medicine Vault safety banner only checks **active** meds — to demo an
  interaction (e.g. Amlodipine + Simvastatin, Moderate), add both drugs fresh with
  no expiry so they're active.

## Coordinate mapping for computer-use
The page renders at ~1600×1069 CSS px but the screen tool uses 1024×768. Scale is
~0.64 uniform with a ~+56px vertical offset for browser chrome:
`screen_x ≈ 0.64·domX − 3`, `screen_y ≈ 0.64·domY + 56`. Use `getBoundingClientRect()`
via the browser console to locate an element, then convert to click coordinates.

## Tips
- **`datetime-local` inputs are painful to fill via the computer tool.** The year
  segment does NOT auto-advance after 4 digits, so typing `2026` then more digits
  overflows it (e.g. `202609`). Reliable recipe: click field → `ctrl+a`+`Delete` to
  clear → press `Left` ~5× to land on the month segment → type `MM`, `DD`, `YYYY`,
  then press `Right` before typing `HH`, `MM`, `AM/PM`. Verify the input's `value`
  attribute is a clean ISO string (`2026-12-31T09:30`) before submitting.
- The Next.js dev indicator (bottom-left "N" circle) shows a red count + an
  "Issues" menu entry when there are runtime warnings; absence = clean.
- Base UI Select keeps the real value in a hidden `<input>` while the trigger
  renders the label — seeing `input text="m1"` next to a "Aarav Sharma" trigger is correct.
