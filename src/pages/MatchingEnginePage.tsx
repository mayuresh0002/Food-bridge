import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, MapPin, Utensils, Scale, Clock, CheckCircle2 } from 'lucide-react';
import { matchingEngine } from '../services/matchingEngine';

export const MatchingEnginePage: React.FC = () => {
  const { donations, users } = useApp();
  const ngos = users.filter((u) => u.role === 'ngo');

  const [selectedDonationId, setSelectedDonationId] = useState<string>(donations[0]?.id || 'FB-2026-00142');
  const [selectedNgoId, setSelectedNgoId] = useState<string>(ngos[0]?.id || 'ngo-1');

  const selectedDonation = donations.find((d) => d.id === selectedDonationId) || donations[0];
  const selectedNgo = ngos.find((u) => u.id === selectedNgoId) || ngos[0];

  const compatibility = selectedDonation && selectedNgo
    ? matchingEngine.calculateCompatibility(selectedDonation, selectedNgo)
    : null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl border border-cyan-500/20">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">P2P MATCHING ENGINE INTERFACE</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic multi-parameter surplus food allocation algorithm
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Selectors */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card-soft space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Input Parameters</h3>

          {/* Select Donation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Surplus Food Donation Listing
            </label>
            <select
              value={selectedDonationId}
              onChange={(e) => setSelectedDonationId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
            >
              {donations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} - {d.foodName.slice(0, 30)}... ({d.quantity} {d.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Select NGO */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Candidate NGO Distribution Network
            </label>
            <select
              value={selectedNgoId}
              onChange={(e) => setSelectedNgoId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
            >
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} ({ngo.capacityMealsPerDay || 400} meals/day cap)
                </option>
              ))}
            </select>
          </div>

          {/* Listing Specs summary */}
          {selectedDonation && (
            <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase block">Listing Specifications</span>
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedDonation.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Quantity:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedDonation.quantity} {selectedDonation.unit}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Storage:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedDonation.storageCondition}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center & Right Column: Score Breakdown */}
        {compatibility && (
          <div className="lg:col-span-2 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
                  COMPATIBILITY ALGORITHM OUTPUT
                </span>
                <h2 className="text-2xl font-bold mt-2">Overall Match Score</h2>
                <p className="text-xs text-slate-400">Evaluated against 5 key operational constraints</p>
              </div>

              {/* Big Overall Radial Score */}
              <div className="w-28 h-28 rounded-full bg-cyan-500/20 border-4 border-cyan-400 flex flex-col items-center justify-center shadow-glow-cyan">
                <span className="text-3xl font-extrabold text-cyan-300 font-sans">
                  {compatibility.overallScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400">Compatibility</span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Location Compatibility
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-xs">{compatibility.locationScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${compatibility.locationScore}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">{compatibility.distanceKm} km haul distance</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    Food Type Match
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">{compatibility.foodTypeScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${compatibility.foodTypeScore}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">Cold-chain compatibility score</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    Quantity Compatibility
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-xs">{compatibility.quantityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${compatibility.quantityScore}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">NGO daily capacity alignment</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Urgency & Shelf Life
                  </span>
                  <span className="font-mono font-bold text-purple-400 text-xs">{compatibility.urgencyScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${compatibility.urgencyScore}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">Expiry window & pickup window</span>
              </div>

            </div>

            {/* Reasons List */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Algorithm Rationale</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {compatibility.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Notice: FoodBridge matching uses transparent multi-factor scoring constraints rather than unverified black-box claims.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
