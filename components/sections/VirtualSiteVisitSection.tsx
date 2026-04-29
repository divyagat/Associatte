'use client';

export default function VirtualSiteVisitSection(): JSX.Element {
  const steps = [
    { title: '360° Location Tour', desc: 'Explore the project\'s actual surroundings.' },
    { title: 'Sample Flat Video', desc: 'Experience your future home virtually.' },
    { title: 'Plans & Amenities', desc: 'Check Floor/Unit Plans, Brochure & Amenities.' },
    { title: 'Pricing & Payments', desc: 'View all-inclusive pricing, down payment & EMI details.' },
    { title: 'Pros & Cons Analysis', desc: 'Evaluate & make an informed decision with Pros & Cons.' },
    { title: 'Now Book Providing No.', desc: 'Our executive will contact you for further information.' },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-[#8B0000] tracking-tight mb-4">
              Housiey Online Site Visit - <br className="hidden lg:block" /> 6 Simple Steps
            </h2>
            <p className="text-gray-500 text-lg">
              Experience properties from the comfort of your home.
            </p>
          </div>
          
          {/* Elegant Badge */}
          <div className="flex items-center gap-3 bg-[#F8F9FA] px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F8C21C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005E60]"></span>
            </span>
            <span className="text-[#005E60] font-semibold text-sm uppercase tracking-wide">
              Live Feature
            </span>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Illustration */}
          <div className="flex justify-center lg:sticky lg:top-24">
            <div className="relative w-full max-w-md">
              {/* Soft Background Blob (Yellow tint, very subtle) */}
              <div className="absolute inset-0 bg-[#F8C21C]/10 blur-[60px] rounded-full transform -translate-x-4 translate-y-4"></div>
              
              <div className="relative bg-[#F8F9FA] rounded-3xl p-8 border border-gray-100 shadow-sm">
                <svg viewBox="0 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-lg">
                  {/* Background Elements */}
                  <rect x="20" y="40" width="260" height="170" rx="12" fill="white" />
                  <rect x="20" y="40" width="260" height="170" rx="12" stroke="#E2E8F0" strokeWidth="2" />
                  
                  {/* Window Header */}
                  <rect x="20" y="40" width="260" height="40" rx="12" fill="#F1F5F9" />
                  <rect x="20" y="68" width="260" height="12" fill="#F1F5F9" /> 
                  <circle cx="45" cy="60" r="6" fill="#EF4444" />
                  <circle cx="65" cy="60" r="6" fill="#F8C21C" />
                  <circle cx="85" cy="60" r="6" fill="#10B981" />
                  
                  {/* Person */}
                  <circle cx="150" cy="130" r="30" fill="#005E60" />
                  <path d="M100 210c0-27 22.386-50 50-50s50 23 50 50v10H100v-10z" fill="#8B0000" />
                  
                  {/* Laptop */}
                  <rect x="90" y="150" width="120" height="70" rx="4" fill="#334155" />
                  <rect x="95" y="155" width="110" height="55" rx="2" fill="#E2E8F0" /> {/* Grey Screen (No more harsh yellow) */}
                  <rect x="80" y="218" width="140" height="8" rx="4" fill="#475569" />
                  
                  {/* Video Play Button on Screen */}
                  <circle cx="150" cy="182" r="12" fill="#005E60" opacity="0.9" />
                  <path d="M147 177l10 5-10 5V177z" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side: Steps List */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="relative flex items-start gap-6 pb-8 last:pb-0 group">
                
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-12 w-px h-full bg-[#E2E8F0] group-hover:bg-[#005E60]/20 transition-colors duration-300"></div>
                )}

                {/* Step Icon */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-[#005E60] flex items-center justify-center shadow-sm group-hover:bg-[#005E60] group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 text-[#005E60] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {i === 0 && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                    {i === 1 && <polygon points="5 3 19 12 5 21 5 3" />}
                    {i === 2 && <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />}
                    {i === 3 && <path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
                    {i === 4 && <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />}
                    {i === 5 && <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />}
                  </svg>
                </div>

                {/* Step Content */}
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-[#8B0000] mb-1 font-montserrat group-hover:translate-x-1 transition-transform duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}