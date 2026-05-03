// Handle tab click → navigate to respective route
const handleTabChange = (tabId: string) => {
  setActiveTab(tabId as TabType);
  
  // Navigate to corresponding page with smooth transition
  const routeMap: Record<string, string> = {
    buy: '/buy',
    rent: '/rent', 
    commercial: '/commercial',
    pg: '/pg',
    plots: '/plots'
  };
  
  router.push(routeMap[tabId] || '/buy');
};

// In your tabs rendering:
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