// app/contact-us/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  budget: string;
  preferredLocation: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

// ✅ Brand Colors
const COLORS = {
  red: '#8B0000',
  green: '#005E60',
  yellow: '#F8C21C',
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    preferredLocation: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.propertyType) newErrors.propertyType = "Please select property type";
    if (!formData.budget.trim()) newErrors.budget = "Budget range is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", propertyType: "", budget: "", preferredLocation: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#005E60]/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest" style={{ color: COLORS.green }}>Get in Touch</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Find Your Dream Property Today
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you&apos;re buying, selling, or investing, our expert team is here to guide you every step of the way.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Call Us */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)` }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Call Us</h3>
            <a href="tel:+918881188181" className="font-bold hover:underline transition" style={{ color: COLORS.green }}>{'+91 8881188181'}</a>
            <p className="text-sm text-slate-500 mt-1">Tue-Mon 10AM-7PM IST</p>
          </div>

          {/* Email Us */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)` }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Us</h3>
            <a href="mailto:info@associatte.co.in" className="font-bold hover:underline transition" style={{ color: COLORS.green }}>info@associatte.co.in</a>
            <p className="text-sm text-slate-500 mt-1">Response within 24-48 hrs</p>
          </div>

          {/* Visit Us */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)` }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Visit Us</h3>
            <p className="font-bold text-sm leading-relaxed" style={{ color: COLORS.green }}>
              302 & 303, Naren Pearl, 3rd Floor,<br />
              Magarpatta Road, Hadapsar,<br />
              Pune - 411028
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Head Office</span>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)` }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Business Hours</h3>
            <p className="font-bold" style={{ color: COLORS.green }}>10:00 AM - 7:00 PM</p>
            <p className="text-sm text-slate-500 mt-1">Tuesday to Monday</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)` }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.name ? `border-[${COLORS.red}] focus:ring-[${COLORS.red}]/20` : `border-slate-200 focus:ring-[${COLORS.green}]/20 focus:border-[${COLORS.green}]`}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1.5 text-sm" style={{ color: COLORS.red }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.email ? `border-[${COLORS.red}] focus:ring-[${COLORS.red}]/20` : `border-slate-200 focus:ring-[${COLORS.green}]/20 focus:border-[${COLORS.green}]`}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1.5 text-sm" style={{ color: COLORS.red }}>{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.phone ? `border-[${COLORS.red}] focus:ring-[${COLORS.red}]/20` : `border-slate-200 focus:ring-[${COLORS.green}]/20 focus:border-[${COLORS.green}]`}`}
                      placeholder="Enter 10-digit mobile number"
                    />
                    {errors.phone && <p className="mt-1.5 text-sm" style={{ color: COLORS.red }}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-1.5">Property Type *</label>
                    <select
                      id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 focus:outline-none focus:ring-2 transition appearance-none bg-white ${errors.propertyType ? `border-[${COLORS.red}] focus:ring-[${COLORS.red}]/20` : `border-slate-200 focus:ring-[${COLORS.green}]/20 focus:border-[${COLORS.green}]`}`}
                    >
                      <option value="" disabled>Select property type</option>
                      <option value="residential">Residential (Apartment/Villa)</option>
                      <option value="commercial">Commercial (Office/Shop)</option>
                      <option value="plot">Plot/Land</option>
                      <option value="rent">Rental Property</option>
                      <option value="investment">Investment Property</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.propertyType && <p className="mt-1.5 text-sm" style={{ color: COLORS.red }}>{errors.propertyType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1.5">Budget Range *</label>
                    <input
                      type="text" id="budget" name="budget" value={formData.budget} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.budget ? `border-[${COLORS.red}] focus:ring-[${COLORS.red}]/20` : `border-slate-200 focus:ring-[${COLORS.green}]/20 focus:border-[${COLORS.green}]`}`}
                      placeholder="e.g., ₹50L - ₹75L"
                    />
                    {errors.budget && <p className="mt-1.5 text-sm" style={{ color: COLORS.red }}>{errors.budget}</p>}
                  </div>
                  <div>
                    <label htmlFor="preferredLocation" className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Location</label>
                    <input
                      type="text" id="preferredLocation" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] transition"
                      placeholder="e.g., Wakad, Hinjewadi, Baner"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    id="message" name="message" rows={4} value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] transition resize-none"
                    placeholder="Tell us about your requirements, preferred amenities, timeline..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.green}, #004a4d)`,
                      boxShadow: `0 10px 25px -5px ${COLORS.green}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, #004a4d, #003537)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.green}, #004a4d)`;
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                  <p className="text-sm text-slate-500">
                    Our property experts will contact you within 24-48 hours.
                  </p>
                </div>

                {status === "success" && (
                  <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#005E60/10', border: `1px solid ${COLORS.green}30`, color: COLORS.green }}>
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.green }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Inquiry Submitted Successfully!</p>
                      <p className="text-sm mt-1">Thank you for your interest. Our property consultant will reach out to you shortly with personalized recommendations.</p>
                    </div>
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: `${COLORS.red}10`, border: `1px solid ${COLORS.red}30`, color: COLORS.red }}>
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.red }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Submission Failed</p>
                      <p className="text-sm mt-1">Please try again or call us directly at +91 8881188181.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Panel: CTA & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Property Search CTA */}
            <div className="rounded-2xl p-6 sm:p-8 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d, #003537)` }}>
              <h3 className="text-2xl font-bold mb-3">Looking for Properties?</h3>
              <p className="text-white/90 mb-6">
                Browse our verified listings in Pune, Mumbai & KDMC. Get instant access to exclusive deals and pre-launch projects.
              </p>
              <button className="px-6 py-3 font-semibold rounded-xl transition shadow-lg flex items-center gap-2 group" style={{ backgroundColor: COLORS.yellow, color: COLORS.red }}>
                Browse Properties
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-xs text-white/60 mt-4">*100% verified listings • Zero brokerage on select properties</p>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Why Choose Associatte?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-slate-900">Verified Properties</p>
                    <p className="text-sm text-slate-600">Every listing is physically verified with real photos & documents</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-slate-900">Expert Guidance</p>
                    <p className="text-sm text-slate-600">15+ years of real estate expertise at your service</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-slate-900">Transparent Process</p>
                    <p className="text-sm text-slate-600">No hidden charges, complete transparency in every transaction</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-slate-900">End-to-End Support</p>
                    <p className="text-sm text-slate-600">From property search to registration & beyond</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">How do I schedule a site visit?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Simply fill out this form or call us at +91 8881188181. Our team will coordinate with the builder/owner and schedule a convenient time for you to visit the property.
                  </p>
                </div>
                
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Do you charge brokerage fees?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For most properties, we don't charge any brokerage from buyers. We work on a transparent fee structure that will be clearly communicated upfront.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What documents are needed to buy a property?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Typically you'll need ID proof (PAN, Aadhaar), address proof, income documents, and photographs. Our team will guide you through the complete documentation process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}