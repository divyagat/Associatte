// app/layout.tsx (simplified)
import type { Metadata } from "next";
import { Montserrat, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import GoogleAnalytics from "@/components/SEO/GoogleAnalytics";
import { getSeoOverride, keywordsToArray } from "@/lib/seo-store";
import { seoPageByPath } from "@/lib/seo-pages";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// WebSite structured data — enables the Google sitelinks search box and
// reinforces the canonical site name in search results.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Associatte PropTech",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/properties?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// The Home page ("/") has no page-level metadata of its own (it's a Client
// Component), so its SEO is controlled here. The default title/description/
// keywords come from the SEO_PAGES registry and merge any admin override for "/".
// force-dynamic keeps admin SEO edits live without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const home = seoPageByPath("/");
  const override = await getSeoOverride("/");

  const homeTitle =
    override?.title?.trim() ||
    home?.title ||
    "Associatte PropTech | Buy Verified Properties in Pune, Mumbai & KDMC";
  const homeDescription =
    override?.description?.trim() ||
    home?.description ||
    "Find verified RERA-registered 1, 2, 3 & 4 BHK flats and projects across Pune, Mumbai and KDMC. Expert guidance, transparent pricing and free consultation with Associatte PropTech.";
  const homeKeywords = keywordsToArray(override?.keywords) || home?.keywords;

  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeTitle,
    template: "%s | Associatte PropTech",
  },
  description: homeDescription,
  ...(homeKeywords ? { keywords: homeKeywords } : {}),
  authors: [{ name: "Associatte PropTech Pvt Ltd" }],
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
  alternates: { canonical: "/" },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    type: "website",
    siteName: "Associatte PropTech",
    title: homeTitle,
    description: homeDescription,
    locale: "en_IN",
    url: SITE_URL,
    images: [
      {
        url: "/Home/b4.webp",
        width: 1200,
        height: 630,
        alt: "Associatte PropTech — verified properties in Pune, Mumbai & KDMC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/Home/b4.webp"],
  },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      </body>
    </html>
  );
}