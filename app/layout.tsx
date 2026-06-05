import type { Metadata } from "next";
import { Montserrat, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Providers } from "./providers";
import StickyActions from "@/components/common/StickyActions";
import Chatbot from "@/components/Chatbot"; // Add this import

// ✅ Site-wide fonts: Montserrat (headings) + Jost (body), Geist_Mono (code)
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://propfinder.in"),
  title: {
    default: "Associatte PropTech | Find Your Dream Property in Mumbai, Pune & Kharghar",
    template: "%s | PropFinder"
  },
  description: "Associatte PropTech Pvt Ltd: Find verified 2, 3, 4 BHK properties in Mumbai, Pune, Kharghar. Browse new launches & ready-to-move projects starting ₹75L. Trusted real estate guidance.",
  keywords: [
    "PropFinder", "Associatte PropTech", "real estate India", "properties in Mumbai",
    "flats in Pune", "3 BHK Kharghar", "under construction projects", "ready to move homes",
    "property investment", "new launch projects", "Mantra 1 Residences", "Paradise Sai World Empire"
  ],
  authors: [{ name: "Associatte PropTech Pvt Ltd", url: "https://www.associatte.com/" }],
  creator: "Associatte PropTech Pvt Ltd",
  publisher: "Associatte PropTech Pvt Ltd",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.associatte.com/",
    siteName: "PropFinder",
    title: "PropFinder by Associatte PropTech | Verified Real Estate Projects",
    description: "Discover 500+ verified properties in Mumbai, Pune & Kharghar. 2, 3, 4 BHK homes with transparent pricing & expert guidance.",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "PropFinder by Associatte PropTech - Find Your Dream Home",
      type: "image/jpeg"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "PropFinder | Verified Properties by Associatte PropTech",
    description: "Browse 2, 3, 4 BHK properties in Mumbai, Pune, Kharghar. Starting ₹75L.",
    images: ["/og-image.jpg"],
    creator: "@associatteproptech"
  },
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
  verification: {
    google: "your-google-site-verification-code",
  },
  category: "real estate",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Associatte PropTech Pvt Ltd",
  "alternateName": "PropFinder",
  "url": "https://www.associatte.com/",
  "logo": "https://www.associatte.com/logo.png",
  "image": "https://www.associatte.com/og-image.jpg",
  "description": "Associatte PropTech Pvt Ltd: Your trusted partner for verified real estate projects in Mumbai, Pune & Kharghar. Find 2, 3, 4 BHK homes with transparent pricing.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "Maharashtra"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-8743563546",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi", "Marathi"]
  },
  "sameAs": [
    "https://www.facebook.com/AssociatteIndia/",
    "https://x.com/Associatte",
    "https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==",
    "https://www.linkedin.com/company/associatte-proptech"
  ],
  "priceRange": "₹75L - ₹1Cr+"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className={`${montserrat.variable} ${jost.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Header />
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
        <Footer />
        <StickyActions showScrollTop={true} />
        <Chatbot /> {/* Add the Chatbot component here */}
      </body>
    </html>
  );
}