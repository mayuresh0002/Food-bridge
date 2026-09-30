import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { isDemoMode, setIsDemoMode, runOneClickDemoFlow } = useApp();

  return (
    <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-b border-cyan-500/20 text-xs py-2 px-4 flex flex-wrap items-center justify-between text-slate-300 shadow-sm z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          DEMO MODE ACTIVE
        </span>
        <span className="hidden md:inline text-slate-400">
          Simulating Web3 Smart Contracts (Polygon Amoy Testnet), IPFS CIDs & P2P Matching.
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* 1-Click Auto Demo Button */}
        <button
          onClick={runOneClickDemoFlow}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-electric-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:scale-105 transition-transform"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>⚡ 1-Click Auto Demo Flow</span>
        </button>

        <span className="hidden sm:flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </span>

        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className="text-[11px] underline underline-offset-2 hover:text-cyan-400 transition-colors font-mono"
        >
          {isDemoMode ? 'Toggle Network View' : 'Switch to Demo Simulation'}
        </button>
      </div>
    </div>
  );
};
