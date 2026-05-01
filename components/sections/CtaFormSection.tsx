// @/components/sections/CtaFormSection.tsx
'use client';

export default function CtaFormSection() {
  return (
    <section className="py-12 bg-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Still Searching for the Perfect Property?
            </h2>
            <p className="text-gray-300">Let our experts shortlist the best options for you.</p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option>Budget</option>
                <option>Below 50L</option>
                <option>50L - 1Cr</option>
                <option>1Cr - 2Cr</option>
                <option>2Cr+</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option>Property Type</option>
                <option>Apartment</option>
                <option>Plot</option>
                <option>Villa</option>
              </select>
            </div>
            <button className="w-full mt-4 bg-yellow-500 text-gray-900 py-3 rounded-md font-semibold hover:bg-yellow-600 transition-colors">
              Get Call Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}