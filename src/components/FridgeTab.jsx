import React, { useState } from 'react';
import { ThermometerSnowflake, AlertOctagon, CheckCircle2, AlertTriangle, Clock, DoorClosed, Info, Radio } from 'lucide-react';
import { FRIDGE_ITEMS } from '../data/mockData';

export default function FridgeTab({ 
  isConnected = false, 
  isStale = false,
  liveTemp = null, 
  liveMins = null, 
  liveFood = null 
}) {
  // Outage elapsed time in minutes for offline simulation fallback
  const [elapsedMinutes, setElapsedMinutes] = useState(167);
  const [doorOpenCount, setDoorOpenCount] = useState(1);

  // Each door opening reduces effective thermal insulation by ~15 min
  const effectiveElapsed = elapsedMinutes + doorOpenCount * 15;
  const safeBaseLimit = 120; // 2 hours unopened at < 5°C

  // Determine values: Live ESP32 values when connected; simulation when disconnected
  let verdict = 'KEEP';
  let verdictColor = 'emerald';
  let dialText = '';
  let internalTemp = 3.5;
  let strokeDashoffset = 440;

  if (isConnected) {
    // Requirement 5: 100% Live ESP32 MQTT data (no simulated values)
    verdict = liveFood || 'KEEP';
    internalTemp = liveTemp !== null ? liveTemp : 3.5;
    const mins = Math.max(0, liveMins !== null ? liveMins : 0);

    if (mins > 0) {
      dialText = `Above 5°C: ${mins} min`;
    } else {
      dialText = 'At/Below 5°C (Safe)';
    }

    if (verdict === 'KEEP') {
      verdictColor = 'emerald';
    } else if (verdict === 'EAT TODAY') {
      verdictColor = 'amber';
    } else {
      verdictColor = 'red';
    }

    // Dial gauge progress: 0 to 240 minutes above 5°C scale
    const progressRatio = Math.min(1, mins / 240);
    strokeDashoffset = 440 - (440 * progressRatio * 0.75); // 270 degree arc
  } else {
    // Fallback simulation when disconnected
    if (effectiveElapsed < safeBaseLimit) {
      verdict = 'KEEP';
      verdictColor = 'emerald';
      const minUntil5C = safeBaseLimit - effectiveElapsed;
      dialText = `Reaches 5°C in: ${minUntil5C} min`;
      internalTemp = 3.5 + (effectiveElapsed / safeBaseLimit) * 1.5;
    } else if (effectiveElapsed >= safeBaseLimit && effectiveElapsed < 240) {
      verdict = 'EAT TODAY';
      verdictColor = 'amber';
      const minAbove5C = effectiveElapsed - safeBaseLimit;
      dialText = `Above 5°C: ${minAbove5C} min`;
      internalTemp = 5.0 + ((effectiveElapsed - safeBaseLimit) / 120) * 4.5;
    } else {
      verdict = 'DISCARD';
      verdictColor = 'red';
      const minAbove5C = effectiveElapsed - safeBaseLimit;
      const hoursAbove = Math.floor(minAbove5C / 60);
      const remainderMin = minAbove5C % 60;
      dialText = `Above 5°C: ${hoursAbove}h ${remainderMin}m`;
      internalTemp = Math.min(18.0, 9.5 + ((effectiveElapsed - 240) / 120) * 4.0);
    }

    const progressRatio = Math.min(1, effectiveElapsed / 360);
    strokeDashoffset = 440 - (440 * progressRatio * 0.75);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto space-y-4">
      
      {/* Top Banner with Temperature Display */}
      <div className="bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThermometerSnowflake className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
            {isConnected ? 'ESP32 Thermal Core' : 'Thermal Core Monitor'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {isConnected ? 'Live Temp:' : 'Est. Temp:'}{' '}
            <strong className="text-white text-sm">{internalTemp.toFixed(1)}°C</strong>
            {isConnected && isStale && (
              <span className="ml-1.5 text-[10px] font-mono font-bold text-amber-400 px-1 py-0.2 rounded bg-amber-950 border border-amber-500/40 animate-pulse">
                STALE
              </span>
            )}
          </span>
        </div>
      </div>

      {/* MAIN FRIDGE CARD */}
      <div className={`flex-1 rounded-3xl border-2 p-6 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-200 ${
        verdictColor === 'emerald'
          ? 'border-emerald-500/80 bg-emerald-950/30 glow-green'
          : verdictColor === 'amber'
          ? 'border-amber-500/80 bg-amber-950/35 glow-amber'
          : 'border-red-500/80 bg-red-950/40 glow-red'
      }`}>

        {/* Small "advisory only" label required by spec */}
        <div className="w-full flex justify-between items-center pb-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-black tracking-widest uppercase bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Advisory Only
          </span>
          <span className="text-xs font-mono text-slate-400">
            Rule: Max 4h at &gt;5°C
          </span>
        </div>

        {/* BIG DIAL / TIMER DISPLAY */}
        <div className="relative w-56 h-56 flex items-center justify-center my-1">
          {/* Circular SVG Gauge */}
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className="text-slate-800"
              strokeWidth="14"
              stroke="currentColor"
              fill="transparent"
              strokeDasharray="440"
              strokeDashoffset="110"
              strokeLinecap="round"
            />
            {/* Active Colored Arc */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className={
                verdictColor === 'emerald'
                  ? 'text-emerald-500'
                  : verdictColor === 'amber'
                  ? 'text-amber-500'
                  : 'text-red-500'
              }
              strokeWidth="14"
              stroke="currentColor"
              fill="transparent"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>

          {/* Dial Center Text: "Above 5°C: 47 min" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Clock className={`w-6 h-6 mb-1 ${
              verdictColor === 'emerald' ? 'text-emerald-400' : verdictColor === 'amber' ? 'text-amber-400' : 'text-red-400'
            }`} />
            
            {/* Exact required readout */}
            <div className="text-xl sm:text-2xl font-black text-white text-center tracking-tight leading-tight px-2">
              {dialText}
            </div>
            
            <span className="text-xs font-mono font-bold text-slate-400 uppercase mt-1">
              {isConnected 
                ? (liveMins !== null ? `${liveMins}m above threshold` : 'ESP32 Stream')
                : `Outage: ${Math.floor(elapsedMinutes / 60)}h ${elapsedMinutes % 60}m`}
            </span>
          </div>
        </div>

        {/* GIANT SINGLE-WORD VERDICT: KEEP / EAT TODAY / DISCARD */}
        <div className="w-full space-y-2 pt-2">
          {/* Requirement 8: Keep "(advisory)" label next to the food verdict */}
          <div className="text-xs font-mono font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5">
            <span>Perishable Safety Verdict</span>
            <span className="text-amber-400 font-bold lowercase tracking-normal text-xs">(advisory)</span>
          </div>
          
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none ${
            verdictColor === 'emerald'
              ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : verdictColor === 'amber'
              ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]'
          }`}>
            {verdict}
          </div>

          <p className="text-slate-200 text-lg sm:text-xl font-bold leading-snug max-w-xs mx-auto">
            {verdict === 'KEEP' && 'Chamber is chilled. Safe for overnight storage.'}
            {verdict === 'EAT TODAY' && 'Cook or consume high-risk items immediately.'}
            {verdict === 'DISCARD' && 'Danger zone exceeded. Discard meat and dairy safely.'}
          </p>
        </div>

        {/* Door Open Control only shown in offline demo mode; disabled/hidden when connected */}
        {!isConnected && (
          <div className="w-full pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <DoorClosed className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-300 font-semibold">
                Door Opened: <strong className="text-white">{doorOpenCount}×</strong> (-{doorOpenCount * 15}m)
              </span>
            </div>
            <button
              onClick={() => setDoorOpenCount((c) => Math.min(6, c + 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold rounded-xl border border-slate-700 active:scale-95 transition"
            >
              +1 Door Open
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM CONTROL / TELEMETRY AREA */}
      {isConnected ? (
        /* Requirement 5: Simulation removed/disabled; Live ESP32 Telemetry Display */
        <div className="bg-[#1E293B] border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-base sm:text-lg font-extrabold text-white">
                Live ESP32 Thermal Telemetry
              </span>
            </div>
            {isStale ? (
              <span className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/50 text-xs font-mono font-black text-amber-400 animate-pulse">
                STALE
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/50 text-xs font-mono font-black text-emerald-400">
                Live Feed
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Fridge Temp (temp)</span>
              <span className="text-2xl font-black text-white">{internalTemp.toFixed(1)}°C</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Above 5°C (mins)</span>
              <span className="text-2xl font-black text-amber-400">{liveMins !== null ? liveMins : 0} min</span>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback demo slider when disconnected */
        <div className="bg-[#1E293B] border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="fridge-slider" className="text-base sm:text-lg font-extrabold text-white">
              Demo Outage Duration
            </label>
            <span className="min-w-[70px] px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono font-black text-lg text-center text-amber-400">
              {Math.floor(elapsedMinutes / 60)}h {elapsedMinutes % 60}m
            </span>
          </div>

          <input
            id="fridge-slider"
            type="range"
            min="15"
            max="360"
            step="5"
            value={elapsedMinutes}
            onChange={(e) => setElapsedMinutes(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            aria-label="Fridge outage duration slider in minutes"
          />

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { setElapsedMinutes(45); setDoorOpenCount(0); }}
              className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
                verdict === 'KEEP'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              KEEP (45m)
            </button>
            <button
              onClick={() => { setElapsedMinutes(167); setDoorOpenCount(1); }}
              className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
                verdict === 'EAT TODAY'
                  ? 'bg-amber-950 text-amber-300 border-amber-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              EAT TODAY (47m &gt;5°)
            </button>
            <button
              onClick={() => { setElapsedMinutes(300); setDoorOpenCount(2); }}
              className={`flex-1 py-2 px-1 text-xs font-mono font-extrabold rounded-xl border transition text-center ${
                verdict === 'DISCARD'
                  ? 'bg-red-950 text-red-300 border-red-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              DISCARD (5h)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
