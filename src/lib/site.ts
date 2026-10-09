// Set NEXT_PUBLIC_SITE_URL once a real domain is attached; falls back to
// localhost so robots.ts/sitemap.ts don't hard-code a domain no one confirmed.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
