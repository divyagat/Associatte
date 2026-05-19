// client/components/builder-page/HelpSidebar.tsx
'use client';

import { Filter, X, Search, MapPin } from 'lucide-react';

interface HelpSidebarProps {
  searchQuery: string; locationFilter: string;
  availableLocations?: string[]; // ✅ Optional
  onSearchChange: (v: string) => void; onLocationChange: (v: string) => void;
  onApplyFilters: () => void; onClearFilters: () => void;
}

export default function HelpSidebar({
  searchQuery, locationFilter, availableLocations = [], // ✅ Default []
  onSearchChange, onLocationChange, onApplyFilters, onClearFilters,
}: HelpSidebarProps) {
  const hasActive = searchQuery || locationFilter;

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Filter className="w-4 h-4 text-[#005E60]" /> Filters</h3>
            {hasActive && <button onClick={onClearFilters} className="text-xs text-[#8B0000] hover:underline flex gap-1"><X className="w-3 h-3" /> Clear</button>}
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Search Builder</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Builder name..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select value={locationFilter} onChange={e => onLocationChange(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005E60]/20 focus:border-[#005E60] appearance-none bg-white">
                <option value="">All Locations</option>
                {/* ✅ Safe .map() */}
                {availableLocations?.map?.(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>
          <button onClick={onApplyFilters} className="w-full py-2.5 bg-[#005E60] text-white text-sm font-semibold rounded-lg hover:bg-[#004a4d] transition-colors">Apply Filters</button>
        </div>
        <div className="bg-[#005E60]/5 rounded-2xl border border-[#005E60]/20 p-5">
          <h4 className="font-semibold text-[#005E60] mb-3">Quick Stats</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between"><span>Locations:</span><span className="font-medium text-gray-900">{availableLocations?.length || 0}+</span></li>
            <li className="flex justify-between"><span>Areas:</span><span className="font-medium text-gray-900">Pune, Mumbai, KDMC</span></li>
            <li className="flex justify-between"><span>Verified:</span><span className="font-medium text-green-600">✓ All</span></li>
          </ul>
        </div>
        <div className="bg-[#F8C21C]/10 rounded-2xl border border-[#F8C21C]/30 p-5">
          <h4 className="font-semibold text-[#8B0000] mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-4">Can't find your builder? Our experts can help.</p>
          <a href="tel:+918668695995" className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B0000] text-white text-sm font-semibold rounded-lg hover:bg-[#6a0000] transition-colors">📞 Call Now</a>
        </div>
      </div>
    </aside>
  );
}