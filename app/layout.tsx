// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Use direct relative paths instead of @/ alias + barrel
import Header from "../components/Layout/Header"; // ← Your working nav component
import Footer from "../components/Layout/Footer";              // ← Adjust path if needed
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropFinder",
  description: "Find your dream property",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* pt-20 because your nav has h-20 (80px) */}
        <Header />
        <Providers>
          <main className="pt-20 min-h-screen">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}