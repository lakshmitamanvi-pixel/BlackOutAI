import React from 'react';
import { Home, Refrigerator, Map, ShieldAlert } from 'lucide-react';

export default function TabBar({ activeTab, setActiveTab, isHouseFault, isGridFault }) {
  const tabs = [
    {
      id: 'verdict',
      label: 'Verdict',
      sublabel: 'Home',
      icon: Home,
      alert: isGridFault ? 'red' : isHouseFault ? 'amber' : null,
    },
    {
      id: 'fridge',
      label: 'Fridge',
      sublabel: 'Safety',
      icon: Refrigerator,
      alert: null,
    },
    {
      id: 'map',
      label: 'Map',
      sublabel: 'DISCOM',
      icon: Map,
      alert: null,
    },
  ];

  return (
    <nav 
      className="w-full max-w-md mx-auto bg-[#0F172A] border-t-2 border-slate-700/80 p-2 sm:p-3 select-none"
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[58px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-slate-800 text-white border-2 border-amber-400/80 shadow-lg glow-amber'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              {/* Alert Badge if active fault */}
              {tab.alert && (
                <span 
                  className={`absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full ${
                    tab.alert === 'red' ? 'bg-red-500 animate-pulse' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              )}

              <Icon className={`w-6 h-6 stroke-[2.5] ${
                isActive ? 'text-amber-400' : 'text-slate-400'
              }`} />
              
              <span className={`text-xs font-mono font-black uppercase tracking-wider mt-1 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

