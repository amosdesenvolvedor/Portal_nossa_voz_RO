import { SITE_CONFIG } from "@/config/site";
import { SEO_CONFIG } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

export type NewsArticleJsonLdInput = {
  headline: string;
  description: string;
  canonicalPath: string;
  datePublished: string;
  dateModified: string;
  section?: string;
  tags?: string[];
  authorName: string;
  authorPath?: string;
  imageUrl?: string | null;
};

export function buildNewsArticleJsonLd(input: NewsArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.canonicalPath),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: SEO_CONFIG.siteLanguage,
    articleSection: input.section,
    keywords: input.tags && input.tags.length > 0 ? input.tags.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: input.authorName,
      url: input.authorPath ? absoluteUrl(input.authorPath) : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE_CONFIG.logo.src),
      },
    },
    image: absoluteUrl(input.imageUrl || SEO_CONFIG.socialImage.path),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/-->/g, "--\\u003e");
}
