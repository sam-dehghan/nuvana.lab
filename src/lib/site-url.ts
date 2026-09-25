/**
 * The domain is not decided yet. Until NEXT_PUBLIC_SITE_URL is set, the site builds against
 * localhost and robots.ts blocks indexing, so placeholder content never lands in search results.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const isLive = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
