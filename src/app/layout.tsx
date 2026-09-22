import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { SITE_CONFIG } from "@/config/site";
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
  description: SITE_CONFIG.slogan,
  applicationName: SITE_CONFIG.applicationName,
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
      <body className="min-h-full flex flex-col bg-canvas text-text">
        <a
          href="#main-content"
          className="sr-only absolute left-3 top-3 z-50 rounded-sm bg-brand-accent px-3 py-2 text-body-sm font-semibold text-text focus:not-sr-only"
        >
          Pular para o conteudo
        </a>
        <PublicHeader />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <PublicFooter />
      </body>
    </html>
  );
}
