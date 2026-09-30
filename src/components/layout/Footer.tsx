import React from 'react';
import { Utensils, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-navy-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-xl text-slate-950 font-bold">
                <Utensils className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-sans">
                FOOD<span className="text-cyan-400">BRIDGE</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A decentralized, transparent platform connecting surplus food donors directly with verified NGOs & distribution networks using Solidity smart contracts and Polygon blockchain technology.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>College Project Demonstration Prototype</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-mono">Platform Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-cyan-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('donor')} className="hover:text-cyan-400 transition-colors">
                  Donor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ngo')} className="hover:text-cyan-400 transition-colors">
                  NGO Surplus Discovery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('matching')} className="hover:text-cyan-400 transition-colors">
                  Matching Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('blockchain')} className="hover:text-cyan-400 transition-colors">
                  Blockchain Contract Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-mono">Web3 & Transparency</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveView('traceability')} className="hover:text-cyan-400 transition-colors">
                  Public Traceability Lookup
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('logistics')} className="hover:text-cyan-400 transition-colors">
                  Logistics & Pickup Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-cyan-400 transition-colors">
                  Admin Platform Verification
                </button>
              </li>
              <li>
                <span className="text-slate-500 font-mono">Polygon Amoy Testnet (Chain 80002)</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-mono">Architecture & Stack</h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-white font-semibold text-xs mb-1">
                  <span>Solidity & React</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">v1.0</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Built with Vite, TypeScript, Tailwind CSS, Ethers.js, IPFS metadata & Leaflet maps.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 FoodBridge Platform. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with sustainability & Web3 transparency</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
