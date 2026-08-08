// app/buy/page.tsx

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/buy");
}

export default function BuyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-title mb-4">Buy <span className="accent">Property</span></h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Browse top residential projects across Pune, Mumbai and KDMC.
          </p>
        </div>
      </section>
    </main>
  );
}