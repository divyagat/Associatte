"use client";

import { useState, FormEvent, ChangeEvent } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactUsPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
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
      newErrors.email = "Please enter a valid business email";
    }
    if (formData.phone && !/^[+]?[\d\s()-]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.inquiryType) newErrors.inquiryType = "Please select an inquiry type";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // 🔌 Replace with your API route or Server Action
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", inquiryType: "", message: "" });
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-amber-700 uppercase">Commercial Real Estate Partners</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Let&apos;s Build Something Exceptional
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you&apos;re acquiring, leasing, or optimizing your portfolio, our team is ready to provide strategic, data-driven solutions.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Panel: Direct Contacts & Info */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Direct Lines
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-medium text-slate-500">Acquisitions & Investments</p>
                  <a href="tel:+918881188181" className="text-slate-900 hover:text-amber-700 transition font-semibold">+91 8881188181</a>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-medium text-slate-500">Leasing & Tenant Rep</p>
                  <a href="tel:+918881188181" className="text-slate-900 hover:text-amber-700 transition font-semibold">+91 8881188181</a>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-medium text-slate-500">Property Management</p>
                  <a href="tel:+918881188181" className="text-slate-900 hover:text-amber-700 transition font-semibold">+91 8881188181</a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Office Hours
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex justify-between"><span>Tuesday – Sunday</span> <span>10:00 AM – 7:00 PM</span></li>
                {/* <li className="flex justify-between"><span>Saturday</span> <span>9:00 AM – 2:00 PM</span></li> */}
                <li className="flex justify-between"><span>Monday</span> <span>Closed</span></li>
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">After-Hours Emergency</p>
                <a href="tel:+918881188181" className="text-amber-400 hover:text-amber-300 font-medium transition">+91 8881188181</a>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Headquarters</h3>
              <address className="not-italic text-slate-600 space-y-1">
                <p>302 and 303, Naren Pearl, 3rd Floor, Magarpatta Road, Above Axis and IndusInd Bank, Hadapsar</p>
                <p>Pune - 411028</p>
              </address>
              <button className="mt-4 w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition text-sm">
                View on Map
              </button>
            </div>
          </aside>

          {/* Right Panel: Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-amber-500"}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Business Email *</label>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-amber-500"}`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.phone ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-amber-500"}`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1.5">Company / Organization</label>
                    <input
                      type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      placeholder="Acme Holdings LLC"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-700 mb-1.5">Inquiry Type *</label>
                  <select
                    id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 focus:outline-none focus:ring-2 transition appearance-none bg-white ${errors.inquiryType ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-amber-500"}`}
                  >
                    <option value="" disabled>Select an inquiry type</option>
                    <option value="acquisitions">Acquisitions & Dispositions</option>
                    <option value="leasing">Leasing & Tenant Representation</option>
                    <option value="property-management">Property Management</option>
                    <option value="investment">Capital Markets / Investment</option>
                    <option value="valuation">Valuation & Consulting</option>
                    <option value="general">General Inquiry</option>
                  </select>
                  {errors.inquiryType && <p className="mt-1.5 text-sm text-red-600">{errors.inquiryType}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                  <textarea
                    id="message" name="message" rows={5} value={formData.message} onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${errors.message ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-amber-500"}`}
                    placeholder="Please provide details about the property, transaction type, or service you require..."
                  />
                  {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
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
                    We typically respond within 1 business day.
                  </p>
                </div>

                {status === "success" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="font-semibold">Inquiry Received</p>
                      <p className="text-sm mt-1">Thank you for reaching out. A dedicated advisor will contact you shortly.</p>
                    </div>
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="font-semibold">Submission Failed</p>
                      <p className="text-sm mt-1">Please check your connection and try again, or call our direct line.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}