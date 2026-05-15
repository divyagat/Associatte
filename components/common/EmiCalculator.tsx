// client/components/common/EmiCalculator.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Info, ChevronDown } from 'lucide-react';

interface EmiCalculatorProps {
  isOpen?: boolean;           // Optional: direct control
  onClose?: () => void;       // Optional: direct control
  defaultLoanAmount?: number;
}

export default function EmiCalculator({ 
  isOpen: controlledOpen, 
  onClose: controlledClose, 
  defaultLoanAmount = 5000000 
}: EmiCalculatorProps) {
  // Internal state for event-based triggering
  const [internalOpen, setInternalOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Determine open state: controlled prop OR internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = controlledClose || (() => setInternalOpen(false));

  // ✅ Listen for global "open-emi-calculator" event
  useEffect(() => {
    const handleOpenEvent = () => setInternalOpen(true);
    window.addEventListener('open-emi-calculator', handleOpenEvent);
    return () => window.removeEventListener('open-emi-calculator', handleOpenEvent);
  }, []);

  // Calculate EMI using standard formula
  const calculateEMI = useMemo(() => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenure * 12;
    if (R === 0) return P / N;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return emi;
  }, [loanAmount, interestRate, tenure]);

  const totalPayment = calculateEMI * tenure * 12;
  const totalInterest = totalPayment - loanAmount;
  const principalPercentage = (loanAmount / totalPayment) * 100;
  const interestPercentage = (totalInterest / totalPayment) * 100;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(val);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">EMI Calculator</h3>
                <p className="text-xs text-white/80">Calculate your monthly payments</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body - Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                <span className="text-sm font-bold text-[#005E60]">{formatCurrency(loanAmount)}</span>
              </div>
              <input 
                type="range" 
                min="1000000" 
                max="20000000" 
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹10L</span>
                <span>₹1Cr</span>
                <span>₹2Cr</span>
              </div>
              {/* Quick presets */}
              <div className="flex gap-2 mt-3">
                {[5000000, 7500000, 10000000, 15000000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoanAmount(amount)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      loanAmount === amount 
                        ? 'bg-[#005E60] text-white border-[#005E60]' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#005E60]'
                    }`}
                  >
                    {amount >= 10000000 ? `₹${amount/10000000}Cr` : `₹${amount/1000000}L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Interest Rate (% p.a)</label>
                <span className="text-sm font-bold text-[#005E60]">{interestRate}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="15" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Tenure (Years)</label>
                <span className="text-sm font-bold text-[#005E60]">{tenure} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005E60]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1Y</span>
                <span>15Y</span>
                <span>30Y</span>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-gradient-to-br from-[#005E60]/5 to-[#F8C21C]/5 rounded-2xl p-5 border border-[#005E60]/20">
              <div className="text-center mb-5">
                <p className="text-sm text-gray-600 mb-1">Your Monthly EMI</p>
                <p className="text-3xl font-bold text-[#005E60]">{formatCurrency(calculateEMI)}</p>
                <p className="text-xs text-gray-500 mt-1">per month for {tenure} years</p>
              </div>
              
              {/* Principal vs Interest Visual */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${principalPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-[#005E60] rounded-full"
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-medium text-[#8B0000]">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${interestPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-[#8B0000] rounded-full"
                  />
                </div>
                
                <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-medium">
                  <span>Total Payment</span>
                  <span className="text-[#005E60]">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Toggle Breakdown */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">View Payment Breakdown</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Breakdown Table */}
            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="grid grid-cols-3 text-xs font-medium text-gray-500 pb-2 border-b">
                      <span>Year</span>
                      <span className="text-right">Principal</span>
                      <span className="text-right">Interest</span>
                    </div>
                    {[1, 5, 10, 15, 20].map((year) => {
                      const yearlyPrincipal = (loanAmount / tenure);
                      const yearlyInterest = (totalInterest / tenure);
                      return (
                        <div key={year} className="grid grid-cols-3 text-xs py-1.5 border-b border-gray-100 last:border-0">
                          <span className="text-gray-700">Year {year}</span>
                          <span className="text-right text-gray-600">{formatCurrency(yearlyPrincipal)}</span>
                          <span className="text-right text-[#8B0000]">{formatCurrency(yearlyInterest)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" />
              <p>EMI is an estimate. Actual rates may vary based on credit profile, bank policies & market conditions. Consult a financial advisor for personalized advice.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 sticky bottom-0">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <a 
              href="/contact-us?service=home-loans"
              className="flex-1 py-2.5 bg-[#005E60] text-white font-medium rounded-lg hover:bg-[#004a4d] transition-colors text-center"
            >
              Apply for Loan
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}