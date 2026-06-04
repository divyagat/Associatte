import VirtualSiteVisitSection from "../sections/VirtualSiteVisitSection";


export default function Advantages()  {
  const advantages = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16-7.163 16-16 16z" fill="#005E60" />
          <path d="M24 14c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#005E60" />
          <path d="M22 20h4v8h-4zM20 22h8v4h-8z" fill="#005E60" />
          <path d="M16 28l-4 8h24l-4-8H16z" fill="#005E60" opacity="0.2" />
        </svg>
      ),
      title: "Bottom Rate Guarantee",
      description: "Housiey guarantees the bottom rate or refunds double the difference.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="#005E60" strokeWidth="3" fill="none" />
          <path d="M6 18h36" stroke="#005E60" strokeWidth="3" />
          <circle cx="14" cy="14" r="2" fill="#005E60" />
          <circle cx="20" cy="14" r="2" fill="#005E60" />
          <path d="M32 28l6-6 4 4-10 10-6-6 4-4 2 2z" fill="#005E60" />
          <circle cx="38" cy="22" r="6" fill="#005E60" opacity="0.2" />
        </svg>
      ),
      title: "Online Site Visit",
      description: "Visit projects from home with Housiey's Online Site Visit concept.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M24 4c-5.523 0-10 4.477-10 10 0 5.523 10 16 10 16s10-10.477 10-16c0-5.523-4.477-10-10-10zm0 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#005E60" />
          <circle cx="16" cy="32" r="8" fill="#005E60" opacity="0.2" />
          <circle cx="16" cy="32" r="4" fill="#005E60" />
          <path d="M24 30v10M20 36h8" stroke="#005E60" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Free Site Visit",
      description: "Free pickup & drop for unlimited site visits across the city.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <circle cx="16" cy="18" r="6" fill="#005E60" />
          <circle cx="32" cy="18" r="6" fill="#005E60" />
          <path d="M8 40c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8v4H8v-4z" fill="#005E60" opacity="0.2" />
          <circle cx="24" cy="10" r="8" stroke="#005E60" strokeWidth="3" fill="none" />
          <path d="M24 6v4M24 14v-4M20 10h4M28 10h-4" stroke="#005E60" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "No Brokerage Charges",
      description: "Get personalized RM managing everything from site visit to booking.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">

        {/* Section Header - Centered, Clean */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8C21C]/10 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#8B0000]"></span>
            <span className="text-[#8B0000] font-semibold text-sm tracking-wide uppercase">
              Why Choose Us
            </span>
          </div>
          <h2 className="section-title text-[#8B0000] mb-4">
            Advantages of Investing With Us
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            We make your property journey seamless, transparent, and rewarding.
          </p>

          {/* Decorative divider */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent to-[#F8C21C]"></div>
            <div className="w-2 h-2 rounded-full bg-[#005E60]"></div>
            <div className="h-1 w-16 bg-gradient-to-l from-transparent to-[#F8C21C]"></div>
          </div>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

          {/* Standard Advantage Cards */}
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 hover:border-[#005E60]/30"
            >
              {/* Icon with subtle hover scale */}
              <div className="mb-5 transform group-hover:scale-105 transition-transform duration-300">
                {advantage.icon}
              </div>

              <h3 className="text-lg font-bold text-[#8B0000] mb-3 font-montserrat">
                {advantage.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {advantage.description}
              </p>

              {/* Subtle bottom accent on hover */}
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-[#F8C21C] rounded-full transition-all duration-300"></div>
            </div>
          ))}

          {/* Special Highlight Card - Brokerage Saved */}
          <div className="group bg-gradient-to-br from-[#005E60] to-[#004a4c] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden border border-[#005E60]/20">

            {/* Subtle background pattern */}
            <div className="absolute -top-10 -right-10 w-40 h-40 opacity-5">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <path d="M50 0L100 50L50 100L0 50Z" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon */}
              <div className="mb-5">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#F8C21C]">
                  <rect x="6" y="14" width="36" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <path d="M30 24h12v8H30z" fill="currentColor" opacity="0.2" />
                  <circle cx="36" cy="28" r="2.5" fill="currentColor" />
                  <path d="M6 18h36" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Stats - Prominent */}
              <div className="mb-5">
                <h3 className="text-3xl md:text-4xl font-bold text-white font-montserrat mb-1">
                  ₹375Cr+
                </h3>
                <p className="text-[#F8C21C] font-semibold text-sm uppercase tracking-wide">
                  Brokerage Saved
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/20 my-4"></div>

              {/* Supporting text */}
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                Our zero-brokerage model has saved customers crores in hidden fees.
              </p>

              {/* Person Image */}
              <div className="mt-auto">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src="/assets/image/advantage-person.webp"
                    alt="Happy customer"
                    className="w-full h-32 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004a4c] to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Subtle corner accent */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#F8C21C]/10 rounded-tl-full"></div>
          </div>

        </div>
      </div>


      <VirtualSiteVisitSection />


    </section>
  );
}