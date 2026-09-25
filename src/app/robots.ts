import type { MetadataRoute } from "next";
import { isLive, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isLive) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: `${siteUrl}/sitemap.xml` };
}
