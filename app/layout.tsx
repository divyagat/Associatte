// app/layout.tsx (simplified)
import type { Metadata } from "next";
import { Montserrat, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
// app/layout.tsx
import EnquiryPopup from "../components/common/EnquiryPopup";  // ← Note the path

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

export const metadata: Metadata = {
  // ... your metadata (same as before)
};

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
      </head>
      <body
        className={`${montserrat.variable} ${jost.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>



        <EnquiryPopup
          autoPopup={true}
          popupDelay={8000}  // 8 seconds
          projectName="Associatte PropTech"
          projectTagline="Find your dream property with expert guidance"
          theme="gradient"
          showLegalLinks={true}
          formName="Website Auto Popup Enquiry"
          trackingData={{
            source: 'website',
            campaign: 'auto_popup',
            medium: 'organic',
            city: ''
          }}
        />
      </body>
    </html>
  );
}