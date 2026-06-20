"use client";

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CountryCodeSelect from "@/components/common/CountryCodeSelect";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Send,
  Home,
  Briefcase,
  Mountain,
  Key,
  TrendingUp,
  Star,
  Shield,
  Users,
  FileCheck,
  Sparkles,
  ArrowRight,
  Navigation,
  X
} from "lucide-react";

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

// Brand Colors
const COLORS = {
  red: '#8B0000',
  green: '#005E60',
  yellow: '#F8C21C',
};

// Budget Ranges
const BUDGET_RANGES = [
  { value: "Below ₹30 Lakh", label: "Below ₹30 Lakh" },
  { value: "₹30 Lakh - ₹50 Lakh", label: "₹30 Lakh - ₹50 Lakh" },
  { value: "₹50 Lakh - ₹75 Lakh", label: "₹50 Lakh - ₹75 Lakh" },
  { value: "₹75 Lakh - ₹1 Cr", label: "₹75 Lakh - ₹1 Cr" },
  { value: "₹1 Cr - ₹1.5 Cr", label: "₹1 Cr - ₹1.5 Cr" },
  { value: "₹1.5 Cr - ₹2 Cr", label: "₹1.5 Cr - ₹2 Cr" },
  { value: "₹2 Cr - ₹2.5 Cr", label: "₹2 Cr - ₹2.5 Cr" },
  { value: "₹2.5 Cr - ₹3 Cr", label: "₹2.5 Cr - ₹3 Cr" },
  { value: "₹3 Cr - ₹4 Cr", label: "₹3 Cr - ₹4 Cr" },
  { value: "₹4 Cr - ₹5 Cr", label: "₹4 Cr - ₹5 Cr" },
  { value: "Above ₹5 Cr", label: "Above ₹5 Cr" },
  { value: "Not Specified", label: "Not Specified" },
];

// Predefined locations
const POPULAR_LOCATIONS = [
  "Wakad", "Hinjewadi", "Baner", "Balewadi", "Kharadi", 
  "Viman Nagar", "Hadapsar", "Magarpatta", "Koregaon Park", 
  "Andheri", "Powai", "Thane", "Dombivli", "Kalyan"
];

const PROPERTY_TYPES = [
  { value: "residential", label: "Residential Apartment", icon: Home },
  { value: "villa", label: "Villa / Bungalow", icon: Mountain },
  { value: "commercial", label: "Commercial Space", icon: Briefcase },
  { value: "plot", label: "Plot / Land", icon: Building2 },
  { value: "rent", label: "Rental Property", icon: Key },
  { value: "investment", label: "Investment Property", icon: TrendingUp },
];

const OFFICE_ADDRESS = "Associatte PropTech Pvt Ltd, 303, Naren Pearl, Magarpatta Rd, above Axis Bank, Hadapsar, Pune, Maharashtra 411036";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Associatte PropTech Pvt Ltd 303 Naren Pearl Magarpatta Road Hadapsar Pune")}`;

