import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Percent,
  Phone,
  MessageCircle,
} from 'lucide-react';
import EmiCalculatorPanel from '@/components/common/EmiCalculatorPanel';
import FaqSection from '@/components/calculator/FaqSection';
import LeadCaptureForm from '@/components/calculator/LeadCaptureForm';
import WhatsAppFloat from '@/components/common/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator | Associatte',
  description:
    'Calculate your monthly home loan EMI, total interest and payment breakdown instantly. Free EMI calculator for properties in Pune, Mumbai & KDMC.',
  alternates: { canonical: '/calculator' },
};

const WHATSAPP_NUMBER = '918881188181'; // replace with your business number

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#101C2E] text-white py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
            <Calculator className="w-4 h-4 text-[#F8C21C]" />
            <span className="text-xs font-semibold">Free Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Home Loan <span className="text-[#F8C21C]">EMI Calculator</span>
          </h1>
          <p className="text-sm sm:text-lg text-white/90 max-w-2xl">
            Plan your purchase with confidence. Adjust the loan amount, interest rate and tenure to
            see your monthly EMI, total interest and full payment breakdown instantly.
          </p>

          {/* ✅ Two CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/contact-us?service=home-loans"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#F8C21C] text-[#101C2E] font-semibold rounded-lg hover:bg-[#f5b800] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Apply for Loan
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator + Side rail */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <EmiCalculatorPanel />
          </div>

          <aside className="space-y-4">
            {/* Quick WhatsApp alert */}
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl shadow-sm p-5 text-white">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-bold mb-1">Quick Help?</h2>
                  <p className="text-sm text-white/90 mb-3">
                    Chat with our loan advisor on WhatsApp — get answers in minutes.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      'Hi, I need help with a home loan.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2.5 bg-white text-[#128C7E] font-semibold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* ✅ Phone lead form → Dashboard */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Get a callback on your number
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Leave your number — our advisor will reach out within 30 minutes.
              </p>
              <LeadCaptureForm />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">
                Why use this calculator?
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Plan your
                  budget before you buy.
                </li>
                <li className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Compare
                  rates &amp; tenures side by side.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Zero
                  brokerage on every listing.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ✅ FAQs */}
      <FaqSection />

      {/* ✅ Floating WhatsApp button */}
      <WhatsAppFloat number={WHATSAPP_NUMBER} />
    </main>
  );
}