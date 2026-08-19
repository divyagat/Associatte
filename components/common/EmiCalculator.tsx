'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator } from 'lucide-react';
import EmiCalculatorPanel from './EmiCalculatorPanel';

interface EmiCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLoanAmount?: number;
}

export default function EmiCalculator({
  isOpen,
  onClose,
  defaultLoanAmount = 5000000,
}: EmiCalculatorProps) {
  // Amount handed to the shared panel; can be overridden by the global open event.
  const [amount, setAmount] = useState(defaultLoanAmount);

  useEffect(() => {
    if (defaultLoanAmount) setAmount(defaultLoanAmount);
  }, [defaultLoanAmount]);

  // Any part of the site can open the calculator with a preset amount.
  useEffect(() => {
    const handleOpenCalculator = (event: CustomEvent<{ amount?: number }>) => {
      if (event.detail?.amount) setAmount(event.detail.amount);
      document.dispatchEvent(new CustomEvent('emi-calculator-request-open'));
    };
    window.addEventListener('open-emi-calculator', handleOpenCalculator as EventListener);
    return () => window.removeEventListener('open-emi-calculator', handleOpenCalculator as EventListener);
  }, []);

  // Close on Escape.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emi-calculator-title"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 id="emi-calculator-title" className="text-lg font-bold">EMI Calculator</h3>
                <p className="text-xs text-white/80">Calculate your monthly payments</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body — shared panel */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <EmiCalculatorPanel defaultLoanAmount={amount} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 sticky bottom-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#005E60]/50"
            >
              Close
            </button>
            <a
              href="/contact-us?service=home-loans"
              className="flex-1 py-2.5 bg-[#005E60] text-white font-medium rounded-lg hover:bg-[#004a4d] transition-colors text-center focus:outline-none focus:ring-2 focus:ring-[#005E60]/50"
            >
              Apply for Loan
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
