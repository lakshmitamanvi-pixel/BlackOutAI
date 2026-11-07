import React from 'react';
import { 
  Zap, 
  ZapOff, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Home, 
  ShieldCheck, 
  Radio, 
  ArrowRight,
  Flashlight,
  Sliders
} from 'lucide-react';

export default function VerdictTab({
  isPowerOut,
  setIsPowerOut,
  neighboursDark,
  setNeighboursDark,
  onOpenSafeSteps,
  onOpenTorch
}) {
  // Determine verdict mode
  // Neutral state: POWER OK
  // Yellow state: HOUSE FAULT: only you. Check MCB. (Power out & 0 neighbours dark)
  // Red state: GRID FAULT: {count} nearby also dark. DISCOM notified. (Power out & >0 neighbours dark)
  const isNeutral = !isPowerOut;
  const isHouseFault = isPowerOut && neighboursDark === 0;
  const isGridFault = isPowerOut && neighboursDark > 0;

  // Background and border style matching strict OLED + Amber/Red/Green constraints
  const cardTheme = isNeutral
    ? {
        border: 'border-emerald-500/80',
        bg: 'bg-emerald-950/30',
        glow: 'glow-green',
        badgeBg: 'bg-emerald-900/60',
        badgeBorder: 'border-emerald-500/50',
        badgeText: 'text-emerald-400',
        accentColor: 'text-emerald-400',
        btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      }
    : isHouseFault
    ? {
        border: 'border-amber-500/80',
        bg: 'bg-amber-950/35',
        glow: 'glow-amber',
        badgeBg: 'bg-amber-900/70',
        badgeBorder: 'border-amber-500/60',
        badgeText: 'text-amber-400',
        accentColor: 'text-amber-400',
        btnBg: 'bg-amber-500 hover:bg-amber-400 text-black',
      }
    : {
        border: 'border-red-500/80',
        bg: 'bg-red-950/40',
        glow: 'glow-red',
        badgeBg: 'bg-red-900/70',
        badgeBorder: 'border-red-500/60',
        badgeText: 'text-red-400',
        accentColor: 'text-red-400',
        btnBg: 'bg-red-600 hover:bg-red-500 text-white',
      };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto space-y-4">
      
      {/* Pitch Quick-Controls & Master Outage Switch */}
      <div className="bg-[#1E293B]/80 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isPowerOut ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            {isPowerOut ? '11 PM Blackout Active' : 'Mains Power Online'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (!isPowerOut) {
                setIsPowerOut(true);
                if (neighboursDark === 0) setNeighboursDark(14);
              } else {
                setIsPowerOut(false);
              }
            }}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition active:scale-95 border flex items-center gap-1.5 ${
              isPowerOut
                ? 'bg-red-950/80 text-red-300 border-red-500/50 hover:bg-red-900'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
            }`}
          >
            {isPowerOut ? <ZapOff className="w-4 h-4 text-red-400" /> : <Zap className="w-4 h-4 text-emerald-400" />}
            {isPowerOut ? 'Power CUT' : 'Power OK'}
          </button>

          <button
            onClick={onOpenTorch}
            className="min-h-[44px] min-w-[44px] p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 rounded-xl transition flex items-center justify-center active:scale-95"
            title="Emergency Screen Torch"
            aria-label="Torch mode"
          >
            <Flashlight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FULL-SCREEN IMMERSIVE VERDICT COLOR CARD */}
      <div 
        className={`flex-1 rounded-3xl border-2 ${cardTheme.border} ${cardTheme.bg} ${cardTheme.glow} p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative overflow-hidden`}
      >
        {/* Ambient background watermark icon */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none">
          {isNeutral && <ShieldCheck className="w-72 h-72 text-emerald-400" />}
          {isHouseFault && <Home className="w-72 h-72 text-amber-400" />}
          {isGridFault && <Building2 className="w-72 h-72 text-red-400" />}
        </div>

        {/* Top Header Row of the Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-black tracking-widest uppercase border ${cardTheme.badgeBg} ${cardTheme.badgeBorder} ${cardTheme.badgeText}`}>
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {isNeutral ? 'DIAGNOSTIC: IDLE' : isHouseFault ? 'DIAGNOSTIC: ISOLATED' : 'DIAGNOSTIC: GRID WIDE'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Meter #402 • 11:00 PM
            </span>
          </div>

          {/* STATE CONTENT */}
          {isNeutral && (
            <div className="space-y-4 pt-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              {/* Min 24px arm's length readability */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none uppercase">
                  POWER OK
                </h1>
                <p className="text-2xl sm:text-2xl font-bold text-emerald-400 leading-snug">
                  Mains voltage stable at 238V. All neighborhood circuits live.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 text-base">
                <div className="flex justify-between items-center py-1">
                  <span>DISCOM Feeder Status:</span>
                  <span className="font-mono font-bold text-emerald-400">NORMAL (50 Hz)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-slate-800">
                  <span>Local Mesh Meters:</span>
                  <span className="font-mono font-bold text-white">20/20 Reporting Active</span>
                </div>
              </div>
            </div>
          )}

          {isHouseFault && (
            <div className="space-y-4 pt-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 animate-pulse">
                <AlertTriangle className="w-10 h-10" />
              </div>

              {/* Exact required copy & arm's length >= 24px */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  Isolated Internal Trip
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none uppercase">
                  HOUSE FAULT
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 leading-tight">
                  Only you. Check MCB.
                </p>
                <p className="text-slate-300 text-lg font-medium pt-1">
                  All 20 nearby homes have power. The issue is inside your consumer breaker unit.
                </p>
              </div>

              {/* 1-Tap button opening Safe steps modal */}
              <button
                onClick={onOpenSafeSteps}
                className="w-full min-h-[58px] py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-black text-xl tracking-wide flex items-center justify-center gap-3 transition shadow-xl shadow-amber-950/60 mt-2"
                aria-label="Open Safe Steps for MCB"
              >
                <span>SAFE STEPS (MCB)</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}

          {isGridFault && (
            <div className="space-y-4 pt-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center text-red-400 animate-pulse">
                <Building2 className="w-10 h-10" />
              </div>

              {/* Exact required copy & arm's length >= 24px */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-red-400">
                  External Sector Blackout
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none uppercase">
                  GRID FAULT
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-300 leading-tight">
                  {neighboursDark} nearby also dark. DISCOM notified.
                </p>
                <p className="text-slate-300 text-lg font-medium pt-1">
                  Do not touch MCB. Substation 11kV Feeder #09 trip auto-reported.
                </p>
              </div>

              {/* DISCOM Telemetry Status Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-red-900/60 text-slate-300 space-y-2 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Auto-Ticket Ref:</span>
                  <span className="font-mono font-bold text-red-400">#DSC-88219-AUTO</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-1.5">
                  <span className="text-slate-400">Estimated Restore:</span>
                  <span className="font-mono font-bold text-white">00:45 AM (~45m)</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-1.5">
                  <span className="text-slate-400">DISCOM Lineworker:</span>
                  <span className="font-mono font-bold text-amber-400">Dispatched (Van #4)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Arm's Length Quick Tip Bar */}
        <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-400">
          <span>OLED Low-Glare Mode Active</span>
          <span className="font-mono text-slate-500">v1.0.4 Hackathon Build</span>
        </div>
      </div>

      {/* LIVE INTERACTIVE DEMO SLIDER (BOTTOM) */}
      <div className="bg-[#1E293B] border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <label htmlFor="sim-neighbours" className="text-base sm:text-lg font-extrabold text-white">
              Simulate Neighbours Dark (0-20)
            </label>
          </div>
          <span className="min-w-[42px] px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono font-black text-xl text-center text-amber-400">
            {neighboursDark}
          </span>
        </div>

        {/* Range Slider */}
        <input
          id="sim-neighbours"
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
          aria-label="Simulate Neighbours Dark slider from 0 to 20"
        />

        {/* Legend / Range Labels */}
        <div className="flex justify-between text-xs font-mono font-bold text-slate-400 pt-1">
          <span className={neighboursDark === 0 ? 'text-amber-400 font-black' : ''}>
            0 (Only You / MCB)
          </span>
          <span className={neighboursDark === 14 ? 'text-red-400 font-black' : ''}>
            14 (Pitch Target)
          </span>
          <span className={neighboursDark === 20 ? 'text-red-400 font-black' : ''}>
            20 (Full Sector Out)
          </span>
        </div>

        {/* Quick Demo Preset Pills for seamless pitch */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              setIsPowerOut(false);
              setNeighboursDark(0);
            }}
            className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
              !isPowerOut 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Power OK
          </button>
          
          <button
            onClick={() => {
              setIsPowerOut(true);
              setNeighboursDark(0);
            }}
            className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
              isPowerOut && neighboursDark === 0
                ? 'bg-amber-950 text-amber-300 border-amber-500' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            House (0 Dark)
          </button>

          <button
            onClick={() => {
              setIsPowerOut(true);
              setNeighboursDark(14);
            }}
            className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
              isPowerOut && neighboursDark === 14
                ? 'bg-red-950 text-red-300 border-red-500' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Grid (14 Dark)
          </button>
        </div>
      </div>

    </div>
  );
}

