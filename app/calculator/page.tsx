import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ShieldCheck, TrendingUp, Percent } from 'lucide-react';
import EmiCalculatorPanel from '@/components/common/EmiCalculatorPanel';

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator | Associatte',
  description:
    'Calculate your monthly home loan EMI, total interest and payment breakdown instantly. Free EMI calculator for properties in Pune, Mumbai & KDMC.',
  alternates: { canonical: '/calculator' },
};

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
        </div>
      </section>

      {/* Calculator */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <EmiCalculatorPanel />
          </div>

          {/* Side rail */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">Why use this calculator?</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Plan your budget before you buy.</li>
                <li className="flex items-start gap-2"><Percent className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Compare rates &amp; tenures side by side.</li>
                <li className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-[#005E60] mt-0.5 flex-shrink-0" /> Zero brokerage on every listing.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#005E60] to-[#004a4d] rounded-2xl shadow-sm p-5 text-white">
              <h2 className="text-base font-bold mb-1">Need a home loan?</h2>
              <p className="text-sm text-white/85 mb-4">Our advisors help you get the best rate from leading banks.</p>
              <Link
                href="/contact-us?service=home-loans"
                className="inline-block w-full text-center py-2.5 bg-white text-[#005E60] font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Apply for Loan
              </Link>
            </div>

            <Link
              href="/properties"
              className="block text-center py-2.5 border border-gray-200 bg-white text-[#005E60] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Properties
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
