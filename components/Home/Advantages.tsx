export default function Advantages(): JSX.Element {
  const advantages = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16-7.163 16-16 16z" fill="#0E8744"/>
          <path d="M24 14c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#0E8744"/>
          <path d="M22 20h4v8h-4zM20 22h8v4h-8z" fill="#0E8744"/>
          <path d="M16 28l-4 8h24l-4-8H16z" fill="#0E8744" opacity="0.3"/>
        </svg>
      ),
      title: "Bottom Rate Guarantee",
      description: "Housiey guarantees the bottom rate or refunds double the difference.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="#0E8744" strokeWidth="3" fill="none"/>
          <path d="M6 18h36" stroke="#0E8744" strokeWidth="3"/>
          <circle cx="14" cy="14" r="2" fill="#0E8744"/>
          <circle cx="20" cy="14" r="2" fill="#0E8744"/>
          <path d="M32 28l6-6 4 4-10 10-6-6 4-4 2 2z" fill="#0E8744"/>
          <circle cx="38" cy="22" r="6" fill="#0E8744" opacity="0.3"/>
        </svg>
      ),
      title: "Online Site Visit",
      description: "Visit projects from home with Housiey's Online Site Visit concept.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M24 4c-5.523 0-10 4.477-10 10 0 5.523 10 16 10 16s10-10.477 10-16c0-5.523-4.477-10-10-10zm0 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#0E8744"/>
          <circle cx="16" cy="32" r="8" fill="#0E8744" opacity="0.3"/>
          <circle cx="16" cy="32" r="4" fill="#0E8744"/>
          <path d="M24 30v10M20 36h8" stroke="#0E8744" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Free Site Visit",
      description: "Free pickup & drop for unlimited site visits across the city.",
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <circle cx="16" cy="18" r="6" fill="#0E8744"/>
          <circle cx="32" cy="18" r="6" fill="#0E8744"/>
          <path d="M8 40c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8v4H8v-4z" fill="#0E8744" opacity="0.3"/>
          <circle cx="24" cy="10" r="8" stroke="#0E8744" strokeWidth="3" fill="none"/>
          <path d="M24 6v4M24 14v-4M20 10h4M28 10h-4" stroke="#0E8744" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "No Brokerage Charges",
      description: "Get personalized RM managing everything from site visit to booking.",
    },
  ];

  return (
    <section className="py-16 bg-[#1e4d6f]">
      <div className="w-full lg:max-w-[1280px] mx-auto px-4 lg:w-[85%]">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-80">
              <path d="M7 2h6v2H7V2zm0 4h6v2H7V6zm0 4h6v2H7v-2zm0 4h6v2H7v-2z" fill="currentColor"/>
              <path d="M3 2h2v16H3V2zm12 0h2v16h-2V2z" fill="currentColor"/>
            </svg>
            <span className="text-white font-semibold text-sm tracking-wide uppercase opacity-90">
              ADVANTAGES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-white mb-3">
            Why Choose Us?
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl">
            Discover the key advantages of investing with us.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Standard Advantage Cards */}
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="mb-4">{advantage.icon}</div>
              <h3 className="text-lg font-bold text-[#234E70] mb-2 font-montserrat">
                {advantage.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {advantage.description}
              </p>
            </div>
          ))}

          {/* Special Green Card - Brokerage Saved */}
          <div className="bg-gradient-to-br from-[#0E8744] to-[#1e7a5a] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Wallet Icon */}
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white">
                  <rect x="6" y="14" width="36" height="22" rx="3" stroke="white" strokeWidth="3" fill="none"/>
                  <path d="M30 24h12v8H30z" fill="white" opacity="0.3"/>
                  <circle cx="36" cy="28" r="2" fill="white"/>
                  <path d="M6 18h36" stroke="white" strokeWidth="3"/>
                  <path d="M14 10h20v4H14z" fill="white" opacity="0.3"/>
                </svg>
              </div>
              
              {/* Stats */}
              <div className="mb-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white font-montserrat mb-1">
                  375Cr+
                </h3>
                <p className="text-white/90 font-semibold text-base">
                  Brokerage Saved Till Now
                </p>
              </div>

              {/* Person Image Placeholder */}
              <div className="mt-auto -mx-2 -mb-2">
                <div className="relative">
                  <img
                    src="/assets/image/advantage-person.webp"
                    alt="Housiey representative"
                    className="w-full h-40 object-cover object-top rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E8744] to-transparent opacity-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}