import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hxmza.uk",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
