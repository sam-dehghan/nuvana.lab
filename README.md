# nuvana.lab website

Next.js 16 (App Router, TypeScript, CSS Modules), Postgres (Neon), Vercel Blob.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm run db:migrate           # creates tables, seeds the FAQ once
npm run dev                  # http://localhost:3000
```

Admin: http://localhost:3000/admin

Without `DATABASE_URL` the site still runs with the built in FAQ and no blog posts; the admin needs the database.

## Deploy on Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Vercel > Storage: add **Neon** (sets `DATABASE_URL`) and **Blob** (sets `BLOB_READ_WRITE_TOKEN`).
3. Vercel > Settings > Environment Variables: add `ADMIN_PASSWORD` and `AUTH_SECRET` (`openssl rand -base64 48`).
4. Deploy. The `vercel-build` script runs the migration before every build.
5. When the domain is ready: add it in Vercel and set `NEXT_PUBLIC_SITE_URL`.

## Editing content
- FAQ and blog: in the admin dashboard. Changes go live immediately.
- All other text: `src/content/site.ts`. Items with `placeholder: true` show a "Platzhalter" badge.

## Before launch
1. Set `NEXT_PUBLIC_SITE_URL`. Until it is set, robots.txt blocks all crawlers.
2. Fill Impressum and Datenschutz, then remove their `robots: { index: false }`.
3. Replace every placeholder.
