import React from 'react';
import { MapPin, Navigation, Truck, Home, ShieldCheck } from 'lucide-react';

interface LeafletMapProps {
  donorName?: string;
  ngoName?: string;
  height?: string;
  title?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  donorName = 'FreshBite Restaurant',
  ngoName = 'Hope Foundation Relief',
  height = '320px',
  title = 'Real-Time Logistics & Route Map'
}) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-card-soft flex flex-col">
      <div className="px-4 py-3 bg-navy-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">{title}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3" />
          Live GPS Route Active
        </span>
      </div>

      {/* Styled visual map container */}
      <div 
        style={{ height }}
        className="relative bg-[#0F172A] flex flex-col justify-between p-6 overflow-hidden"
      >
        {/* Synthetic Map grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

        {/* Route Line SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d="M 80 180 Q 220 70 380 140"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>

        {/* Node 1: Donor */}
        <div className="absolute left-[15%] top-[50%] -translate-y-1/2 z-20 flex flex-col items-center group">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-glow-cyan border-2 border-white ring-4 ring-emerald-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
            <Home className="w-5 h-5" />
          </div>
          <div className="mt-2 px-3 py-1 bg-navy-900/90 border border-slate-700 backdrop-blur rounded-xl text-center shadow-lg">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">DONOR</span>
            <span className="text-xs font-semibold text-white">{donorName}</span>
          </div>
        </div>

        {/* Node 2: Driver In Transit */}
        <div className="absolute left-[48%] top-[28%] z-20 flex flex-col items-center">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-lg border-2 border-white animate-pulse">
            <Truck className="w-5 h-5" />
          </div>
          <div className="mt-1 px-2.5 py-0.5 bg-amber-950/80 border border-amber-500/40 rounded-lg text-center">
            <span className="text-[10px] font-mono font-bold text-amber-300">En Route (1.4 km left)</span>
          </div>
        </div>

        {/* Node 3: NGO Receiver */}
        <div className="absolute right-[15%] top-[40%] z-20 flex flex-col items-center">
          <div className="p-3 bg-cyan-500 text-slate-950 rounded-2xl shadow-glow-cyan border-2 border-white ring-4 ring-cyan-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="mt-2 px-3 py-1 bg-navy-900/90 border border-slate-700 backdrop-blur rounded-xl text-center shadow-lg">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block">VERIFIED NGO</span>
            <span className="text-xs font-semibold text-white">{ngoName}</span>
          </div>
        </div>

        {/* Map Legend Footer */}
        <div className="relative z-20 mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-400 bg-navy-950/80 p-2.5 rounded-xl border border-slate-800 backdrop-blur">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Pickup Point
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Delivery Hub
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              EV Driver
            </span>
          </div>
          <span className="font-mono text-cyan-400">EST: 12 MINS AWAY</span>
        </div>
      </div>
    </div>
  );
};
