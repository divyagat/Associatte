// @/components/Home/HeroSection.tsx
'use client';

import { useRouter } from 'next/navigation';

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
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all ${
            activeTab === tab.id
              ? 'text-white border-b-2 border-purple-400 bg-white/10'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}