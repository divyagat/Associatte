// app/buy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Property | Associatte PropTech",
  description:
    "Explore flats, villas, and investment properties in Pune, Mumbai and KDMC. Find your dream home today.",
};

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