export default function ContactUsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    preferredLocation: "",
    message: "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [clientIp, setClientIp] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Real-time validation for phone
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } 
    // Real-time validation for name (only letters and spaces)
    else if (name === "name") {
      const cleaned = value.replace(/[^A-Za-z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "preferredLocation" && value.length > 1) {
      const filtered = POPULAR_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
      setShowLocationSuggestions(true);
    } else if (name === "preferredLocation" && value.length === 0) {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setFormData(prev => ({ ...prev, preferredLocation: location }));
    setShowLocationSuggestions(false);
    if (errors.preferredLocation) {
      setErrors(prev => ({ ...prev, preferredLocation: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation - only letters and spaces
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = "Please enter a valid name (only letters and spaces)";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Phone validation - exactly 10 digits starting with 6-9
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number (starts with 6-9)";
    }
    
    if (!formData.propertyType) newErrors.propertyType = "Please select property type";
    if (!formData.budget) newErrors.budget = "Please select budget range";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus("idle");

    // Create remark for CRM
    const remark = `Contact Us Form | IP: ${clientIp} | Country Code: ${countryCode} | Property Type: ${formData.propertyType} | Budget: ${formData.budget} | Location: ${formData.preferredLocation || 'Not specified'} | Message: ${formData.message || 'None'}`;

    // Prepare payload for CRM
    const payload = {
      name: formData.name.trim(),
      countryCode,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      project: "Contact Us Inquiry",
      remark: remark
    };
    
    console.log('📩 Contact Form Submitted to CRM:', payload);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setFormData({ 
          name: "", email: "", phone: "", propertyType: "", 
          budget: "", preferredLocation: "", message: "" 
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { 
      icon: Phone, 
      title: "Call Us", 
      detail: "+91 8881188181", 
      sub: "Tue-Mon 10AM-7PM IST",
      action: () => window.location.href = "tel:+918881188181",
      gradient: "from-emerald-600 to-teal-700"
    },
    { 
      icon: Mail, 
      title: "Email Us", 
      detail: "info@associatte.com", 
      sub: "Response within 24-48 hrs",
      action: () => window.location.href = "mailto:info@associatte.com",
      gradient: "from-blue-600 to-indigo-700"
    },
    { 
      icon: MapPin, 
      title: "Visit Us", 
      detail: "Hadapsar, Pune", 
      sub: "Get directions on map",
      action: () => window.open(MAPS_URL, "_blank"),
      gradient: "from-amber-600 to-orange-700"
    },
    { 
      icon: Clock, 
      title: "Business Hours", 
      detail: "10:00 AM - 7:00 PM", 
      sub: "Tuesday to Monday",
      action: null,
      gradient: "from-purple-600 to-pink-700"
    },
  ];

  const faqs = [
    {
      q: "How do I schedule a site visit?",
      a: "Simply fill out the form or call us at +91 8881188181. Our team will coordinate with the builder and schedule a convenient time for you to visit the property.",
    },
    {
      q: "Do you charge brokerage fees?",
      a: "For most properties, we don't charge any brokerage from buyers. We work on a transparent fee structure that will be clearly communicated upfront.",
    },
    {
      q: "What documents are needed to buy a property?",
      a: "Typically you'll need ID proof (PAN, Aadhaar), address proof, income documents, and photographs. Our team will guide you through the complete documentation process.",
    },
    {
      q: "Do you offer property management services?",
      a: "Yes! We provide end-to-end property management including tenant finding, rent collection, maintenance, and legal compliance for property owners.",
    },
  ];

  const benefits = [
    { icon: Shield, title: "Verified Properties", desc: "Every listing physically verified with real photos & documents" },
    { icon: Users, title: "Expert Guidance", desc: "25+ years of real estate expertise at your service" },
    { icon: FileCheck, title: "Transparent Process", desc: "No hidden charges, complete transparency in every transaction" },
    { icon: Sparkles, title: "End-to-End Support", desc: "From property search to registration & beyond" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#101C2E] border-b border-slate-100">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#005E60]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#F8C21C]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
              <span className="text-xs sm:text-sm font-medium text-[#F8C21C]">Get in Touch</span>
            </div>
            <h1 className="page-title text-white mb-4 sm:mb-6">
              Find Your{' '}
              <span className="accent relative inline-block">
                Dream Property
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                  <path d="M0 3L200 3" stroke={COLORS.yellow} strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4">
              Whether you&apos;re buying, selling, or investing, our expert team is here to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Contact Cards - Fully Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {contactMethods.map((method, idx) => (
            <button
              key={idx}
              onClick={method.action || undefined}
              className={`group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-slate-100 ${method.action ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.yellow})` }} />
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg bg-gradient-to-br ${method.gradient}`}>
                <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">{method.title}</h3>
              <p className="font-bold text-base sm:text-lg" style={{ color: COLORS.green }}>{method.detail}</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{method.sub}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
          
          {/* Contact Form - Left Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-5 sm:p-6 lg:p-8 shadow-xl shadow-slate-100/50">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#005E60] to-[#004a4d] shadow-lg">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Fill in the details below and we'll get back to you</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6" noValidate>
                {/* Name & Email - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-sm sm:text-base ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#005E60]/20 focus:border-[#005E60]'}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-sm sm:text-base ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#005E60]/20 focus:border-[#005E60]'}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.email}</p>}
                  </div>
                </div>

                {/* Phone & Property Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                      <input
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className={`flex-1 w-full px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-sm sm:text-base ${errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#005E60]/20 focus:border-[#005E60]'}`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.phone}</p>}
                    <p className="text-xs text-slate-400 mt-1">Enter 10-digit mobile number</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Property Type <span className="text-red-500">*</span></label>
                    <select
                      name="propertyType" value={formData.propertyType} onChange={handleChange}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.propertyType ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#005E60]/20 focus:border-[#005E60]'}`}
                    >
                      <option value="" disabled>Select property type</option>
                      {PROPERTY_TYPES.map(type => (
                        <option key={type.value} value={type.label}>{type.label}</option>
                      ))}
                    </select>
                    {errors.propertyType && <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.propertyType}</p>}
                  </div>
                </div>

                {/* Budget Range & Preferred Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget Range <span className="text-red-500">*</span></label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base ${errors.budget ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#005E60]/20 focus:border-[#005E60]'}`}
                    >
                      <option value="" disabled>Select Budget Range</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    {errors.budget && <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.budget}</p>}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Location</label>
                    <input
                      ref={locationInputRef}
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] focus:bg-white transition-all duration-200 text-sm sm:text-base"
                      placeholder="e.g., Wakad, Hinjewadi, Baner"
                      onFocus={() => formData.preferredLocation.length > 1 && setShowLocationSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    />
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        {locationSuggestions.map((loc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectLocation(loc)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                          >
                            <MapPin size={14} style={{ color: COLORS.green }} />
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <textarea
                    name="message" rows={4} value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] focus:bg-white transition-all duration-200 resize-none text-sm sm:text-base"
                    placeholder="Tell us about your requirements, preferred amenities, timeline..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: '#005F5F' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="p-3 sm:p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ backgroundColor: '#005E60/10', border: `1px solid ${COLORS.green}30` }}>
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: COLORS.green }} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: COLORS.green }}>Inquiry Submitted Successfully!</p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Thank you for your interest. Our property consultant will reach out to you shortly.</p>
                    </div>
                  </div>
                )}
                {status === "error" && (
                  <div className="p-3 sm:p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ backgroundColor: '#8B0000/10', border: `1px solid ${COLORS.red}30` }}>
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: COLORS.red }} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: COLORS.red }}>Submission Failed</p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Please try again or call us directly at +91 8881188181.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Panel - Fully Responsive */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            
            {/* Property Search CTA */}
            <button 
              onClick={() => router.push("/properties")}
              className="group relative w-full rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.02] text-left overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${COLORS.green}, #004a4d, #003537)` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium tracking-wider bg-white/20 px-2 sm:px-3 py-1 rounded-full">Limited Time</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Looking for Properties?</h3>
                <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Browse our verified listings in Pune, Mumbai & KDMC. Get instant access to exclusive deals and pre-launch projects.
                </p>
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-xl bg-[#F8C21C] text-[#8B0000] transition-all duration-300 group-hover:gap-3 group-hover:shadow-lg text-sm sm:text-base">
                  Browse Properties
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-white/50 mt-3 sm:mt-4">*100% verified listings • Zero brokerage on select properties</p>
              </div>
            </button>

            {/* Map Card - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 sm:p-5 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.green }} />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Our Location</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">303, Naren Pearl, Magarpatta Rd, above Axis Bank, Hadapsar, Pune</p>
              </div>
              <div className="h-48 sm:h-52 w-full mt-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.676517088379!2d73.926046!3d18.504167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1e8a5d8f2d7%3A0x8e5d4f3e7c6b8a9f!2sAssociatte%20PropTech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Associatte PropTech Office Location"
                ></iframe>
              </div>
              <button
                onClick={() => window.open(MAPS_URL, "_blank")}
                className="w-full py-3 text-center text-xs sm:text-sm font-medium transition-all border-t border-slate-100 hover:bg-slate-50 flex items-center justify-center gap-2"
                style={{ color: COLORS.green }}
              >
                <MapPin size={14} />
                Open in Google Maps
              </button>
            </div>

            {/* Why Choose Us - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.yellow, fill: COLORS.yellow }} />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Why Choose Associatte?</h3>
              </div>
              <div className="space-y-4 sm:space-y-5">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#005E60]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS.green }} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">{benefit.title}</p>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ - Responsive */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F8C21C]/20 flex items-center justify-center">
                  <span className="text-base sm:text-lg font-bold" style={{ color: COLORS.red }}>?</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full py-3 sm:py-4 flex items-center justify-between text-left font-medium text-slate-900 hover:text-[#005E60] transition-colors text-sm sm:text-base"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-32 pb-3 sm:pb-4' : 'max-h-0'}`}>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pr-2 sm:pr-4">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}