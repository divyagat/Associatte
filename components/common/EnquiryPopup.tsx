'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, MessageSquare, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface TrackingData {
  source: string;
  campaign: string;
  medium: string;
  city?: string;
}

interface EnquiryPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  projectName?: string;
  projectTagline?: string;
  theme?: 'default' | 'gradient';
  trackingData?: TrackingData;
  onSubmit?: (payload: any) => void;
  simplified?: boolean; // If true, shows only Name, Phone, Email(optional)
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function EnquiryPopup({ 
  isOpen = false, 
  onClose,
  projectName = 'Properties',
  projectTagline = 'Get personalized property recommendations',
  theme = 'default',
  trackingData,
  onSubmit,
  simplified = false
}: EnquiryPopupProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  // Validate phone number (Indian format)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number: starts with 6-9 and 10 digits total
    return phoneRegex.test(phone);
  };

  // Validate email (optional but if provided must be valid)
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate name
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const message = simplified ? `Interested in ${projectName}` : (formData.get('message') as string);

    // Validation
    const newErrors: FormErrors = {};
    
    if (!validateName(name)) {
      newErrors.name = 'Please enter a valid name (minimum 2 characters)';
    }
    
    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email || '',
      phone: phone.trim(),
      message,
      projectName,
      trackingData,
      timestamp: new Date().toISOString()
    };
    
    console.log('📩 Enquiry Submitted:', payload);
    
    // Simulate API call (replace with your actual API)
    try {
      // await fetch('/api/enquiry', { method: 'POST', body: JSON.stringify(payload) });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      setSubmitSuccess(true);
      
      if (onSubmit) {
        onSubmit(payload);
      }
      
      // Close popup after success
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                    {simplified ? 'Request Callback' : 'Enquiry Form'}
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
              
              {/* Success Message */}
              {submitSuccess && (
                <div className="m-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700">Thank you! We'll contact you soon.</span>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name Field */}
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
                        errors.name 
                          ? 'border-red-500' 
                          : isGradient 
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                {/* Phone Field */}
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
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${
                        errors.phone 
                          ? 'border-red-500' 
                          : isGradient 
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                {/* Email Field - Optional */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Email Address <span className="text-xs opacity-70">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${
                        errors.email 
                          ? 'border-red-500' 
                          : isGradient 
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Message Field - Only for full form */}
                {!simplified && (
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
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-[#8B0000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    simplified ? 'Request Callback' : 'Submit Enquiry'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}