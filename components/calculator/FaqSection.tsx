'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What is a home loan EMI?',
    a: 'EMI (Equated Monthly Installment) is the fixed amount you pay to the bank every month until the loan is fully repaid. It includes both principal and interest components.',
  },
  {
    q: 'How is home loan EMI calculated?',
    a: 'EMI is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P = principal, R = monthly interest rate, N = loan tenure in months.',
  },
  {
    q: 'What documents are required for a home loan?',
    a: 'Typically you’ll need KYC documents, salary slips (last 3 months), Form 16 / ITR (last 2 years), bank statements (last 6 months), and property documents.',
  },
  {
    q: 'What is the maximum home loan tenure?',
    a: 'Most banks in India offer a maximum tenure of 30 years, or up to the borrower’s retirement age — whichever is earlier.',
  },
  {
    q: 'Can I prepay my home loan?',
    a: 'Yes. For floating-rate home loans, RBI mandates zero prepayment charges. Fixed-rate loans may carry a small fee — check with your lender.',
  },
  {
    q: 'How much down payment is required?',
    a: 'Banks usually fund 75–90% of the property value. You’ll need to arrange the remaining 10–25% as down payment from your own funds.',
  },
  {
    q: 'What is the current home loan interest rate?',
    a: 'As of 2026, most leading banks offer home loans between 8.35% and 9.50% p.a., depending on your credit score and loan amount.',
  },
  {
    q: 'Can I get a home loan for a resale property?',
    a: 'Yes. Resale properties are eligible, but the bank will conduct a legal and technical verification before sanctioning the loan.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-[#005E60]" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Everything you need to know about home loans, EMI and property buying.
        </p>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}