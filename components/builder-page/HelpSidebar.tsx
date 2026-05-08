'use client';

import { useState } from 'react';

export default function HelpSidebar() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8 border-t-4 border-[#8B0000]">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Need Help?</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">Get free expert consultation</p>

      <form className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent"
            required
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">+91</span>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent"
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005E60] focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#8B0000] text-white py-3 rounded font-bold hover:bg-[#8B0000]/90 transition-all"
        >
          Enquire Now
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-[#005E60]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-[#005E60]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Trusted</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Or call us at</p>
        <a href="tel:+918743563546" className="text-[#F8C21C] font-bold text-lg hover:text-[#8B0000] transition-colors">
          +91 87435 63546
        </a>
      </div>
    </div>
  );
}