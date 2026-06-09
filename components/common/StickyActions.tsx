'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ⭐ Premium icons
import { FaWhatsapp, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
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
  priority?: 'high' | 'normal';
}> = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    color: '#25D366',
    type: 'external',
    url: 'https://wa.me/918881188181?text=Hi,%20I%27m%20interested%20in%20properties%20on%20Associatte',
    priority: 'high',
  },
  {
    id: 'call',
    label: 'Contact Us',
    icon: FiPhoneCall,
    color: '#8B0000',
    type: 'tel',
    url: 'tel:+918881188181',
    priority: 'high',
  },
  {
    id: 'calculator',
    label: 'EMI Calculator',
    icon: HiOutlineCalculator,
    color: '#005E60',
    type: 'calculator',
    priority: 'normal',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FaFacebookF,
    color: '#1877F2',
    type: 'external',
    url: 'https://www.facebook.com/AssociatteIndia/',
    priority: 'normal',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    color: '#E4405F',
    type: 'external',
    url: 'https://www.instagram.com/vikramm.associatte?igsh=MXM5aXhmNmZsYThicg==',
    priority: 'normal',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    color: '#0A66C2',
    type: 'external',
    url: 'https://www.linkedin.com/company/associatteindia/posts/?feedView=all',
    priority: 'normal',
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
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

  const SCROLL_TOP_COLOR = '#005E60';

  return (
    <>
      <EmiCalculator 
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultLoanAmount={currentLoanAmount}
      />

      {/* Floating Actions - Premium Pill Design */}
      <div className="fixed right-0 bottom-24 z-[100] flex flex-col gap-3 items-end pr-0">
        <AnimatePresence>
          {showButtons && ACTIONS.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredId === action.id;
            const isHighPriority = action.priority === 'high';
            const actionColor = action.color;
            
            return (
              <motion.div
                key={action.id}
                initial={{ scale: 0, x: 50, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                exit={{ scale: 0, x: 50, opacity: 0 }}
                transition={{ delay: 0.1 + index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleAction(action)}
                className="relative cursor-pointer"
                aria-label={action.label}
              >
                <motion.div
                  className="relative flex items-center gap-2 overflow-hidden h-12"
                  style={{ 
                    backgroundColor: actionColor,
                    borderRadius: '999px 0 0 999px',
                    boxShadow: isHovered 
                      ? `0 10px 25px -5px ${actionColor}80, 0 0 0 1px ${actionColor}30` 
                      : '0 4px 12px -2px rgba(0,0,0,0.15)',
                  }}
                  animate={{ width: isHovered ? 130 : 48 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon Container */}
                  <motion.div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 z-10"
                    animate={{
                      backgroundColor: isHovered ? '#ffffff' : 'rgba(255,255,255,0)',
                      borderRadius: '50%'
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <motion.div
                      animate={{ color: isHovered ? actionColor : '#ffffff' }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </motion.div>

                  {/* Text Label - Slides in smoothly from the left */}
                  <motion.div
                    className="h-full flex items-center pr-4 overflow-hidden whitespace-nowrap"
                  >
                    <motion.span 
                      className="text-[13px] font-semibold text-white tracking-wide drop-shadow-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
                    >
                      {action.label}
                    </motion.span>
                  </motion.div>

                  {/* Pulse Ring for High Priority (WhatsApp/Call) */}
                  {isHighPriority && !isHovered && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ borderRadius: '999px 0 0 999px', border: `2px solid ${actionColor}` }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Scroll to Top - Matching Premium Pill Design */}
      <AnimatePresence>
        {showScrollTop && showScrollTopBtn && (
          <motion.div
            initial={{ scale: 0, x: 50, opacity: 0 }}
            animate={{ scale: 1, x: 0, opacity: 1 }}
            exit={{ scale: 0, x: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed right-0 bottom-6 z-[100]"
          >
            <motion.div
              onMouseEnter={() => setHoveredId('scroll-top')}
              onMouseLeave={() => setHoveredId(null)}
              onClick={scrollToTop}
              className="relative cursor-pointer"
              aria-label="Scroll to top"
            >
              <motion.div
                className="relative flex items-center gap-2 overflow-hidden h-12"
                style={{ 
                  backgroundColor: SCROLL_TOP_COLOR,
                  borderRadius: '999px 0 0 999px',
                  boxShadow: hoveredId === 'scroll-top'
                    ? `0 10px 25px -5px ${SCROLL_TOP_COLOR}80, 0 0 0 1px ${SCROLL_TOP_COLOR}30` 
                    : '0 4px 12px -2px rgba(0,0,0,0.15)',
                }}
                animate={{ width: hoveredId === 'scroll-top' ? 120 : 48 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 z-10"
                  animate={{
                    backgroundColor: hoveredId === 'scroll-top' ? '#ffffff' : 'rgba(255,255,255,0)',
                    borderRadius: '50%'
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ color: hoveredId === 'scroll-top' ? SCROLL_TOP_COLOR : '#ffffff' }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <IoArrowUp className="w-5 h-5" />
                  </motion.div>
                </motion.div>

                <motion.div className="h-full flex items-center pr-4 overflow-hidden whitespace-nowrap">
                  <motion.span 
                    className="text-[13px] font-semibold text-white tracking-wide drop-shadow-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={hoveredId === 'scroll-top' ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
                  >
                    Back to Top
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}