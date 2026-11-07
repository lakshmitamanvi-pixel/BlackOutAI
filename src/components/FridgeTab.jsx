import React, { useState } from 'react';
import { ThermometerSnowflake, AlertOctagon, CheckCircle2, AlertTriangle, Clock, DoorClosed, Info } from 'lucide-react';
import { FRIDGE_ITEMS } from '../data/mockData';

export default function FridgeTab() {
  // Outage elapsed time in minutes (default around 167 min so Above 5°C is ~47 min!)
  // Base safe duration is 120 min (2 hours). 167 min elapsed - 120 min = 47 min above 5°C!
  const [elapsedMinutes, setElapsedMinutes] = useState(167);
  const [doorOpenCount, setDoorOpenCount] = useState(1);

  // Each door opening reduces effective thermal insulation by ~15 min
  const effectiveElapsed = elapsedMinutes + doorOpenCount * 15;
  const safeBaseLimit = 120; // 2 hours unopened at < 5°C

  // Compute status & verdict
  let verdict = 'KEEP';
  let verdictColor = 'emerald';
  let dialText = '';
  let internalTemp = 3.5;

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

  // Dial percentage for SVG gauge (0 to 360 min scale)
  const progressRatio = Math.min(1, effectiveElapsed / 360);
  const strokeDashoffset = 440 - (440 * progressRatio * 0.75); // 270 degree arc

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full max-w-md mx-auto space-y-4">
      
      {/* Top Banner with Strict Pitch-Black Arm's Length Readability */}
      <div className="bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThermometerSnowflake className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
            Thermal Core Monitor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Est. Temp: <strong className="text-white text-sm">{internalTemp.toFixed(1)}°C</strong>
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
              Outage: {Math.floor(elapsedMinutes / 60)}h {elapsedMinutes % 60}m
            </span>
          </div>
        </div>

        {/* GIANT SINGLE-WORD VERDICT: KEEP / EAT TODAY / DISCARD */}
        <div className="w-full space-y-2 pt-2">
          <div className="text-xs font-mono font-black uppercase tracking-widest text-slate-400">
            Perishable Safety Verdict
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

        {/* Quick Door Open Control (1-tap interaction) */}
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

      </div>

      {/* INTERACTIVE DEMO SLIDER FOR HACKATHON PRESENTATION */}
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

        {/* Quick Pitch State Presets */}
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

    </div>
  );
}

