// client/components/common/StickyActions.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ⭐ Premium icons
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { HiOutlineCalculator } from 'react-icons/hi';
import { IoArrowUp } from 'react-icons/io5';

const ACTIONS = [
  {
    id: 'calculator',
    label: 'EMI Calculator',
    icon: HiOutlineCalculator,
    color: '#005E60',
    action: 'open-calculator',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    color: '#25D366',
    action: 'https://wa.me/918881188181?text=Hi,%20I%27m%20interested%20in%20properties%20on%20Associatte',
  },
  {
    id: 'call',
    label: 'Call Us',
    icon: FiPhoneCall,
    color: '#8B0000',
    action: 'tel:+918881188181',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FaFacebookF,
    color: '#1877F2',
    action: 'https://www.facebook.com/AssociatteIndia/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    color: '#E4405F',
    action: 'https://instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==',
  },
  {
  id: 'linkedin',
  label: 'LinkedIn',
  icon: FaLinkedinIn,
  color: '#0A66C2',
  action: 'https://www.linkedin.com/company/associatteindia/posts/?feedView=all',
},
];

interface StickyActionsProps {
  showScrollTop?: boolean;
}

export default function StickyActions({ showScrollTop = true }: StickyActionsProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = (action: string) => {
    if (action === 'open-calculator') {
      // ✅ Dispatch custom event to open EMI Calculator modal
      window.dispatchEvent(new CustomEvent('open-emi-calculator'));
    } else if (action.startsWith('http') || action.startsWith('tel:')) {
      // External links / phone
      window.open(action, '_blank');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
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
                  onClick={() => handleAction(action.action)}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white/20"
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed right-4 bottom-6 z-[100] w-12 h-12 rounded-full bg-[#005E60] text-white flex items-center justify-center shadow-lg border-2 border-white/20"
          aria-label="Scroll to top"
        >
          <IoArrowUp size={22} />
        </motion.button>
      )}
    </>
  );
}