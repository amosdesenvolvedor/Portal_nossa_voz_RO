import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { AppChrome } from "@/components/app/AppChrome";
import { SITE_CONFIG } from "@/config/site";
import { SEO_ALLOW_INDEXING, SEO_CONFIG } from "@/lib/seo/config";
import { defaultSocialImage } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SEO_CONFIG.siteDescription,
  applicationName: SITE_CONFIG.applicationName,
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  alternates: {
    canonical: absoluteUrl("/"),
  },
  authors: [{ name: SITE_CONFIG.name }],
  publisher: SITE_CONFIG.name,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    title: SITE_CONFIG.name,
    description: SEO_CONFIG.siteDescription,
    siteName: SITE_CONFIG.name,
    locale: SEO_CONFIG.siteLocale,
    url: absoluteUrl("/"),
    images: defaultSocialImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SEO_CONFIG.siteDescription,
    images: defaultSocialImage().map((image) => image.url),
  },
  robots: {
    index: SEO_ALLOW_INDEXING,
    follow: SEO_ALLOW_INDEXING,
    googleBot: {
      index: SEO_ALLOW_INDEXING,
      follow: SEO_ALLOW_INDEXING,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col bg-canvas text-text">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
