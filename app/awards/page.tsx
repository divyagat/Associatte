// app/awards/page.tsx
import type { Metadata } from 'next';
import { Trophy, Phone, ArrowRight, Award, Star, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AWARDS } from "@/lib/awards-data";

// ✅ SEO Metadata for the Awards Page
export const metadata: Metadata = {
  title: 'Awards & Recognition | Associatte PropTech',
  description: 'Industry recognition earned by Associatte PropTech for sales excellence, innovation, and customer satisfaction across Pune, Mumbai & KDMC real estate.',
  keywords: [
    'Associatte awards',
    'real estate awards Pune',
    'best real estate consultant Mumbai',
    'property advisor recognition',
    'Associatte PropTech achievements',
  ],
  alternates: { canonical: '/awards' },
  openGraph: {
    type: 'website',
    title: 'Awards & Recognition | Associatte PropTech',
    description: 'Industry recognition for sales excellence, innovation and customer satisfaction.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.associatte.com'}/awards`,
    siteName: 'Associatte PropTech',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awards & Recognition | Associatte PropTech',
    description: 'Industry recognition for sales excellence, innovation and customer satisfaction.',
  },
};

export default function AwardsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B0000]/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Trophy size={16} />
              <span>Awards & Recognition</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Celebrating a Legacy of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8C21C] to-[#005E60]">
                Excellence
              </span>
            </h1>
            
            <p className="text-lg text-white/90">
              Industry recognition that reflects our commitment to sales excellence,
              innovation and unmatched customer satisfaction across Pune, Mumbai & KDMC.
            </p>
          </div>
        </div>
      </div>

      {/* All Awards Grid - Clean Design */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {AWARDS.map((award, index) => (
              <AwardCard key={award.id} award={award} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Years of Excellence" value="15+" icon={Award} />
            <StatItem label="Happy Families" value="2500+" icon={Star} />
            <StatItem label="Awards Won" value="50+" icon={Trophy} />
            <StatItem label="Projects Delivered" value="120+" icon={Building} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#005E60] to-[#003537]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner with an Award-Winning Team
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Experience the service standards that earned us this recognition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F8C21C] text-[#8B0000] font-semibold rounded-xl hover:bg-[#e6b010] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Book Free Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+918881188181"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <Phone className="w-5 h-5" /> Call: +91 8881188181
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Clean Award Card Component (Matching your design) ---
function AwardCard({ award, index }: { award: any; index: number }) {
  return (
    <div className="flex flex-col items-center">
      {/* Framed Image */}
      <div className="relative w-full aspect-[4/3] bg-white p-4 shadow-2xl mb-6">
        <div className="relative w-full h-full border-4 border-gray-800 bg-white">
          <Image
            src={award.image}
            alt={award.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Drop shadow effect */}
        <div className="absolute inset-0 shadow-2xl pointer-events-none" />
      </div>

      {/* Award Name */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        {award.title}
      </h3>

      {/* Years */}
      <p className="text-[#005E60] font-semibold text-center">
        Awards {award.year}
      </p>
    </div>
  );
}

// --- Stats Component ---
function StatItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005E60] to-[#8B0000] text-white mb-4 shadow-xl mx-auto">
        <Icon className="w-8 h-8" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}