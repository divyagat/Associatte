// components/EnquiryPopup.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
  showLegalLinks?: boolean;
  formName?: string;
  onSubmit?: (payload: any) => void;
  trackingData?: TrackingData;  // ✅ ADD THIS
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  consent?: string;
}

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const countryCodes: CountryCode[] = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
];

export default function EnquiryPopup({
  isOpen = false,
  onClose,
  projectName = 'Properties',
  projectTagline = 'Get personalized property recommendations',
  theme = 'default',
  showLegalLinks = true,
  formName = 'Website Enquiry Form',
  onSubmit,
  trackingData,  // ✅ ADD THIS
}: EnquiryPopupProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [clientIp, setClientIp] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch client IP
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        setClientIp(ipData.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
        setClientIp('Unknown');
      }
    };

    if (isOpen) {
      fetchIp();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    return nameRegex.test(name.trim());
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

    const newErrors: FormErrors = {};

    if (!validateName(name)) {
      newErrors.name = 'Please enter a valid name (only letters and spaces, minimum 2 characters)';
    }

    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number (starts with 6-9)';
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (showLegalLinks && !consentGiven) {
      newErrors.consent = 'Please agree to the Terms & Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const cleanPhoneNumber = phone.trim();
    
    // Build remark with tracking data if provided
    let remark = `${formName} | IP: ${clientIp} | Country Code: ${countryCode}`;
    if (trackingData) {
      remark += ` | Source: ${trackingData.source} | Campaign: ${trackingData.campaign} | Medium: ${trackingData.medium} | City: ${trackingData.city || 'N/A'}`;
    }

    const payload = {
      name: name.trim(),
      phone: cleanPhoneNumber,
      email: email || '',
      project: projectName,
      remark: remark,
      trackingData: trackingData // Include tracking data in payload
    };

    console.log('📩 Enquiry Submitted:', payload);

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(payload);
    }

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      console.log('✅ Enquiry submitted successfully');
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose?.();
      }, 1500);

    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGradient = theme === 'gradient';

  const getSelectedCountry = () => {
    return countryCodes.find(c => c.code === countryCode) || countryCodes[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className={`${isGradient ? 'bg-gradient-to-r from-[#8B0000] to-[#005E60]' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
              <div className={`flex justify-between items-center p-6 ${isGradient ? 'border-b border-white/20' : 'border-b border-gray-100'}`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isGradient ? 'text-white' : 'bg-gradient-to-r from-[#8B0000] to-[#005E60] bg-clip-text text-transparent'}`}>
                    Request Callback
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

              {submitSuccess && (
                <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700">Thank you! We'll contact you soon.</span>
                </div>
              )}

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
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:border-transparent transition-all ${errors.name
                          ? 'border-red-500'
                          : isGradient
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      onInput={(e) => {
                        (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^A-Za-z\s]/g, '');
                      }}
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
                  <div className="flex gap-2">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C21C] transition-all ${isGradient
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                          }`}
                      >
                        <span className="text-lg">{getSelectedCountry().flag}</span>
                        <span className="font-medium">{getSelectedCountry().code}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCountryDropdownOpen && (
                        <div className={`absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border overflow-hidden z-20 ${isGradient
                            ? 'bg-[#1a1a1a] border-white/20'
                            : 'bg-white border-gray-200'
                          }`}>
                          <div className="max-h-60 overflow-y-auto">
                            {countryCodes.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(country.code);
                                  setIsCountryDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${country.code === countryCode
                                    ? 'bg-[#F8C21C]/10 text-[#F8C21C]'
                                    : isGradient
                                      ? 'text-white hover:bg-white/10'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium">{country.code}</span>
                                <span className="text-xs opacity-70">{country.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative flex-1">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:border-transparent transition-all ${errors.phone
                            ? 'border-red-500'
                            : isGradient
                              ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        onInput={(e) => {
                          (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 10);
                        }}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Field */}
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
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C21C] focus:border-transparent transition-all ${errors.email
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

                {/* Legal Consent */}
                {showLegalLinks && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#F8C21C] border-gray-300 rounded focus:ring-[#F8C21C]"
                      />
                      <label htmlFor="consent" className={`text-xs ${isGradient ? 'text-white/80' : 'text-gray-600'} leading-relaxed`}>
                        I agree to the{' '}
                        <Link href="/terms-conditions" target="_blank" className={`${isGradient ? 'text-[#F8C21C]' : 'text-[#005E60]'} font-medium hover:underline`}>
                          Terms & Conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy-policy" target="_blank" className={`${isGradient ? 'text-[#F8C21C]' : 'text-[#005E60]'} font-medium hover:underline`}>
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.consent && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.consent}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-[#F8C21C] text-[#8B0000] font-bold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
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
                    'Request Callback'
                  )}
                </button>

                {/* Legal Footer Links */}
                {showLegalLinks && (
                  <div className={`text-center pt-2 text-xs ${isGradient ? 'text-white/60' : 'text-gray-400'}`}>
                    <div className="flex justify-center gap-3">
                      <Link href="/terms-conditions" target="_blank" className="hover:underline">Terms & Conditions</Link>
                      <span>•</span>
                      <Link href="/privacy-policy" target="_blank" className="hover:underline">Privacy Policy</Link>
                      <span>•</span>
                      <Link href="/cookie-policy" target="_blank" className="hover:underline">Cookie Policy</Link>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}