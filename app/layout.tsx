// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Keep your existing imports
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🎯 BRAND-SPECIFIC SEO METADATA
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://propfinder.in"),
  
  // 🔹 Title with brand template
  title: {
    default: "PropFinder by Associatte PropTech | Find Your Dream Property in Mumbai, Pune & Kharghar",
    template: "%s | PropFinder" // e.g., "Mantra 1 Residences - 3 BHK in Kharghar | PropFinder"
  },
  
  // 🔹 Description with company credibility + keywords
  description: "PropFinder by Associatte PropTech Pvt Ltd: Find verified 2, 3, 4 BHK properties in Mumbai, Pune, Kharghar. Browse new launches & ready-to-move projects starting ₹75L. Trusted real estate guidance.",
  
  // 🔹 Keywords optimized for Indian real estate
  keywords: [
    "PropFinder",
    "Associatte PropTech",
    "real estate India",
    "properties in Mumbai",
    "flats in Pune",
    "3 BHK Kharghar",
    "under construction projects",
    "ready to move homes",
    "property investment",
    "new launch projects",
    "Mantra 1 Residences",
    "Paradise Sai World Empire"
  ],
  
  // 🔹 Authors & company info
  authors: [
    { 
      name: "Associatte PropTech Pvt Ltd", 
      url: "https://propfinder.in" 
    }
  ],
  creator: "Associatte PropTech Pvt Ltd",
  publisher: "Associatte PropTech Pvt Ltd",
  
  // 🔹 Open Graph (for WhatsApp, Facebook, LinkedIn sharing)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://propfinder.in",
    siteName: "PropFinder",
    title: "PropFinder by Associatte PropTech | Verified Real Estate Projects",
    description: "Discover 500+ verified properties in Mumbai, Pune & Kharghar. 2, 3, 4 BHK homes with transparent pricing & expert guidance.",
    images: [
      {
        url: "/og-image.jpg", // Place in /public folder (1200x630px)
        width: 1200,
        height: 630,
        alt: "PropFinder by Associatte PropTech - Find Your Dream Home",
        type: "image/jpeg"
      }
    ]
  },
  
  // 🔹 Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "PropFinder | Verified Properties by Associatte PropTech",
    description: "Browse 2, 3, 4 BHK properties in Mumbai, Pune, Kharghar. Starting ₹75L.",
    images: ["/og-image.jpg"],
    creator: "@associatteproptech" // Update with your actual handle
  },
  
  // 🔹 Robots control
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
  
  // 🔹 Verification (add after claiming in Search Console)
  verification: {
    google: "your-google-site-verification-code", // Get from Google Search Console
  },
  
  // 🔹 Category
  category: "real estate",
};

// 🎯 ORGANIZATION SCHEMA (JSON-LD) - Critical for brand authority
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Associatte PropTech Pvt Ltd",
  "alternateName": "PropFinder",
  "url": "https://propfinder.in",
  "logo": "https://propfinder.in/logo.png",
  "image": "https://propfinder.in/og-image.jpg",
  "description": "PropFinder by Associatte PropTech Pvt Ltd: Your trusted partner for verified real estate projects in Mumbai, Pune & Kharghar. Find 2, 3, 4 BHK homes with transparent pricing.",
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
    "https://facebook.com/associatteproptech",
    "https://twitter.com/associatteproptech",
    "https://instagram.com/associatteproptech",
    "https://linkedin.com/company/associatte-proptech"
  ],
  "priceRange": "₹75L - ₹1Cr+"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🎯 Inject Organization Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(organizationSchema) 
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}