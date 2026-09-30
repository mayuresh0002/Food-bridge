import React from 'react';
import { X, Cpu, MapPin, Utensils, Scale, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { FoodDonation, UserProfile } from '../../types';
import { matchingEngine } from '../../services/matchingEngine';

interface MatchingScoreModalProps {
  donation: FoodDonation | null;
  ngo: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const MatchingScoreModal: React.FC<MatchingScoreModalProps> = ({
  donation,
  ngo,
  isOpen,
  onClose,
  onAccept
}) => {
  if (!isOpen || !donation || !ngo) return null;

  const compatibility = matchingEngine.calculateCompatibility(donation, ngo);

  const criteriaList = [
    { label: 'Location Proximity', score: compatibility.locationScore, icon: MapPin, desc: `${compatibility.distanceKm} km distance between donor & NGO` },
    { label: 'Food Category Match', score: compatibility.foodTypeScore, icon: Utensils, desc: `Compatible cold-chain & handling for ${donation.category}` },
    { label: 'Quantity Compatibility', score: compatibility.quantityScore, icon: Scale, desc: `${donation.quantity} ${donation.unit} within NGO daily intake capacity` },
    { label: 'Urgency Window', score: compatibility.urgencyScore, icon: Clock, desc: `Sufficient shelf-life before pickup deadline` },
    { label: 'NGO Capacity Score', score: compatibility.capacityScore, icon: ShieldCheck, desc: `Active distribution volunteers & facility ready` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl border border-cyan-500/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">MATCHING ENGINE BREAKDOWN</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic Multi-Factor Compatibility Score
            </p>
          </div>
        </div>

        {/* Big Overall Score Circle */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-cyan-500/20 border-4 border-cyan-400 flex items-center justify-center shadow-glow-cyan">
              <span className="text-2xl font-extrabold text-cyan-300 font-sans">
                {compatibility.overallScore}%
              </span>
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                High Compatibility Match
              </span>
              <h4 className="text-lg font-bold text-white mt-1">{ngo.name}</h4>
              <p className="text-xs text-slate-400">{donation.foodName}</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono hidden md:block">
            <div>DONATION ID: {donation.id}</div>
            <div>NGO REG ID: {ngo.regId || 'NGO-VERIFIED'}</div>
          </div>
        </div>

        {/* Detailed Criteria Progress Bars */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scoring Breakdown</h4>
          {criteriaList.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="bg-slate-50 dark:bg-navy-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-electric-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[11px] text-slate-400">
          <span className="font-bold text-cyan-400">Scoring Model Notice: </span>
          Scores are calculated using transparent distance, quantity, and storage constraints without black-box AI claims.
        </div>

        {onAccept && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-glow-cyan transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept & Sign Smart Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
