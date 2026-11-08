import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { CSSProperties } from "react";

import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { FooterGate } from "@/components/layout/footer-gate";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Analytics } from "@/components/analytics/analytics";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/config/site.config";

import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const headingFont = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const brandVars = {
  "--brand-primary": siteConfig.brand.colors.primary,
  "--brand-primary-dark": siteConfig.brand.colors.primaryDark,
  "--brand-primary-light": siteConfig.brand.colors.primaryLight,
  "--brand-accent": siteConfig.brand.colors.accent,
  "--brand-accent-dark": siteConfig.brand.colors.accentDark,
  "--brand-ink": siteConfig.brand.colors.ink,
  "--brand-muted": siteConfig.brand.colors.muted,
  "--brand-surface": siteConfig.brand.colors.surface,
  "--brand-whatsapp": siteConfig.brand.colors.whatsapp,
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "health",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.brand.colors.primary,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={brandVars}>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} min-h-dvh bg-white font-sans text-ink antialiased pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <FooterGate>
          <SiteFooter />
        </FooterGate>
        <MobileActionBar />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
