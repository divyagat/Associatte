// app/buy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Property | Associatte PropTech",
  description:
    "Explore flats, villas, and investment properties in Pune, Mumbai and KDMC. Find your dream home today.",
};

export default function BuyPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Buy Property</h1>
      <p className="text-lg text-gray-600">
        Browse top residential projects across Pune, Mumbai and KDMC.
      </p>
    </main>
  );
}