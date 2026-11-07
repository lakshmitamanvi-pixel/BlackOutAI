import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, PhoneCall, X, Flashlight } from 'lucide-react';
import { SAFE_MCB_CHECKS } from '../data/mockData';

export default function SafeStepsModal({ isOpen, onClose, onOpenTorch }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-steps-title"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0F172A] border-2 border-amber-500/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 glow-amber">
        
        {/* Header Bar */}
        <div className="bg-[#451A03] border-b-2 border-amber-500/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="w-8 h-8 text-amber-400 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                1-Tap Safety Protocol
              </span>
              <h2 id="safe-steps-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Safe MCB Steps
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-2xl transition border border-slate-700 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Torch assistance quick-strip */}
        <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
          <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            Pitch-black room? Use max white screen:
          </span>
          <button
            onClick={() => {
              if (onOpenTorch) onOpenTorch();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95"
          >
            <Flashlight className="w-4 h-4 fill-black" />
            Screen Torch
          </button>
        </div>

        {/* 4 Plain-Language Liability-Safe Checks */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {SAFE_MCB_CHECKS.map((check) => (
            <div 
              key={check.step} 
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                  {check.step}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {check.title}
                  </h3>
                  <p className="text-slate-200 text-base leading-snug">
                    {check.instruction}
                  </p>
                  <p className="text-amber-400/90 text-sm font-medium pt-1">
                    ⚠ {check.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Mandatory Cautious Disclaimer at the bottom */}
          <div className="p-4 rounded-2xl bg-red-950/50 border-2 border-red-600/60 mt-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                Mandatory Safety Caution
              </span>
              <p className="text-base sm:text-lg font-bold text-red-200 leading-snug">
                Call an electrician if unsure; avoid risky electrical work.
              </p>
              <p className="text-xs text-slate-300">
                Never touch burnt-smelling equipment, buzzing panels, or exposed conductors. If the breaker snaps back instantly, a dead short exists.
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <a
            href="tel:1912"
            className="flex-1 min-h-[56px] py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-lg flex items-center justify-center gap-2 text-center transition shadow-lg shadow-red-900/50"
          >
            <PhoneCall className="w-5 h-5" />
            Emergency Help (1912)
          </a>
          <button
            onClick={onClose}
            className="flex-1 min-h-[56px] py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-extrabold text-lg border border-slate-700 transition flex items-center justify-center"
          >
            Done / Close
          </button>
        </div>

      </div>
    </div>
  );
}

