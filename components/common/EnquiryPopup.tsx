'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  trackingData?: TrackingData;
  onSubmit?: (payload: any) => void;
  showLegalLinks?: boolean;
  formName?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  consent?: string;
}

export default function EnquiryPopup({
  isOpen = false,
  onClose,
  projectName = 'Properties',
  projectTagline = 'Get personalized property recommendations',
  theme = 'default',
  trackingData,
  onSubmit,
  showLegalLinks = true,
  formName = 'Website Enquiry Form'
}: EnquiryPopupProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [clientIp, setClientIp] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91'); // Default India

  // Fetch client IP and country code
  useEffect(() => {
    const fetchIpAndCountry = async () => {
      try {
        // Fetch IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        setClientIp(ipData.ip);

        // Fetch country code based on IP
        const countryResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const countryData = await countryResponse.json();
        if (countryData.country_code) {
          // Map country code to dial code
          const dialCodes: { [key: string]: string } = {
            'IN': '+91', // India
            'US': '+1',  // USA
            'GB': '+44', // UK
            'AE': '+971', // UAE
            'SG': '+65', // Singapore
            'AU': '+61', // Australia
            'CA': '+1',  // Canada
            'DE': '+49', // Germany
            'FR': '+33', // France
            'JP': '+81', // Japan
          };
          setCountryCode(dialCodes[countryData.country_code] || '+91');
        }
      } catch (error) {
        console.error('Failed to fetch IP/country:', error);
        setClientIp('Unknown');
        setCountryCode('+91');
      }
    };

    if (isOpen) {
      fetchIpAndCountry();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation: Name should only contain letters and spaces
  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    return nameRegex.test(name.trim());
  };

  // Validation: Phone should be exactly 10 digits (without country code)
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
    const phone = formData.get('phone') as string; // This should be only 10 digits
    const email = formData.get('email') as string;
    const selectedCountryCode = formData.get('countryCode') as string;

    const newErrors: FormErrors = {};

    // Name validation - only characters
    if (!validateName(name)) {
      newErrors.name = 'Please enter a valid name (only letters and spaces, minimum 2 characters)';
    }

    // Phone validation - exactly 10 digits
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

    // IMPORTANT: Send ONLY the 10-digit phone number
    const cleanPhoneNumber = phone.trim(); // This is already 10 digits from input

    // Create remark with form name, IP address, and country code
    const remark = `${formName} | IP: ${clientIp} | Country Code: ${selectedCountryCode}`;

    // Prepare payload for CRM - phone is sent as plain 10-digit number
    const payload = {
      name: name.trim(),
      phone: cleanPhoneNumber, // ONLY the 10-digit number (e.g., "8228377777")
      email: email || '',
      project: projectName,
      remark: remark
    };

    console.log('📩 Enquiry Submitted to CRM:', {
      name: payload.name,
      mobile: payload.phone, // Will be 10 digits only
      mobileLength: payload.phone.length,
      email: payload.email,
      project: payload.project,
      remark: payload.remark
    });

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // This sends the 10-digit number
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      console.log('✅ Enquiry submitted successfully');
      setSubmitSuccess(true);

      if (onSubmit) {
        onSubmit(payload);
      }

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
  const gradientStyle = isGradient
    ? 'bg-gradient-to-r from-[#8B0000] to-[#005E60]'
    : 'bg-white';

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
            <div className={`${isGradient ? gradientStyle : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
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
                {/* Name Field - Only Characters */}
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
                      placeholder="Enter your full name (letters only)"
                      pattern="[A-Za-z\s]{2,}"
                      title="Only letters and spaces allowed"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${errors.name
                          ? 'border-red-500'
                          : isGradient
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      onInput={(e) => {
                        // Remove any numbers or special characters in real-time
                        e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, '');
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${isGradient ? 'text-white/50' : 'text-gray-400'}`}>
                    Only letters and spaces allowed
                  </p>
                </div>

                {/* Phone Field with Country Code */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isGradient ? 'text-white/90' : 'text-gray-700'}`}>
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative w-24">
                      <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                      <select
                        name="countryCode"
                        defaultValue={countryCode}
                        className={`w-full pl-10 pr-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${isGradient
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                          }`}
                      >
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (USA/Canada)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                        <option value="+65">+65 (Singapore)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+81">+81 (Japan)</option>
                      </select>
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative flex-1">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isGradient ? 'text-white/50' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${errors.phone
                            ? 'border-red-500'
                            : isGradient
                              ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        onInput={(e) => {
                          // Only allow numbers and limit to 10 digits
                          e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10);
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
                  <p className={`text-xs mt-1 ${isGradient ? 'text-white/50' : 'text-gray-400'}`}>
                    Enter 10-digit mobile number (e.g., 9876543210)
                  </p>
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
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all ${errors.email
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
                        className="mt-1 w-4 h-4 text-[#005E60] border-gray-300 rounded focus:ring-[#005E60]"
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