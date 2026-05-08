'use client';

import { useState, useEffect } from 'react';

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onSubmit?: (data: { name: string; phone: string; email: string }) => void;
}

export default function EnquiryPopup({ isOpen, onClose, projectName, onSubmit }: EnquiryPopupProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ESC to close + prevent background scroll
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit Indian number';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    // 🔄 Replace with your actual API call later
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSubmit) onSubmit(formData);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ name: '', phone: '', email: '' });
      onClose();
    }, 2000);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#005E60] text-white p-5 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Enquire Now</h3>
            <p className="text-sm text-white/80 mt-1 line-clamp-2">{projectName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#005E60]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#005E60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Enquiry Received!</h4>
              <p className="text-sm text-gray-600 mt-2">Our expert will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-[#8B0000]">*</span>
                </label>
                <input
                  id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-[#8B0000] bg-[#8B0000]/5' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#005E60] transition-all`}
                />
                {errors.name && <p className="mt-1 text-xs text-[#8B0000]">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number <span className="text-[#8B0000]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium flex items-center gap-1">
                    🇮🇳 +91
                  </span>
                  <input
                    id="phone" name="phone" type="tel" value={formData.phone} onChange={handlePhoneChange}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-20 pr-4 py-2.5 rounded-lg border ${errors.phone ? 'border-[#8B0000] bg-[#8B0000]/5' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#005E60] transition-all`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-[#8B0000]">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-[#8B0000]">*</span>
                </label>
                <input
                  id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-[#8B0000] bg-[#8B0000]/5' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#005E60] transition-all`}
                />
                {errors.email && <p className="mt-1 text-xs text-[#8B0000]">{errors.email}</p>}
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-xl hover:bg-[#e6b418] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Enquiry'}
              </button>

              <p className="text-xs text-gray-500 text-center pt-2">
                By submitting, you agree to receive communications via SMS/Email/Call.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}