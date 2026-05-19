'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ⭐ Premium icons
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { HiOutlineCalculator } from 'react-icons/hi';
import { IoArrowUp } from 'react-icons/io5';

// Import the calculator component
import EmiCalculator from './EmiCalculator';

const ACTIONS: Array<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  type: 'calculator' | 'tel' | 'external';
  url?: string;
}> = [
  {
    id: 'calculator',
    label: 'EMI Calculator',
    icon: HiOutlineCalculator,
    color: '#005E60',
    type: 'calculator',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    color: '#25D366',
    type: 'external',
    url: 'https://wa.me/918881188181?text=Hi,%20I%27m%20interested%20in%20properties%20on%20Associatte',
  },
  {
    id: 'call',
    label: 'Call Us',
    icon: FiPhoneCall,
    color: '#8B0000',
    type: 'tel',
    url: 'tel:+918881188181',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FaFacebookF,
    color: '#1877F2',
    type: 'external',
    url: 'https://www.facebook.com/AssociatteIndia/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    color: '#E4405F',
    type: 'external',
    url: 'https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==',
  },
];

interface StickyActionsProps {
  showScrollTop?: boolean;
  defaultLoanAmount?: number;
}

export default function StickyActions({ 
  showScrollTop = true,
  defaultLoanAmount 
}: StickyActionsProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);
  
  // ✅ Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [currentLoanAmount, setCurrentLoanAmount] = useState(5000000);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = (action: typeof ACTIONS[0]) => {
    if (action.type === 'calculator') {
      // ✅ Open calculator with pre-filled amount (80% of property price or default)
      const amount = defaultLoanAmount ? Math.round(defaultLoanAmount * 0.8) : 5000000;
      setCurrentLoanAmount(amount);
      setIsCalculatorOpen(true);
    } else if (action.type === 'tel') {
      if (action.url) window.location.href = action.url;
    } else if (action.type === 'external') {
      if (action.url) window.open(action.url, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* ✅ EMI Calculator Modal - Rendered inside this Client Component */}
      <EmiCalculator 
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultLoanAmount={currentLoanAmount}
      />

      {/* Floating Actions */}
      <AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-4 bottom-24 z-[100] flex flex-col gap-3"
          >
            {ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.06 }}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(action)}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005E60]"
                  style={{ backgroundColor: action.color }}
                  title={action.label}
                  aria-label={action.label}
                >
                  <Icon className="text-white text-[20px]" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top */}
      {showScrollTop && showScrollTopBtn && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={scrollToTop}
          className="fixed right-4 bottom-6 z-[100] w-12 h-12 rounded-full bg-[#005E60] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005E60]"
          aria-label="Scroll to top"
        >
          <IoArrowUp size={22} />
        </motion.button>
      )}
    </>
  );
}