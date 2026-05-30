'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight, Shield, Clock, Users } from 'lucide-react';

interface CtaFormSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
  title: string;
  subtitle: string;
  buttonText: string;
  formId?: string;
}

const OFFICE_ADDRESS = "Associatte PropTech Pvt Ltd, 303 Naren Pearl, Magarpatta Road, Hadapsar, Pune, Maharashtra 411028";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`;

const CITY_DISPLAY_NAMES: Record<'Pune' | 'Mumbai' | 'KDMC', string> = {
  'Pune': 'Pune Office',
  'Mumbai': 'Mumbai Office',
  'KDMC': 'Kalyan-Dombivli Office'
};

export default function CtaFormSection({ city, title, subtitle, buttonText, formId = 'cta-form' }: CtaFormSectionProps) {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    budget: '', 
    propertyType: '', 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clientIp, setClientIp] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

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
    fetchIp();
  }, []);

  const COLORS = { primary: '#005E60', accent: '#F8C21C', alert: '#8B0000', bgDark: '#003d40' };

  // Validation functions
  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    return nameRegex.test(name.trim());
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; phone?: string } = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (only letters, min 2 characters)';
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    // Prepare message with all form data
    const fullMessage = `Budget: ${formData.budget || 'Not specified'} | Property Type: ${formData.propertyType || 'Not specified'} | Requirements: ${formData.message || 'None'} | Source: CTA Form - ${city}`;
    
    // Create remark with form name, IP address, and source
    const remark = `CTA Form - ${city} | IP: ${clientIp} | Budget: ${formData.budget} | Property: ${formData.propertyType}`;
    
    // Prepare payload for CRM (matching your EnquiryPopup format)
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: '', // Email not collected in this form
      project: title || 'Property Consultation',
      remark: remark
    };
    
    console.log('📩 CTA Form Submitted to CRM:', payload);
    
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
      
      console.log('✅ CTA Form submitted successfully');
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', phone: '', budget: '', propertyType: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting CTA form:', error);
      alert('Failed to submit. Please try again or call us directly at +91 8881188181');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Real-time validation for phone
    if (name === 'phone') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } 
    // Real-time validation for name (only letters and spaces)
    else if (name === 'name') {
      const cleaned = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const containerVariants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } 
  };

  const contactItems = [
    { 
      icon: Phone, 
      label: 'Call Us', 
      value: '+91 8881188181', 
      href: 'tel:+918881188181',
      external: false 
    }, 
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'info@associatte.com', 
      href: 'mailto:info@associatte.com',
      external: false 
    }, 
    { 
      icon: MapPin, 
      label: 'Visit Office', 
      value: CITY_DISPLAY_NAMES[city], 
      href: GOOGLE_MAPS_URL,
      external: true 
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#003d40] via-[#005E60] to-[#004a4d] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8B0000]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            className="text-white"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8C21C]/20 border border-[#F8C21C]/30 rounded-full text-[#F8C21C] text-sm font-medium mb-6">
                <CheckCircle2 size={16} /> Free Expert Consultation
              </span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Find Your Dream Home in {city} with <span className="text-[#F8C21C]">Expert Guidance</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-gray-200 text-lg mb-8 leading-relaxed">
              Let our property experts shortlist the best options tailored to your needs. Get personalized recommendations within 24 hours.
            </motion.p>

            {/* Trust Badges */}
            <motion.div variants={containerVariants} className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Shield, label: 'RERA Verified', desc: '100% Legal' }, 
                { icon: Clock, label: 'Quick Response', desc: 'Within 24 hrs' }, 
                { icon: Users, label: '5000+ Happy', desc: 'Clients Served' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label} 
                  variants={itemVariants} 
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-[#F8C21C] mx-auto mb-2" />
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-gray-300">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={containerVariants} className="space-y-3">
              {contactItems.map((item) => (
                <motion.a 
                  key={item.label} 
                  variants={itemVariants} 
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#F8C21C] transition-colors">
                    <item.icon className="w-5 h-5 text-[#F8C21C] group-hover:text-[#005E60] transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                  {item.external && (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors ml-auto opacity-0 group-hover:opacity-100" />
                  )}
                </motion.a>
              ))}
            </motion.div>

            {/* Office Address Preview */}
            <motion.div variants={itemVariants} className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F8C21C] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Our Office</p>
                  <p className="text-xs text-gray-300 mt-1">{OFFICE_ADDRESS}</p>
                  <a 
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-[#F8C21C] hover:text-[#ffd74d] transition-colors"
                  >
                    Open in Google Maps <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              {isSubmitted ? (
                // Success State
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-[#005E60] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You! 🎉</h3>
                  <p className="text-gray-600">Our expert will call you within 24 hours.</p>
                  <p className="text-sm text-gray-400 mt-2">Check your phone for our call from +91 8881188181</p>
                </motion.div>
              ) : (
                // Form State
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Get Your Free Consultation</h3>
                    <p className="text-gray-500 text-sm">Fill the form & we'll contact you shortly</p>
                  </div>
                  
                  <form id={formId} onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                          placeholder="Enter your name" 
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`} 
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          required 
                          placeholder="9876543210" 
                          maxLength={10}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`} 
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Budget & Property Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                        <select 
                          name="budget" 
                          value={formData.budget} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Budget</option>
                          <option value="Below ₹50 Lakh">&lt; ₹50 Lakh</option>
                          <option value="₹50 Lakh - ₹1 Cr">₹50 Lakh - ₹1 Cr</option>
                          <option value="₹1 Cr - ₹2 Cr">₹1 Cr - ₹2 Cr</option>
                          <option value="Above ₹2 Cr">Above ₹2 Cr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select 
                          name="propertyType" 
                          value={formData.propertyType} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Type</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Plot">Plot</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        rows={3} 
                        placeholder="Tell us about your preferences (location, BHK, amenities...)" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white resize-none" 
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <motion.button 
                      type="submit" 
                      disabled={isSubmitting} 
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }} 
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }} 
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[#F8C21C] hover:bg-[#e6b418] text-[#005E60] shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <> 
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg> 
                          Sending... 
                        </>
                      ) : (
                        <> 
                          Get Free Callback <ArrowRight className="w-5 h-5" /> 
                        </>
                      )}
                    </motion.button>
                    
                    {/* Privacy Note */}
                    <p className="text-xs text-gray-400 text-center">
                      By submitting, you agree to our <a href="/privacy-policy" className="text-[#005E60] hover:underline">Privacy Policy</a>. 
                      We'll never share your data.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}