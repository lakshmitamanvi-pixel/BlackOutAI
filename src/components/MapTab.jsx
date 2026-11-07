import React, { useState } from 'react';
import { 
  MapPin, 
  Radio, 
  Building2, 
  Zap, 
  ZapOff, 
  AlertCircle, 
  ShieldAlert, 
  Sliders, 
  Layers,
  Activity
} from 'lucide-react';
import { NEIGHBOR_HOUSES } from '../data/mockData';

export default function MapTab({
  isPowerOut,
  neighboursDark,
  setNeighboursDark,
  setIsPowerOut
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  // We have 20 houses in NEIGHBOR_HOUSES.
  // The first `neighboursDark` houses are dark (outage), the rest are online.
  const housesWithStatus = NEIGHBOR_HOUSES.map((house, index) => {
    const isDark = index < neighboursDark;
    return {
      ...house,
      isDark,
      status: isDark ? 'OUTAGE' : 'ONLINE'
    };
  });

  const failureRate = Math.round((neighboursDark / 20) * 100);

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto space-y-4">
      
      {/* Top Banner with Clear "SIMULATED" label (Spec Requirement) */}
      <div className="bg-[#1E293B] border-2 border-slate-700/80 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mandatory Clear Simulated Label */}
          <span className="px-3 py-1 rounded-full text-xs font-mono font-black tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            Simulated
          </span>
          <span className="text-sm font-bold text-white">
            DISCOM Locality Grid
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Feeder #09 • 11kV
        </span>
      </div>

      {/* CORE DISCOM PITCH VISUAL: SIMULATED OUTAGE MAP CANVAS */}
      <div className="relative flex-1 min-h-[320px] rounded-3xl bg-[#0B1120] border-2 border-slate-700/80 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
        
        {/* Map Grid Background Texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#334155 1.5px, transparent 1.5px), radial-gradient(#334155 1.5px, #0B1120 1.5px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Substation 11kV Feeder Hub (Top Right) */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-300">
              Mesh Ping Latency: <strong className="text-emerald-400 font-bold">14ms</strong>
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-400">
            Sector 4A
          </div>
        </div>

        {/* Interactive Map Nodes Canvas */}
        <div className="relative w-full h-56 sm:h-64 my-auto">
          {/* Simulated Grid Interconnect Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Feeder line to User */}
            <line 
              x1="50%" 
              y1="50%" 
              x2="85%" 
              y2="15%" 
              stroke={isPowerOut ? "#EF4444" : "#10B981"} 
              strokeWidth="1.5" 
              strokeDasharray="4"
              className={isPowerOut ? "animate-pulse" : ""}
            />
            {/* Substation Feeder Spine */}
            <line x1="15%" y1="20%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
            <line x1="80%" y1="75%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
            <line x1="20%" y1="75%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" />
          </svg>

          {/* Substation Pin */}
          <div 
            className="absolute top-2 right-4 transform -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 shadow-md z-10"
          >
            <Building2 className={`w-3.5 h-3.5 ${neighboursDark > 5 ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className="text-[10px] font-mono font-bold text-slate-300">
              Substation #09
            </span>
          </div>

          {/* USER HOME PIN (CENTER of screen) */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group"
            onClick={() => setSelectedNode({
              name: "Your Home",
              street: "Sector 4A, Meter #402",
              dist: "0m",
              isDark: isPowerOut,
              status: isPowerOut ? 'POWER OUT' : 'POWER ONLINE'
            })}
          >
            {/* Pulsing ring */}
            <span className={`absolute -inset-2 rounded-full opacity-60 ${
              isPowerOut ? 'bg-red-500 animate-ping-slow' : 'bg-emerald-500'
            }`} />
            
            <div className={`relative px-3 py-1.5 rounded-2xl border-2 font-mono font-black text-xs flex items-center gap-1.5 shadow-xl ${
              isPowerOut 
                ? 'bg-red-600 border-white text-white' 
                : 'bg-emerald-600 border-white text-white'
            }`}>
              <MapPin className="w-3.5 h-3.5 fill-white" />
              <span>YOU</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded mt-1 border border-slate-700">
              #402
            </span>
          </div>

          {/* 20 SIMULATED NEIGHBOR NODES */}
          {housesWithStatus.map((house) => (
            <button
              key={house.id}
              onClick={() => setSelectedNode(house)}
              style={{ left: `${house.x}%`, top: `${house.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 p-1 group focus:outline-none"
              title={`${house.name} (${house.status})`}
              aria-label={`${house.name} status: ${house.status}`}
            >
              {/* Node Dot strictly adhering to constrained Green / Red colors */}
              <div className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center border ${
                house.isDark
                  ? 'bg-red-500 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
                  : 'bg-emerald-500 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${house.isDark ? 'bg-white' : 'bg-slate-900'}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Selected Node Details or Sector Summary */}
        <div className="relative z-10 pt-2 border-t border-slate-800/80">
          {selectedNode ? (
            <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">Node Inspector:</span>
                <div className="text-base font-bold text-white leading-tight">
                  {selectedNode.name} • {selectedNode.street}
                </div>
                <div className="text-xs text-slate-400">
                  Distance: {selectedNode.dist}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${
                selectedNode.isDark
                  ? 'bg-red-950 text-red-400 border-red-500/60'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-500/60'
              }`}>
                {selectedNode.isDark ? 'DARK' : 'LIVE'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Outage Count</span>
                <span className="text-xl font-black text-red-400 font-mono">
                  {neighboursDark}/20
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Failure Rate</span>
                <span className={`text-xl font-black font-mono ${failureRate > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {failureRate}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">DISCOM Status</span>
                <span className="text-xs font-bold text-amber-400 block pt-1">
                  {failureRate > 0 ? 'Notified' : 'Normal'}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* LIVE INTERACTIVE SLIDER (DRIVING THE MAP DOTS) */}
      <div className="bg-[#1E293B] border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <label htmlFor="map-sim-slider" className="text-base sm:text-lg font-extrabold text-white">
              Simulate Neighbours Dark (0-20)
            </label>
          </div>
          <span className="min-w-[42px] px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono font-black text-xl text-center text-amber-400">
            {neighboursDark}
          </span>
        </div>

        <input
          id="map-sim-slider"
          type="range"
          min="0"
          max="20"
          step="1"
          value={neighboursDark}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setNeighboursDark(val);
            if (!isPowerOut && val > 0) {
              setIsPowerOut(true);
            }
          }}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          aria-label="Simulate Neighbours Dark slider driving map dots"
        />

        {/* Legend Indicator strictly constrained to Amber/Red/Green */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            Online (230V)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse"></span>
            Simulated Outage
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            ⚡ DISCOM Mesh
          </span>
        </div>
      </div>

    </div>
  );
}

