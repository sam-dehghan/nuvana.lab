@AGENTS.md

# nuvana.lab website

## Who you are working with

Hesam, founder of nuvana.lab, a branding and personal branding agency in Düsseldorf.
This repo is the agency website. Layout and section structure are modeled on
august.productions; all content is original.

**Hesam is not a developer.** Explain every step in plain language, never assume he knows
a tool, a command or a piece of jargon. When something can go wrong, say what would happen
and how to undo it.

## How to work here

Work like a senior engineer, in this order, every time:

1. Recon the repo before writing any code.
2. Show a short plan and **wait for explicit approval**.
3. Implement.
4. `npm run lint`, then `npx tsc --noEmit`, then `npm run build`.
5. Bump the version in `package.json` and add a `CHANGELOG.md` entry.
6. **Commit or push only after Hesam explicitly says go.** Never before.

## Rules that must not be broken

1. **No invented content.** No made-up clients, numbers, testimonials, scarcity or urgency.
   If real material is missing, use a placeholder — never fill the gap with plausible fiction.
2. **German copy, informal "du"**, written so a confident non-native speaker sounds natural.
   It must not read as AI generated.
3. **Never commit `.env.local` or any secret.**
4. **Vercel Framework Preset must stay "Next.js".** It was once set to "Other" and caused
   site-wide 404s.
5. **Blog body is Markdown only.** Raw HTML is never rendered.
6. **Every change bumps the version and adds a CHANGELOG entry.**
7. **Read the local Next.js docs in `node_modules/next/dist/docs/` before using an API.**
   This is Next.js 16 and differs from older versions — see the pitfalls below.

## Stack

- Next.js 16.3.6, App Router, React 19.2.8, TypeScript
- CSS Modules, **no Tailwind**
- Self-hosted Archivo variable font (`src/fonts/archivo-latin-wdth-normal.woff2`)
- Postgres (Neon) via `pg`, Vercel Blob for cover images, `react-markdown`, `zod`
- Repo: github.com/sam-dehghan/nuvana.lab, branch `main`
- Hosting: Vercel project `go-all-ai/nuvana-lab`, live at nuvana-lab.vercel.app,
  auto-deploys on every push to `main`

### Next.js 16 pitfalls specific to this repo

- **Middleware is `src/proxy.ts`**, exporting a function named `proxy`. This is the Next 16
  name. Do not "fix" it to `middleware.ts` — that silently disables the admin auth guard.
- `next dev` rewrites the block in `AGENTS.md` on every run. Project notes belong in this
  file, not in `AGENTS.md`. Committing the regenerated block along with your work keeps the
  tree clean.

## Where things live

| What | Where |
| --- | --- |
| All static copy | `src/content/site.ts` — items with `placeholder: true` render a visible "Platzhalter" badge |
| FAQ seed for the first migration | `src/content/faq-seed.json` |
| Public pages | `src/app/(site)/` — home, `/blog`, `/blog/[slug]`, `/kontakt`, `/impressum`, `/datenschutz` |
| Admin dashboard | `src/app/admin/` |
| Section components | `src/components/` |
| Database access | `src/lib/db.ts` (pool, `hasDb`), `src/lib/content.ts` (queries) |
| Auth | `src/lib/auth.ts`, `src/lib/session.ts`, guard in `src/proxy.ts` |
| Public URL / indexing switch | `src/lib/site-url.ts` (`siteUrl`, `isLive`) |
| Schema | `db/schema.sql` (idempotent) |
| Migration runner | `scripts/migrate.mjs` |

### Page structure (homepage, in order)

Header → hero → client wall → "Das System" (three-ring diagram: Strategie, Identität,
Sichtbarkeit) → team → testimonials → CTA band → phone mockup → three-step process → FAQ →
blog teaser → final CTA → footer.

### Admin dashboard

`/admin`, single-password login (`ADMIN_PASSWORD` + `AUTH_SECRET`), HMAC-signed cookie,
rate limited via the `login_attempts` table. FAQ editor (add, edit, delete, reorder) and
blog editor (title, slug, excerpt, cover upload, Markdown toolbar, preview, draft or
published). Saving revalidates the affected public pages.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm run db:migrate           # creates tables, seeds the FAQ once
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL` the site still runs: the FAQ falls back to the built-in list, the
blog is empty and the admin login is inactive. On Vercel, `vercel-build` runs the migration
before every build and skips it with a warning when Neon is not connected.

Environment variables (see `.env.example`): `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`,
`ADMIN_PASSWORD`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`.

## Current state

v0.2.1 is live. **Neither Neon nor Vercel Blob is connected yet**, so the site runs on the
fallback FAQ, the blog is empty and the admin login does not work.

## Open tasks, roughly in order

1. **Domain nuvanalab.de** (bought at Squarespace, 2026-09-25). DNS still points to
   Squarespace. Replace with the A and CNAME records Vercel shows, then set
   `NEXT_PUBLIC_SITE_URL`. Until that variable is set, `robots.ts` blocks all crawlers
   by design — that is intentional, not a bug.
2. **Connect Neon and Vercel Blob**, add `ADMIN_PASSWORD` and `AUTH_SECRET`, redeploy so
   the migration runs.
3. **Replace placeholders**: client logos and project photos, Hesam's portrait,
   behind-the-scenes photos, hero showreel, vertical reel for the phone mockup,
   testimonials.
4. **Impressum and Datenschutz** are placeholders and legally required in Germany before
   real promotion. Both are `noindex` until filled — remove that once they are real.
5. Optional later: contact form instead of Instagram DM only; Farsi version of the site.
