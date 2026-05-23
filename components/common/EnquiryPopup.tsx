'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, MessageSquare, Sparkles } from 'lucide-react';

interface TrackingData {
  source: string;
  campaign: string;
  medium: string;
  city?: string; // Make city optional
}

interface EnquiryPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  projectName?: string;
  projectTagline?: string;
  theme?: 'default' | 'gradient';
  trackingData?: TrackingData;
  onSubmit?: (payload: any) => void;
}

export default function EnquiryPopup({ 
  isOpen = false, 
  onClose,
  projectName = 'Properties',
  projectTagline = 'Get personalized property recommendations',
  theme = 'default',
  trackingData,
  onSubmit
}: EnquiryPopupProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      projectName,
      trackingData,
      timestamp: new Date().toISOString()
    };
    
    console.log('📩 Enquiry Submitted:', payload);
    
    if (onSubmit) {
      onSubmit(payload);
    }
    
    onClose?.();
  };

  const isGradient = theme === 'gradient';
  const gradientStyle = isGradient 
    ? 'bg-gradient-to-r from-[#8B0000] to-[#005E60]'
    : 'bg-white';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className={`${isGradient ? gradientStyle : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
              {/* Header */}
              <div className={`flex justify-between items-center p-6 ${isGradient ? 'border-b border-white/20' : 'border-b border-gray-100'}`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isGradient ? 'text-white' : 'bg-gradient-to-r from-[#8B0000] to-[#005E60] bg-clip-text text-transparent'}`}>
                    Enquiry Form
                  </h2>
                  <p className={`text-sm mt-1 ${isGradient ? 'text-white/80' : 'text-gray-500'}`}>
                    {projectTagline}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 ${isGradient ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-500'} rounded-full transition-colors`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Project Name Badge */}
              {projectName && (
                <div className={`px-6 py-3 ${isGradient ? 'bg-white/5' : 'bg-gray-50'} border-b ${isGradient ? 'border-white/10' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${isGradient ? 'text-[#F8C21C]' : 'text-[#005E60]'}`} />
                    <span className={`text-sm font-medium ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                      Interested in: <span className="font-bold">{projectName}</span>
                    </span>
                  </div>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${
                        isGradient 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${
                        isGradient 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${
                        isGradient 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className={`absolute left-3 top-3 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about your property requirements..."
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all resize-none ${
                        isGradient 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  Submit Enquiry
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}