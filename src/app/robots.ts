import type { MetadataRoute } from "next";
import { SEO_ALLOW_INDEXING } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

export default function robots(): MetadataRoute.Robots {
  if (!SEO_ALLOW_INDEXING) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/design-system"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
