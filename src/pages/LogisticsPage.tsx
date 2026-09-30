import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  Phone, 
  ShieldCheck
} from 'lucide-react';
import { LeafletMap } from '../components/common/LeafletMap';

export const LogisticsPage: React.FC = () => {
  const { logistics, updateDonationStatus, setActiveView, setSelectedDonationId } = useApp();

  const activeLogisticsItem = logistics[0] || {
    donationId: 'FB-2026-00142',
    foodName: 'Prepared Surplus Meals',
    quantity: 120,
    unit: 'meals',
    donorName: 'FreshBite Restaurant',
    donorAddress: '452 Culinary Way, Downtown',
    donorLat: 37.7749,
    donorLng: -122.4194,
    ngoName: 'Hope Foundation Relief',
    ngoAddress: '104 Charity Square, Eastside',
    ngoLat: 37.7700,
    ngoLng: -122.4100,
    currentStep: 3,
    status: 'Food Picked Up',
    assignedDriver: {
      name: 'Carlos Mendez (EcoDispatch)',
      phone: '+1 (555) 443-8821',
      vehicleNumber: 'EV-RESCUE-04'
    },
    pickupScheduled: '18:30 PM',
    estimatedArrival: '19:15 PM'
  };

  const stepsList = [
    { step: 1, label: 'Donor Created Listing' },
    { step: 2, label: 'Pickup Assigned' },
    { step: 3, label: 'Driver En Route' },
    { step: 4, label: 'Food Picked Up' },
    { step: 5, label: 'In Transit' },
    { step: 6, label: 'NGO Received' },
    { step: 7, label: 'Completed' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-slate-950 font-bold shadow-glow-cyan">
              <Truck className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">COLD-CHAIN LOGISTICS MODULE</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  REAL-TIME DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Active Shipment: <span className="font-mono font-bold text-cyan-500">{activeLogisticsItem.donationId}</span> • EV Thermal Fleet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Timeline & Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline Visual specified in prompt section 13 */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                  DONATION SHIPMENT #{activeLogisticsItem.donationId}
                </span>
                <h3 className="text-lg font-bold text-white">Live Logistics Timeline</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                Status: {activeLogisticsItem.status}
              </span>
            </div>

            {/* Steps Progress Line */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {stepsList.map((s) => {
                  const isPassed = s.step < activeLogisticsItem.currentStep;
                  const isCurrent = s.step === activeLogisticsItem.currentStep;

                  return (
                    <div
                      key={s.step}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-glow-cyan'
                          : isPassed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono block mb-1">Step {s.step}</span>
                      <span className="text-xs leading-tight block">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulator Action Buttons for Demo */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">Demo Controls: Advance Shipment Status</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateDonationStatus(activeLogisticsItem.donationId, 'In Transit')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-semibold"
                >
                  Set In Transit
                </button>
                <button
                  onClick={() => updateDonationStatus(activeLogisticsItem.donationId, 'Completed')}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Mark Completed
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Route Map */}
          <LeafletMap
            donorName={activeLogisticsItem.donorName}
            ngoName={activeLogisticsItem.ngoName}
            height="360px"
          />

        </div>

        {/* Right Col: Driver & Details */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card-soft space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Assigned Logistics Partner
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeLogisticsItem.assignedDriver.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Vehicle: {activeLogisticsItem.assignedDriver.vehicleNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Contact:</span>
                <span className="font-mono text-cyan-500 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {activeLogisticsItem.assignedDriver.phone}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-navy-950 rounded-xl">
                <span className="text-slate-400">Scheduled Pickup:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeLogisticsItem.pickupScheduled}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 dark:bg-navy-950 rounded-xl">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-bold text-cyan-500">{activeLogisticsItem.estimatedArrival}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 dark:bg-navy-950 rounded-xl">
                <span className="text-slate-400">Cargo Specs:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeLogisticsItem.quantity} {activeLogisticsItem.unit} ({activeLogisticsItem.foodName})
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDonationId(activeLogisticsItem.donationId);
                setActiveView('traceability');
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <ShieldCheck className="w-4 h-4" />
              View Immutable QR Audit Link
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
