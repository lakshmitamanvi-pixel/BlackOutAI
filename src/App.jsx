import React, { useState, useEffect } from 'react';
import VerdictTab from './components/VerdictTab';
import FridgeTab from './components/FridgeTab';
import MapTab from './components/MapTab';
import TabBar from './components/TabBar';
import SafeStepsModal from './components/SafeStepsModal';
import TorchOverlay from './components/TorchOverlay';
import { Flashlight, ShieldAlert, Moon, Radio } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('verdict'); // 'verdict' | 'fridge' | 'map'
  
  // Power & Simulation State
  // Default to Outage Active with 14 neighbours dark (matches hackathon pitch spec!)
  const [isPowerOut, setIsPowerOut] = useState(true);
  const [neighboursDark, setNeighboursDark] = useState(14);
  
  // Modals & Overlays
  const [isSafeStepsOpen, setIsSafeStepsOpen] = useState(false);
  const [isTorchOpen, setIsTorchOpen] = useState(false);

  // Derived states
  const isHouseFault = isPowerOut && neighboursDark === 0;
  const isGridFault = isPowerOut && neighboursDark > 0;

  // Keyboard shortcuts for effortless hackathon demo presentation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (e.target.tagName === 'INPUT') return;

      if (e.key === '1') setActiveTab('verdict');
      if (e.key === '2') setActiveTab('fridge');
      if (e.key === '3') setActiveTab('map');
      if (e.key.toLowerCase() === 't') setIsTorchOpen((prev) => !prev);
      if (e.key.toLowerCase() === 'm') setIsSafeStepsOpen((prev) => !prev);
      if (e.key === 'Escape') {
        setIsSafeStepsOpen(false);
        setIsTorchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* 11 PM PANIC HEADER */}
      <header className="w-full max-w-md mx-auto px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-black">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                BlackOut<span className="text-amber-400">AI</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                11 PM MODE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-wide mt-0.5">
              Pitch-Black Panic Assistant
            </p>
          </div>
        </div>

        {/* Quick Screen Torch Button */}
        <button
          onClick={() => setIsTorchOpen(true)}
          className="min-h-[46px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 flex items-center gap-1.5 transition shadow-sm"
          title="Turn on high-beam white screen"
        >
          <Flashlight className="w-4 h-4 fill-amber-400" />
          <span>Torch</span>
        </button>
      </header>

      {/* MAIN SCREEN AREA (MOBILE VIEWPORT OPTIMIZED) */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col min-h-0">
        {activeTab === 'verdict' && (
          <VerdictTab
            isPowerOut={isPowerOut}
            setIsPowerOut={setIsPowerOut}
            neighboursDark={neighboursDark}
            setNeighboursDark={setNeighboursDark}
            onOpenSafeSteps={() => setIsSafeStepsOpen(true)}
            onOpenTorch={() => setIsTorchOpen(true)}
          />
        )}

        {activeTab === 'fridge' && (
          <FridgeTab />
        )}

        {activeTab === 'map' && (
          <MapTab
            isPowerOut={isPowerOut}
            neighboursDark={neighboursDark}
            setNeighboursDark={setNeighboursDark}
            setIsPowerOut={setIsPowerOut}
          />
        )}
      </main>

      {/* SEAMLESS 3-TAB BOTTOM NAVIGATION */}
      <footer className="w-full shrink-0">
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isHouseFault={isHouseFault}
          isGridFault={isGridFault}
        />
      </footer>

      {/* 1-TAP SAFE STEPS MODAL */}
      <SafeStepsModal
        isOpen={isSafeStepsOpen}
        onClose={() => setIsSafeStepsOpen(false)}
        onOpenTorch={() => {
          setIsSafeStepsOpen(false);
          setIsTorchOpen(true);
        }}
      />

      {/* FULL-SCREEN MAX TORCH OVERLAY */}
      <TorchOverlay
        isOpen={isTorchOpen}
        onClose={() => setIsTorchOpen(false)}
      />

    </div>
  );
}

