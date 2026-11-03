// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import GoogleAnalytics from "@/components/SEO/GoogleAnalytics";
import FacebookPixel from "@/components/SEO/FacebookPixel";
import { getSeoOverride } from "@/lib/seo-store";
import { seoPageByPath } from "@/lib/seo-pages";
import { SITE_URL, SITE_NAME, ORG_LEGAL_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap"
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap"
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// WebSite node. Linked to the Organization node (components/SEO/OrganizationSchema)
// by @id. The old SearchAction was dropped: Google retired the sitelinks search box.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: "Associatte",
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Revalidate every 5 minutes so admin SEO edits go live without a rebuild.
export const revalidate = 300;

// Site-wide defaults only. Deliberately NO canonical or og:url here: every page
// sets its own, and a root-level canonical "/" was being inherited by pages that
// didn't (builders, 404s), telling Google they were duplicates of the homepage.
export async function generateMetadata(): Promise<Metadata> {
  const home = seoPageByPath("/");
  const override = await getSeoOverride("/");
  const defaultTitle =
    override?.title?.trim() ||
    home?.title ||
    "Associatte PropTech | Buy Verified Properties in Pune, Mumbai & KDMC";
  const defaultDescription =
    override?.description?.trim() ||
    home?.description ||
    "Find verified RERA-registered 1, 2, 3 & 4 BHK flats and projects across Pune, Mumbai and KDMC.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: defaultDescription,
    applicationName: SITE_NAME,
    authors: [{ name: ORG_LEGAL_NAME }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(GOOGLE_SITE_VERIFICATION
      ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
      : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: "Associatte PropTech — verified properties in Pune, Mumbai & KDMC",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Fonts are self-hosted by next/font, so no Google Fonts preconnect is needed. */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#005E60" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${jost.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
        <FacebookPixel pixelId="443378928117403" />
      </body>
    </html>
  );
}
