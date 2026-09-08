import { getBaseURL } from "@lib/util/env"
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/account"],
    },
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
