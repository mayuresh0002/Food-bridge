import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  Cpu, 
  CheckCircle2, 
  HeartHandshake, 
  Truck, 
  Layers, 
  Sparkles, 
  Lock, 
  Search, 
  TrendingUp, 
  Users
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { WorkflowProgress } from '../components/common/WorkflowProgress';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const IMPACT_CHART_DATA = [
  { month: 'Jan', meals: 1240, co2SavedKg: 850 },
  { month: 'Feb', meals: 2150, co2SavedKg: 1420 },
  { month: 'Mar', meals: 3400, co2SavedKg: 2100 },
  { month: 'Apr', meals: 4900, co2SavedKg: 3150 },
  { month: 'May', meals: 6800, co2SavedKg: 4500 },
  { month: 'Jun', meals: 9200, co2SavedKg: 6100 },
  { month: 'Jul', meals: 12500, co2SavedKg: 8300 },
];

export const LandingPage: React.FC = () => {
  const { setActiveView, donations } = useApp();
  const [activeNetworkStep, setActiveNetworkStep] = useState<number>(2);

  const completedCount = donations.filter(d => d.status === 'Completed' || d.status === 'Accepted').length;
  const totalMeals = donations.reduce((acc, d) => acc + d.quantity, 0);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        {/* Glow & grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px] opacity-15"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Decentralized Web3 Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans leading-tight">
              FOOD<span className="text-cyan-400">BRIDGE</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-200">
              “Connecting Surplus Food With Those Who Need It.”
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              A transparent, decentralized platform that connects food donors directly with verified distribution networks while creating an immutable, traceable blockchain record for every single donation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveView('donor')}
                className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
              >
                <Utensils className="w-4 h-4" />
                Donate Surplus Food
              </button>

              <button
                onClick={() => setActiveView('ngo')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-bold text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                Find Food / NGO
              </button>

              <button
                onClick={() => setActiveView('matching')}
                className="px-6 py-3.5 rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                Explore Matching Engine
              </button>
            </div>
          </div>

          {/* Interactive Hero Network Visualization required by section 4 */}
          <div className="mt-16 bg-navy-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                  Interactive Node Network
                </span>
                <h3 className="text-base font-bold text-white">Decentralized Allocation Flow</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                ✓ Polygon Amoy Consensus Ready
              </span>
            </div>

            {/* Visual Node Flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              
              {/* Step 1: Donor */}
              <div 
                onClick={() => setActiveNetworkStep(1)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNetworkStep === 1 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">1. Food Donor</h4>
                <p className="text-xs text-slate-400">Restaurants, Hotels, Supermarkets</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-cyan-400">Mints Listing IPFS Hash</span>
              </div>

              {/* Step 2: FoodBridge Network */}
              <div 
                onClick={() => setActiveNetworkStep(2)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNetworkStep === 2 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-electric-500/10 text-electric-400 border border-electric-500/30 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">2. FoodBridge Net</h4>
                <p className="text-xs text-slate-400">Smart Contract & Matching Engine</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-electric-400">Solidity Escrow Logic</span>
              </div>

              {/* Step 3: Verified NGO */}
              <div 
                onClick={() => setActiveNetworkStep(3)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNetworkStep === 3 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">3. Verified NGO</h4>
                <p className="text-xs text-slate-400">Shelters & Community Centers</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-emerald-400">On-Chain Sign Acceptance</span>
              </div>

              {/* Step 4: Logistics */}
              <div 
                onClick={() => setActiveNetworkStep(4)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNetworkStep === 4 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">4. Logistics</h4>
                <p className="text-xs text-slate-400">EV Thermal Dispatch Partners</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-amber-400">GPS Route Tracking</span>
              </div>

              {/* Step 5: Beneficiaries */}
              <div 
                onClick={() => setActiveNetworkStep(5)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeNetworkStep === 5 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">5. Beneficiaries</h4>
                <p className="text-xs text-slate-400">Food-Insecure Families</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-purple-400">QR Code Trace Verified</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Explicitly labeled as platform/demo metrics per prompt section 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Metrics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live system statistics (Demo Prototype Environment)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
              Live Seed Data Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Food Donations"
              value={donations.length}
              subtitle="Active & completed listings"
              icon={Utensils}
              trend="+28% this week"
              color="cyan"
            />
            <StatCard
              title="NGOs Connected"
              value="14 Verified"
              subtitle="Regional distribution hubs"
              icon={HeartHandshake}
              trend="100% Verified"
              color="emerald"
            />
            <StatCard
              title="Meals Redirected"
              value={`${totalMeals + 1420} Meals`}
              subtitle="Prevented from landfill waste"
              icon={TrendingUp}
              trend="+1,200 kg saved"
              color="blue"
            />
            <StatCard
              title="Successful Deliveries"
              value={`${completedCount + 89} Delivered`}
              subtitle="Immutable QR confirmed"
              icon={CheckCircle2}
              trend="99.4% SLA"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM & WHY DECENTRALIZATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card A: The Problem */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-card-soft flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-mono text-xs font-semibold">
                THE CHALLENGE
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-3">
                1/3rd of Global Food Is Wasted While Millions Face Insecurity
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Traditional surplus food donation suffers from fragmented coordination, lack of real-time visibility, opaque food safety records, and delay-prone manual allocation processes.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  High spoilage due to slow manual NGO matching.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Zero audit trail or donor tax credit proof.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Unverified intermediaries causing leakage.
                </li>
              </ul>
            </div>
          </div>

          {/* Card B: Why Decentralization */}
          <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl text-white flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
                THE BLOCKCHAIN SOLUTION
              </span>
              <h3 className="text-2xl font-bold text-white mt-4 mb-3">
                Why Decentralized Surplus Allocation?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                FoodBridge uses smart contracts, IPFS metadata, and deterministic P2P matching to eliminate middlemen, enforce immutable proof-of-delivery, and build zero-trust confidence.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <Lock className="w-5 h-5 text-cyan-400 mb-1" />
                  <h5 className="text-xs font-bold text-white">Immutable Audit</h5>
                  <p className="text-[11px] text-slate-400">Solidity smart contract log on Polygon</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <Layers className="w-5 h-5 text-emerald-400 mb-1" />
                  <h5 className="text-xs font-bold text-white">IPFS Storage</h5>
                  <p className="text-[11px] text-slate-400">Decentralized CIDs for food quality photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME 5-STAGE WORKFLOW COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkflowProgress currentStage={3} />
      </section>

      {/* 5. IMPACT DASHBOARD VISUALIZATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-card-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                SUSTAINABILITY ANALYTICS
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Environmental & Social Impact</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative meals redistributed and CO₂ footprint prevented</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={IMPACT_CHART_DATA}>
                <defs>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="meals" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorMeals)" name="Meals Saved" />
                <Area type="monotone" dataKey="co2SavedKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" name="CO₂ Prevented (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-cyan-500/30 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Eliminate Food Wastage?</h2>
            <p className="text-sm text-slate-300">
              Join the FoodBridge network today as a food donor, verified distribution NGO, or logistics partner.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveView('donor')}
                className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all"
              >
                Launch Donor Dashboard
              </button>
              <button
                onClick={() => setActiveView('traceability')}
                className="px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-bold text-sm transition-all"
              >
                Verify Traceability QR
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
