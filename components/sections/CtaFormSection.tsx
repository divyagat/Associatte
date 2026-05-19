'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight, Shield, Clock, Users } from 'lucide-react';

// ✅ ADD PROPER PROPS INTERFACE
interface CtaFormSectionProps {
  city: 'Pune' | 'Mumbai' | 'KDMC';
  title: string;
  subtitle: string;
  buttonText: string;
  formId?: string;
}

export default function CtaFormSection({ city, title, subtitle, buttonText, formId = 'cta-form' }: CtaFormSectionProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', budget: '', propertyType: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const COLORS = { primary: '#005E60', accent: '#F8C21C', alert: '#8B0000', bgDark: '#003d40' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', budget: '', propertyType: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <section className="py-16 bg-gradient-to-br from-[#003d40] via-[#005E60] to-[#004a4d] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F8C21C]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8B0000]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white">
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

            <motion.div variants={containerVariants} className="grid grid-cols-3 gap-4 mb-8">
              {[{ icon: Shield, label: 'RERA Verified', desc: '100% Legal' }, { icon: Clock, label: 'Quick Response', desc: 'Within 24 hrs' }, { icon: Users, label: '5000+ Happy', desc: 'Clients Served' }].map((item, index) => (
                <motion.div key={item.label} variants={itemVariants} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <item.icon className="w-6 h-6 text-[#F8C21C] mx-auto mb-2" />
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-gray-300">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-3">
              {[{ icon: Phone, label: 'Call Us', value: '+91 87435 63546', href: 'tel:+918743563546' }, { icon: Mail, label: 'Email', value: '8743563546@noemail.paradise.com', href: 'mailto:8743563546@noemail.paradise.com' }, { icon: MapPin, label: 'Visit', value: `${city} Offices`, href: '/contact' }].map((item, index) => (
                <motion.a key={item.label} variants={itemVariants} href={item.href} className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors group">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#F8C21C] transition-colors">
                    <item.icon className="w-5 h-5 text-[#F8C21C] group-hover:text-[#005E60] transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-[#005E60] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You! 🎉</h3>
                  <p className="text-gray-600">Our expert will call you within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Get Your Free Consultation</h3>
                    <p className="text-gray-500 text-sm">Fill the form & we&apos;ll contact you shortly</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" pattern="[0-9]{10}" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                        <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white appearance-none">
                          <option value="">Select Budget</option>
                          <option value="<50L">Below ₹50 Lakh</option>
                          <option value="50L-1Cr">₹50 Lakh - ₹1 Cr</option>
                          <option value="1Cr-2Cr">₹1 Cr - ₹2 Cr</option>
                          <option value="2Cr+">Above ₹2 Cr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white appearance-none">
                          <option value="">Select Type</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Villa</option>
                          <option value="plot">Plot</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us about your preferences (location, BHK, amenities...)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent transition-all bg-gray-50 hover:bg-white resize-none" />
                    </div>
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F8C21C] hover:bg-[#e6b418] text-[#005E60] shadow-lg hover:shadow-xl'}`}>
                      {isSubmitting ? (<> <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Sending... </>) : (<> Get Free Callback <ArrowRight className="w-5 h-5" /> </>)}
                    </motion.button>
                    <p className="text-xs text-gray-400 text-center">By submitting, you agree to our <a href="/privacy" className="text-[#005E60] hover:underline">Privacy Policy</a>. We&apos;ll never share your data.</p>
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