# Changelog

All notable changes to this project are documented here. Format: Keep a Changelog, versioning: SemVer.

## [0.2.1] - 2026-09-25

### Fixed
- Vercel build no longer fails when Neon is not connected yet; the migration is skipped with a warning.

## [0.2.0] - 2026-09-25

### Added
- Blog: "Aus dem Blog" section after the FAQ, /blog overview and /blog/[slug] article pages with BlogPosting schema; posts appear in the sitemap.
- Admin dashboard at /admin: password login with rate limiting, FAQ editor (add, edit, delete, reorder), blog editor (title, URL, summary, cover upload, formatting toolbar, preview, draft or published).
- Postgres storage (Neon) with idempotent `npm run db:migrate`; the existing 6 FAQ entries are seeded automatically.
- Cover image upload via Vercel Blob (local /public/uploads in development).
- "Blog" link in the main navigation.

### Changed
- "Das System" diagram redesigned as three rings (Strategie, Identität, Sichtbarkeit) around "Deine Marke"; the ring of the text block in view is highlighted. Fixes overlapping tags.
- FAQ content moved from code to the database; the site falls back to the built in FAQ if the database is unreachable.
- Public pages moved into the (site) route group; admin has its own layout.

## [0.1.0] - 2026-09-25

### Added
- Homepage for nuvana.lab with the section structure of august.productions: header, hero, client wall, system, team, testimonials, approach, 3 step process, FAQ, final CTA, footer.
- Pages: /kontakt, /impressum and /datenschutz (legal pages are placeholders and set to noindex).
- SEO/AIO: metadata, Open Graph image, icons, sitemap, robots, ProfessionalService and FAQPage JSON-LD.
- All copy centralised in src/content/site.ts; unfinished content shows a visible "Platzhalter" badge.
