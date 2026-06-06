// @/components/Home/HeroSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

type TabType = 'buy' | 'rent' | 'commercial' | 'pg' | 'plots';

interface HeroSectionProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function HeroSection({ activeTab, setActiveTab }: HeroSectionProps) {
  const router = useRouter();
  
  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'pg', label: 'PG' },
    { id: 'plots', label: 'Plots' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
    const routeMap: Record<string, string> = {
      buy: '/buy',
      rent: '/rent', 
      commercial: '/commercial',
      pg: '/pg',
      plots: '/plots'
    };
    router.push(routeMap[tabId] || '/buy');
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 shadow-xl">
      {/* 1. FULL BACKGROUND IMAGE */}
      <Image 
        src="/hero-tabs-bg.jpg" 
        alt="Tabs Background" 
        fill 
        sizes="100vw"
        className="object-cover z-0 opacity-30" 
      />
      
      {/* 2. DARK OVERLAY */}
      <div className="absolute inset-0 bg-[#101C2E]/85 z-[1]" />

      {/* 3. TABS CONTENT - Mobile optimized with horizontal scroll */}
      <div className="relative z-10 flex overflow-x-auto gap-2 p-3 sm:p-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex-shrink-0 
              px-4 sm:px-6 py-2.5 sm:py-3 
              text-xs sm:text-sm font-semibold 
              rounded-lg transition-all backdrop-blur-sm 
              ${activeTab === tab.id
                ? 'text-white bg-white/20 border border-white/30 shadow-lg scale-105'
                : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}