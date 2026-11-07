import React from 'react';
import { X, Flashlight, AlertCircle } from 'lucide-react';

export default function TorchOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-white text-black flex flex-col justify-between items-center p-6 cursor-pointer select-none animate-in fade-in duration-75"
      title="Tap anywhere to exit lantern"
    >
      <div className="w-full flex justify-between items-center pt-2">
        <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
          <Flashlight className="w-5 h-5 fill-black" />
          <span className="font-mono font-black text-sm tracking-wider uppercase">
            Emergency Screen Torch
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-black text-white rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center font-bold"
          aria-label="Exit torch"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black">
          MAX LIGHT
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
          Use this beam to reach your MCB distribution board safely.
        </p>
      </div>

      <div className="w-full pb-4">
        <div className="w-full py-4 bg-black text-white rounded-2xl text-center font-black text-xl tracking-wide uppercase shadow-xl flex items-center justify-center gap-2">
          Tap Anywhere to Dismiss
        </div>
      </div>
    </div>
  );
}

