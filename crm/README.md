# Torqpoint CRM

Bespoke single-user CRM for Torqpoint. Lives in `crm/` inside the website repo
and deploys as its **own Vercel project** with the root directory set to `crm`.

- **Spec:** `torqpoint-crm-spec.md` (v2) — features & data model
- **Brief:** Torqpoint CRM — Claude Code Build Brief — build order & working agreement
- **Look:** Torqpoint Brand Identity v2 — Graphite / Paper / Slate / Forge, Fraunces + Bricolage Grotesque, "the point"

## Stack

React (Vite) + Tailwind · Supabase (Postgres, Auth, RLS) · Vercel ·
Anthropic API via Vercel functions (Layer 5) · Google Calendar (Layer 6)

## Status — built in layers

| Layer | What | Status |
| --- | --- | --- |
| 1 | Core CRM: accounts, contacts, pipeline, activity log, dashboard shell | ✅ Built — awaiting Supabase connection + Luke's test |
| 2 | Projects & deliverables | — |
| 3 | Money & documents (quotes, invoices, PDFs, MRR) | — |
| 4 | Retainers & "Run the month" | — |
| 5 | AI layer | — |
| 6 | Google Calendar sync | — |
| 7 | Website enquiry → lead | — |

## Setup (the approval taps)

1. **Supabase** — create a project at supabase.com, then run
   `supabase/migrations/0001_init.sql` in the SQL editor (Claude does this via
   the CLI/dashboard once authorised).
2. **Vercel** — New Project → import this repo → set **Root Directory = `crm`**
   (framework auto-detects Vite).
3. **Env vars** in Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   (from Supabase → Project Settings → API).

Until step 3 is done the deployed app shows a friendly "connect the database"
screen instead of the login.

## Local development

```bash
cd crm
npm install
cp .env.example .env.local   # fill in the two Supabase values
npm run dev                  # http://localhost:5173
```

## Notes

- Row-level security scopes every row to the signed-in owner from day one;
  adding team members later is a policy change, not a rebuild.
- MRR = sum of active retainer `monthly_amount` — computed live on the
  dashboard (zero until Layer 4 ships).
