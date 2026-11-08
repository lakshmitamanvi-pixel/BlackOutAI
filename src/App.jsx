import React, { useState, useEffect } from 'react';
import VerdictTab from './components/VerdictTab';
import FridgeTab from './components/FridgeTab';
import MapTab from './components/MapTab';
import TabBar from './components/TabBar';
import SafeStepsModal from './components/SafeStepsModal';
import TorchOverlay from './components/TorchOverlay';
import { useMqtt } from './hooks/useMqtt';
import { Flashlight, Radio, Plug, PlugZap } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('verdict'); // 'verdict' | 'fridge' | 'map'

  // MQTT Hook for live ESP32 integration via HiveMQ WSS broker
  const {
    isConnected,
    status: mqttStatus,
    statusBadge,
    isStale,
    errorMessage: mqttError,
    lastPacket,
    connect: connectESP32,
    disconnect: disconnectESP32,
    sendDark,
  } = useMqtt();

  // Fallback Simulation State (used strictly when disconnected)
  const [simPowerOut, setSimPowerOut] = useState(true);
  const [simNeighboursDark, setSimNeighboursDark] = useState(14);

  // Modals & Overlays
  const [isSafeStepsOpen, setIsSafeStepsOpen] = useState(false);
  const [isTorchOpen, setIsTorchOpen] = useState(false);

  // Requirement 4 & 5: Effective state binding matching incoming ESP32 JSON schema:
  // {"t":12,"mains":"LOST","dark":8,"crowd":"GRID FAULT","temp":9.5,"mins":47,"food":"EAT TODAY","cap":18}
  // When live, strictly disable and omit any simulated/mock values.
  const isPowerOut = isConnected
    ? (lastPacket?.mains === 'LOST')
    : simPowerOut;

  const neighboursDark = isConnected
    ? (lastPacket?.dark !== undefined ? Number(lastPacket.dark) : 0)
    : simNeighboursDark;

  const crowdVerdict = isConnected
    ? (lastPacket?.crowd || (isPowerOut ? (neighboursDark > 0 ? 'GRID FAULT' : 'HOUSE FAULT') : 'NONE'))
    : (isPowerOut ? (neighboursDark > 0 ? 'GRID FAULT' : 'HOUSE FAULT') : 'NONE');

  const supercapSeconds = isConnected
    ? (lastPacket?.cap !== undefined ? Number(lastPacket.cap) : 0)
    : 0;

  const fridgeTemp = isConnected
    ? (lastPacket?.temp !== undefined ? Number(lastPacket.temp) : null)
    : null;

  const minsAbove5C = isConnected
    ? (lastPacket?.mins !== undefined ? Number(lastPacket.mins) : null)
    : null;

  const foodVerdict = isConnected
    ? (lastPacket?.food !== undefined ? lastPacket.food : null)
    : null;

  // Derived states
  const isHouseFault = isPowerOut && (crowdVerdict === 'HOUSE FAULT' || neighboursDark === 0);
  const isGridFault = isPowerOut && (crowdVerdict === 'GRID FAULT' || neighboursDark > 0);

  // Keyboard shortcuts for demo presentation
  useEffect(() => {
    const handleKeyDown = (e) => {
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

      {/* MQTT ESP32 CONNECTION STRIP (Requirement 2 & 7) */}
      <div className="w-full max-w-md mx-auto px-4 py-2.5 bg-[#1E293B]/95 border-b border-slate-800 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0">
          {/* Status Indicator LED */}
          <span 
            className={`w-3 h-3 rounded-full shrink-0 transition-colors ${
              isConnected 
                ? (isStale 
                    ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]' 
                    : 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]')
                : mqttStatus === 'connecting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-500'
            }`} 
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Requirement 7: Status badge "Connecting" / "LIVE via MQTT (Wokwi sim)" / "Disconnected" */}
              <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-200">
                {statusBadge}
              </span>
              {/* Requirement 7: Mark data STALE if no message for 5 s */}
              {isConnected && isStale && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse">
                  STALE
                </span>
              )}
            </div>
            {mqttError ? (
              <span className="text-[10px] font-mono text-red-400 truncate max-w-[200px]" title={mqttError}>
                {mqttError}
              </span>
            ) : isConnected && isStale ? (
              <span className="text-[10px] font-mono text-amber-400 font-bold animate-pulse">
                Data STALE (no packet &gt;5s)
              </span>
            ) : isConnected && isPowerOut && supercapSeconds > 0 ? (
              <span className="text-[10px] font-mono text-amber-400 font-bold animate-pulse">
                ⚡ Supercap: {supercapSeconds}s remaining
              </span>
            ) : null}
          </div>
        </div>

        {/* Connect / Disconnect Action Button (Requirement 2: On "Connect ESP32" click) */}
        <div className="shrink-0">
          {!isConnected ? (
            <button
              onClick={connectESP32}
              disabled={mqttStatus === 'connecting'}
              className="min-h-[40px] px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-1.5"
              title="Connect to HiveMQ MQTT Broker over WSS"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{mqttStatus === 'connecting' ? 'Connecting...' : 'Connect ESP32'}</span>
            </button>
          ) : (
            <button
              onClick={disconnectESP32}
              className="min-h-[40px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition"
              title="Disconnect MQTT Connection"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* MAIN SCREEN AREA (MOBILE VIEWPORT OPTIMIZED) */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col min-h-0">
        {activeTab === 'verdict' && (
          <VerdictTab
            isConnected={isConnected}
            isStale={isStale}
            isPowerOut={isPowerOut}
            setIsPowerOut={setSimPowerOut}
            neighboursDark={neighboursDark}
            setNeighboursDark={setSimNeighboursDark}
            crowdVerdict={crowdVerdict}
            supercapSeconds={supercapSeconds}
            sendDark={sendDark}
            onOpenSafeSteps={() => setIsSafeStepsOpen(true)}
            onOpenTorch={() => setIsTorchOpen(true)}
          />
        )}

        {activeTab === 'fridge' && (
          <FridgeTab 
            isConnected={isConnected}
            isStale={isStale}
            liveTemp={fridgeTemp}
            liveMins={minsAbove5C}
            liveFood={foodVerdict}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            isConnected={isConnected}
            isStale={isStale}
            isPowerOut={isPowerOut}
            neighboursDark={neighboursDark}
            setNeighboursDark={setSimNeighboursDark}
            setIsPowerOut={setSimPowerOut}
            sendDark={sendDark}
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
