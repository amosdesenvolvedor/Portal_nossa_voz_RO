import type { Metadata } from "next";
import { SEO_CONFIG } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/urls";

export function truncateDescription(value: string | null | undefined, maxLength = 160): string {
  const normalized = (value ?? "").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return SEO_CONFIG.siteDescription;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function defaultSocialImage() {
  return [
    {
      url: absoluteUrl(SEO_CONFIG.socialImage.path),
      width: SEO_CONFIG.socialImage.width,
      height: SEO_CONFIG.socialImage.height,
      alt: SEO_CONFIG.socialImage.alt,
    },
  ];
}

export function resolveSocialImage(input?: {
  url?: string | null;
  alt?: string | null;
}) {
  if (!input?.url) {
    return defaultSocialImage();
  }

  return [
    {
      url: absoluteUrl(input.url),
      alt: input.alt || SEO_CONFIG.socialImage.alt,
    },
  ];
}

export const NO_INDEX_NO_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export const NO_INDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
  nocache: true,
  googleBot: {
    index: false,
    follow: true,
    noimageindex: true,
  },
};
