import React from 'react';
import { 
  PlusCircle, 
  Cpu, 
  Lock, 
  Truck, 
  QrCode,
  CheckCircle2
} from 'lucide-react';

interface WorkflowProgressProps {
  currentStage?: number; // 1 to 5
  compact?: boolean;
}

export const WORKFLOW_STAGES = [
  { 
    stage: 1, 
    title: 'Surplus Listing', 
    shortTitle: '1. Listing',
    desc: 'Donor posts surplus details; pinned to IPFS', 
    icon: PlusCircle,
    color: 'cyan'
  },
  { 
    stage: 2, 
    title: 'Smart P2P Match', 
    shortTitle: '2. P2P Match',
    desc: 'Engine ranks nearest verified NGOs by 5 factors', 
    icon: Cpu,
    color: 'blue'
  },
  { 
    stage: 3, 
    title: 'On-Chain Agreement', 
    shortTitle: '3. Smart Contract',
    desc: 'NGO accepts & locks terms on Polygon smart contract', 
    icon: Lock,
    color: 'emerald'
  },
  { 
    stage: 4, 
    title: 'Cold-Chain Transport', 
    shortTitle: '4. Logistics',
    desc: 'EV fleet assigned, live GPS route tracked', 
    icon: Truck,
    color: 'amber'
  },
  { 
    stage: 5, 
    title: 'QR Audit & Completion', 
    shortTitle: '5. QR Verification',
    desc: 'Delivery confirmed, immutable proof & QR published', 
    icon: QrCode,
    color: 'purple'
  },
];

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStage = 3, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center min-w-max justify-between gap-3">
          {WORKFLOW_STAGES.map((s) => {
            const isPassed = s.stage < currentStage;
            const isCurrent = s.stage === currentStage;
            const StageIcon = s.icon;

            return (
              <React.Fragment key={s.stage}>
                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-glow-cyan'
                      : isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-cyan-400 text-slate-950'
                        : isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {s.stage}
                  </span>
                  <StageIcon className="w-4 h-4" />
                  <span>{s.shortTitle}</span>
                </div>

                {s.stage < 5 && (
                  <div
                    className={`w-8 h-0.5 ${
                      s.stage < currentStage ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-mono font-bold">
            STREAMLINED WORKFLOW
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            5-Stage Decentralized Allocation Lifecycle
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simplified end-to-end allocation pipeline from surplus listing to verified QR code audit
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-xs font-mono whitespace-nowrap">
          Stage {currentStage} of 5 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {WORKFLOW_STAGES.map((s) => {
          const isPassed = s.stage < currentStage;
          const isCurrent = s.stage === currentStage;
          const StageIcon = s.icon;

          return (
            <div
              key={s.stage}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-gradient-to-b from-navy-900 to-navy-950 border-cyan-400 text-white shadow-glow-cyan ring-2 ring-cyan-400/40'
                  : isPassed
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-navy-950/50 border-slate-200 dark:border-slate-800/80 text-slate-400 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center ${
                      isCurrent
                        ? 'bg-cyan-400 text-slate-950 shadow-glow-cyan'
                        : isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {s.stage}
                  </span>
                  <StageIcon
                    className={`w-5 h-5 ${
                      isCurrent
                        ? 'text-cyan-400 animate-pulse'
                        : isPassed
                        ? 'text-emerald-500'
                        : 'text-slate-500'
                    }`}
                  />
                </div>
                <h4 className="text-sm font-bold leading-snug mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                {isPassed ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : isCurrent ? (
                  <span className="text-cyan-300 font-bold animate-pulse">Active State</span>
                ) : (
                  <span className="text-slate-500">Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
