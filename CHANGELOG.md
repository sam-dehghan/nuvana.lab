# Changelog

All notable changes to this project are documented here. Format: Keep a Changelog, versioning: SemVer.

## [0.2.4] - 2026-09-26

### Added
- Admin entry point in the header: a padlock icon next to the main call to action links to the password-protected admin area, so the blog and FAQ editors are reachable without typing the URL. Below 860px the icon is replaced by an "Admin" link in the burger menu, matching how the navigation and the call to action already behave. The link carries `rel="nofollow"`, and the admin pages remain `noindex`.

## [0.2.3] - 2026-09-26

### Fixed
- "Das System": the ring diagram no longer escapes its section on viewports narrower than 900px. The mobile breakpoint set `.diagram` to `position: static`, which removed the containing block that the rings, the ring labels and the "Deine Marke" core position against, so they were laid out against the page and appeared over the hero. The breakpoint now uses `position: relative` and resets `top` to `0`: `relative` restores the positioning context, and the reset cancels the `top: 7rem` sticky offset from the desktop rule, which would otherwise push the diagram down over the text blocks.

## [0.2.2] - 2026-09-25

### Changed
- CLAUDE.md now carries the full project context: stack, working rhythm, the rules that must not be broken, where things live, local setup commands, current state and the open tasks. Previously it only imported AGENTS.md, which `next dev` overwrites.

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
