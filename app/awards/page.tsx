'use client';

import Link from 'next/link';
import { Trophy, Phone, ArrowRight } from 'lucide-react';
import AwardsSection from '@/components/sections/AwardsSection';

export default function AwardsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-[#101C2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B0000]/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-16 md:py-24 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F8C21C] text-[#8B0000] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Trophy size={16} />
              <span>Awards &amp; Recognition</span>
            </div>
            <h1 className="page-title text-white mb-4">
              Celebrating a Legacy of <span className="accent">Excellence</span>
            </h1>
            <p className="text-lg text-white/90">
              Industry recognition that reflects our commitment to sales excellence,
              innovation and unmatched customer satisfaction across Pune, Mumbai &amp; KDMC.
            </p>
          </div>
        </div>
      </div>

      {/* Reused awards + stats (no in-section "View all" link on its own page) */}
      <AwardsSection />

      {/* CTA */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#005E60] to-[#003537]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="section-title mb-4">Partner with an Award-Winning Team</h2>
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
