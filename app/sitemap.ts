import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
