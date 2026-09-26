# Changelog

All notable changes to this project are documented here. Format: Keep a Changelog, versioning: SemVer.

## [0.2.7] - 2026-09-26

### Added
- The gallery cells take video. Each tile and each reel accepts a `video` path to a muted clip in `/public`, with `src` serving as the poster shown while it loads or on its own when there is no clip. Playback is started from an effect rather than the `autoplay` attribute, so a visitor who prefers reduced motion never sees a frame move.
- Three still tiles above the work gallery, each 16:9 with its own label, for the kinds of work the studio shows.
- A small uppercase label above the moving row.
- The moving row fades out at both edges, using a 12% mask on each side, so the loop no longer ends in a hard vertical line.

### Changed
- The gallery is now one moving row of vertical 9:16 stills instead of two rows of 3:2 landscape ones. Social video is shot vertically, and the cards grew from 139px to about 320px tall, so the stills are legible rather than decorative.
- `team.gallery` is now an object with `tiles`, `reelsLabel` and `reels` instead of a flat list of images. The three tile labels are placeholders until they are confirmed.
- The rows hold still for visitors who prefer reduced motion, matching how the System blocks and the hero mesh already behave, and declare `will-change: transform` to keep the animation on the compositor.

### Removed
- The second, reversed gallery row, along with the `.reverse` rule that drove it.

## [0.2.6] - 2026-09-26

### Changed
- Page sections now line up with the header. `--max` goes from 1240px to 1440px and `--gutter` adopts the header's `clamp(1.25rem, 2.5vw, 2rem)`, so the hero eyebrow, headline and intro start at the same left edge as the logo and end level with the call to action. Previously the header sat 116px wider on each side than every `.container`, which read as a misalignment at the top of the page.
- The header no longer carries its own width tokens; it uses `--max` and `--gutter` like everything else, so the two can no longer drift apart. Its own sizing is unchanged: the gutter already resolved to the same value at the 960px breakpoint, so the navigation keeps the same 16px of slack there.
- The gutter's lower bound stays at 1.25rem, so side margins on phones are unchanged at 20px.

## [0.2.5] - 2026-09-26

### Fixed
- Header: the navigation no longer wraps onto two lines. The bar needed about 965px but the shared `.container` only gave it 1144px at most and far less on narrower screens, so between 861px and 1049px flex squeezed the items until "Das System" and the call to action broke mid-label.

### Changed
- The header now sizes itself instead of using `.container`: it runs up to 1440px with a tighter gutter, so it reaches closer to the edges than the page sections do. Its gaps scale with the viewport, tight where space is scarce and roomier on wide screens, and the labels are set to `nowrap` with the bar items no longer allowed to shrink.
- The burger menu now takes over below 960px instead of below 860px. The desktop bar needs about 881px and only had roughly 818px at 861px, so the old breakpoint left a band where it could not fit; no common tablet sits in 861-959px in portrait, and those sizes are mostly resized desktop windows.

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
