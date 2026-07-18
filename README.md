# MedVault AI

> **Your Family. Your Health. Securely Together.**

MedVault AI is a secure, AI-powered **Family Health Vault** — store, organize,
search and manage the medical records of every family member in one place.
People lose prescriptions, lab reports and medical history across hospitals,
WhatsApp chats and paper files. MedVault AI keeps everything in one secure place.

Built to feel like a premium product (Stripe / Linear / Apple Health) with a
modern SaaS aesthetic, glassmorphism, gradients, dark mode and subtle motion.

---

## ✨ Features

- **Landing + marketing** — hero, features, pricing, about, contact, FAQ.
- **Authentication** — email + Google + OTP verification (Clerk-ready, with a
  built-in demo auth fallback).
- **Dashboard** — welcome card, live stats, health-summary chart, family
  overview, upcoming reminders, recent reports, storage usage.
- **Family members** — profile cards (photo, age, blood group, conditions,
  emergency contact) with add / edit / delete.
- **Member profile** — medical timeline, per-category tabs (reports, scans,
  bills, visits), records chart, filters by year / hospital, search.
- **Upload** — drag & drop / camera / PDF, on-device **OCR** (Tesseract.js)
  with live progress, auto-categorization and field extraction (doctor,
  hospital, diagnosis, medicines, date).
- **AI (Gemini)** — medicine explainer, report summarizer and natural-language
  timeline search (e.g. *"Show all diabetes reports"*), each with an
  educational-use disclaimer.
- **Medicine Vault** — dosage, morning/afternoon/night schedules, reminder
  toggles, expiry tracking, history.
- **Reminders** — medicine, appointments, lab tests, vaccinations with push &
  email channels.
- **Emergency Card** — one-click critical-info screen with **QR code**, secure
  share link and print-to-PDF; plus a public `/emergency/[id]` view.
- **Settings** — profile, password, language (English/Hindi), dark mode,
  notifications, audit log, delete account.
- **Security model** — RLS, secure single-use 24h share links, audit logs.
- **UX polish** — skeletons, animated counters, empty states, toasts, floating
  upload button, responsive + accessible.

---

## 🧱 Tech Stack

| Area | Choice |
| --- | --- |
| Framework | **Next.js (App Router)** + TypeScript |
| Styling | Tailwind CSS v4, custom design tokens |
| UI | shadcn/ui (Base UI), Lucide icons |
| Animation | Motion (Framer Motion) |
| Forms | React Hook Form + Zod |
| Data | TanStack React Query |
| Charts | Recharts |
| OCR | Tesseract.js (client-side) |
| AI | Google Gemini (`@google/generative-ai`) |
| Auth | Clerk |
| DB / Storage | Supabase (PostgreSQL + Storage) |
| ORM | Prisma |

> **Note:** the scaffold pins Next.js 16 (latest App Router). All APIs used are
> App-Router compatible with Next 15.

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local   # optional — app runs in demo mode without keys
npm run dev
```

Open http://localhost:3000.

### Demo mode (zero config)

Without external keys the app is **fully functional**:

- **Auth** — demo login/signup (use OTP `123456`).
- **Data** — an in-memory store seeded with a sample family, records,
  medicines and reminders (resets on server restart).
- **AI** — deterministic mock responses for the medicine explainer, summarizer
  and search.

Add real keys in `.env.local` to switch each integration on automatically —
detection lives in [`src/lib/env.ts`](src/lib/env.ts).

---

## 🔑 Environment Variables

See [`.env.example`](.env.example). Key groups:

- **Clerk** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  (keep the publishable key as a `placeholder*` value to stay in demo auth).
- **Supabase** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`.
- **Database** — `DATABASE_URL`, `DIRECT_URL`.
- **Gemini** — `GEMINI_API_KEY`.

---

## 🗄️ Database

Two interchangeable schema definitions are provided:

- **Prisma** — [`prisma/schema.prisma`](prisma/schema.prisma)
- **Supabase SQL** — [`supabase/schema.sql`](supabase/schema.sql) (tables,
  indexes, Row Level Security, private storage bucket)

```bash
npm run db:generate     # prisma generate
npm run db:push         # push schema to the database
npm run db:seed         # seed demo data (prisma/seed.ts)
```

Or paste `supabase/schema.sql` into the Supabase SQL editor.

---

## 📁 Project Structure

```
src/
├─ app/
│  ├─ (marketing)/        landing, features, pricing, about, contact
│  ├─ (auth)/             login, signup, forgot-password
│  ├─ dashboard/          dashboard + all app pages
│  ├─ emergency/[id]/     public emergency card
│  └─ api/                members, records, medicines, reminders, stats,
│                         emergency, audit, ai/*
├─ components/
│  ├─ brand/  marketing/  dashboard/  emergency/  auth/  shared/  ui/
├─ hooks/                 React Query hooks
└─ lib/                   types, store, mock-data, format, constants,
                          env, gemini, extract, ui-maps, api-client
```

---

## 🧪 Scripts

```bash
npm run dev         # start dev server
npm run build       # production build
npm run start       # run production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

---

## ☁️ Deployment (Vercel)

1. Push to GitHub and import the repo in **Vercel**.
2. Add the environment variables from `.env.example`.
3. Provision a **Supabase** project; run `supabase/schema.sql` (or
   `npm run db:push`) and set `DATABASE_URL` / Supabase keys.
4. Create a **Clerk** app; add its keys and set the sign-in/up URLs to
   `/login` and `/signup`.
5. Add `GEMINI_API_KEY` for live AI.
6. Deploy. `next build` runs automatically.

> Tesseract OCR runs in the browser, so no extra server config is required.

---

## ⚕️ Disclaimer

AI output is **for educational purposes only and is not a substitute for
professional medical advice**. Always consult a qualified clinician.
