// client/components/common/EnquiryPopup.tsx
'use client';

import { useState, useEffect } from 'react';

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  projectImage?: string;
  projectTagline?: string;
  prefillData?: { name?: string; phone?: string; email?: string };
  trackingData?: { source?: string; campaign?: string; medium?: string };
  onSubmit?: (payload: any) => void;
  theme?: 'light' | 'dark' | 'gradient';
}

export default function EnquiryPopup({
  isOpen,
  onClose,
  projectName = 'Property Enquiry',
  projectImage,
  projectTagline = 'Get exclusive details & pricing',
  prefillData,
  trackingData,
  onSubmit,
  theme = 'gradient',
}: EnquiryPopupProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // 🔄 Smart Auto-Fill
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    let stored = {} as Record<string, string>;
    try {
      const cached = localStorage.getItem('enquiry_cache');
      if (cached) stored = JSON.parse(cached);
    } catch {}

    const dynamicFill = {
      name: prefillData?.name || params.get('name') || stored.name || '',
      phone: prefillData?.phone || params.get('phone') || stored.phone || '',
      email: prefillData?.email || params.get('email') || stored.email || '',
    };
    setFormData(dynamicFill);
    setErrors({});
    setTouched({});
  }, [isOpen, prefillData]);

  // ESC + Scroll Lock
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 🛡️ Validation
  const validate = (name: string, value: string) => {
    if (!value.trim()) return `${name} is required`;
    if (name === 'phone' && !/^[6-9]\d{9}$/.test(value)) return 'Enter valid 10-digit Indian number';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter valid email address';
    return '';
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    handleChange('phone', cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    ['name', 'phone', 'email'].forEach(field => {
      const error = validate(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, phone: true, email: true });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const payload = {
      ...formData,
      projectName,
      source: trackingData?.source,
      campaign: trackingData?.campaign,
      medium: trackingData?.medium,
      timestamp: new Date().toISOString()
    };

    if (onSubmit) onSubmit(payload);
    try { localStorage.setItem('enquiry_cache', JSON.stringify(formData)); } catch {}

    // ✅ Set submitted data for thank you page
    setSubmittedData({
      name: formData.name,
      project: projectName,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    });
    
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  const getProjectInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') return 'PR';
    const initials = name.trim().split(' ').map(w => w[0]).filter(c => c?.trim()).slice(0, 2).join('').toUpperCase();
    return initials || 'PR';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#005E60]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#F8C21C]/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-200/50"
        onClick={e => e.stopPropagation()}
      >
        {/* ✨ Premium Header - Same for both states */}
        <div className="bg-gradient-to-r from-[#005E60] to-[#004a4d] text-white px-6 py-5 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <pattern id="headerPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#headerPattern)" />
            </svg>
          </div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Project Image/Initials */}
              <div className="relative">
                {projectImage && !imageError ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-lg bg-gray-100">
                    <img 
                      src={projectImage} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold">{getProjectInitials(projectName)}</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F8C21C] rounded-full border-2 border-white" />
              </div>
              
              {/* Project Info */}
              <div className="min-w-0">
                <h3 id="popup-title" className="text-lg font-bold leading-tight truncate">{projectName}</h3>
                <p className="text-sm text-white/80 mt-0.5">{projectTagline}</p>
              </div>
            </div>
            
            {/* Close Button - Only show in form mode */}
            {!showSuccess && (
              <button 
                onClick={onClose}
                className="p-2 -mr-2 -mt-2 hover:bg-white/10 rounded-xl transition-colors group"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 📝 Content Area */}
        <div className="p-6">
          {showSuccess ? (
            // ✅ Beautiful Thank You Page Design
            <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Animated Success Icon */}
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#005E60] to-[#004a4d] rounded-full flex items-center justify-center shadow-xl mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Success pulse animation */}
                <div className="absolute inset-0 rounded-full bg-[#005E60]/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full border-2 border-[#F8C21C]/30 animate-pulse" />
              </div>

              {/* Thank You Message */}
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You, {submittedData?.name?.split(' ')[0]}! ✨
              </h4>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your enquiry for <span className="font-semibold text-[#005E60]">{submittedData?.project}</span> has been received successfully.
              </p>

              {/* What Happens Next */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 mb-6 text-left">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#F8C21C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What happens next?
                </h5>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-[#005E60]/10 text-[#005E60] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">1</span>
                    <span>Our property expert will review your requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-[#005E60]/10 text-[#005E60] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">2</span>
                    <span>You'll receive a personalized callback within <span className="font-semibold text-[#005E60]">24 hours</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-[#005E60]/10 text-[#005E60] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">3</span>
                    <span>Get exclusive project details, pricing, and site visit options</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-[#005E60]/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Need immediate assistance? 
                  <br />
                  <span className="font-semibold text-[#005E60]">Call us:</span>{' '}
                  <a href="tel:+918008001234" className="font-bold text-[#005E60] hover:underline">
                    +91 80080 01234
                  </a>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#005E60] text-white font-bold rounded-xl hover:bg-[#004a4d] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Continue Browsing</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setFormData({ name: '', phone: '', email: '' });
                    setTouched({});
                    setErrors({});
                  }}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#005E60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#005E60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>24h Response</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 📝 Original Form (unchanged)
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-[#8B0000]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 ${
                    errors.name && touched.name 
                      ? 'border-[#8B0000] bg-[#8B0000]/5 focus:border-[#8B0000]' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#005E60]'
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-1.5 text-xs text-[#8B0000] flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-[#8B0000]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                    🇮🇳 +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="98765 43210"
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className={`w-full pl-20 pr-4 py-3 rounded-xl border-2 bg-gray-50 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 font-mono tracking-wide ${
                      errors.phone && touched.phone 
                        ? 'border-[#8B0000] bg-[#8B0000]/5 focus:border-[#8B0000]' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-[#005E60]'
                    }`}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="mt-1.5 text-xs text-[#8B0000] flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-[#8B0000]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 ${
                    errors.email && touched.email 
                      ? 'border-[#8B0000] bg-[#8B0000]/5 focus:border-[#8B0000]' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#005E60]'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs text-[#8B0000] flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#F8C21C] to-[#f0b514] text-[#8B0000] font-bold rounded-xl hover:from-[#e6b418] hover:to-[#d9a812] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 group relative overflow-hidden"
              >
                {/* Button shine effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4 text-[#005E60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  By submitting, you agree to receive communications via SMS/Email/Call. 
                  <span className="font-medium text-gray-700"> We never share your data.</span>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Trust Badge Footer - Only show in form mode */}
        {!showSuccess && (
          <div className="px-6 pb-5 pt-1">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-[#005E60]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Secure • No spam • Instant response</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}