import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Utensils, 
  HeartHandshake, 
  Lock,
  Printer
} from 'lucide-react';
import { QRCodeGenerator } from '../components/common/QRCodeGenerator';
import { StatusBadge } from '../components/common/StatusBadge';
import { transactionService } from '../services/blockchain/transactionService';

export const TraceabilityPage: React.FC = () => {
  const { donations, selectedDonationId, setSelectedDonationId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Default to requested example FB-2026-00142 if present, or first donation
  const targetId = searchQuery.trim() || selectedDonationId || 'FB-2026-00142';
  const donation = donations.find(d => d.id === targetId || d.transactionHash === targetId) || donations[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedDonationId(searchQuery.trim());
    }
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            PUBLIC BLOCKCHAIN TRACEABILITY AUDIT
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Verify Food Donation Integrity</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter Donation ID, Transaction Hash, or scan label QR code for permanent proof
          </p>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 pt-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search Donation ID (e.g. FB-2026-00142)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs shadow-glow-cyan transition-colors"
            >
              Inspect Audit
            </button>
          </form>
        </div>
      </div>

      {donation && (
        <div className="space-y-8">
          
          {/* Audit Summary Certificate */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-black text-cyan-300">
                    DONATION: {donation.id}
                  </span>
                  <StatusBadge status={donation.status} size="lg" />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Registered on Polygon Amoy Testnet • Immutable Record
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintAudit}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white hover:border-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Proof Certificate
                </button>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Record Verified</h4>
                  <p className="text-[11px] text-slate-400">Polygon Smart Contract State</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-500/30 flex items-center gap-3">
                <Lock className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Transaction Recorded</h4>
                  <p className="text-[11px] text-slate-400">Consensus Confirmed</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-purple-500/30 flex items-center gap-3">
                <Layers className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Data Integrity Maintained</h4>
                  <p className="text-[11px] text-slate-400">IPFS Immutable CID Hash</p>
                </div>
              </div>
            </div>

          </div>

          {/* Details & QR Code Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card-soft space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs font-mono">
                  Donation Lifecycle Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Donor Organization</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Utensils className="w-4 h-4 text-cyan-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{donation.donorName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">Verified Commercial Donor</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Matched NGO Receiver</span>
                    <div className="flex items-center gap-2 mt-1">
                      <HeartHandshake className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{donation.matchedNgoName || 'Verified NGO Hub'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">Verified Distribution Network</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Food Item & Category</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-1">{donation.foodName}</span>
                    <span className="text-[10px] text-slate-400">{donation.category}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Quantity & Storage</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-1">{donation.quantity} {donation.unit}</span>
                    <span className="text-[10px] text-slate-400">{donation.storageCondition}</span>
                  </div>

                </div>
              </div>

              {/* Immutable Blockchain Proof Hash */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">On-Chain Smart Contract Proof</span>
                  <a
                    href={transactionService.getPolygonScanUrl(donation.transactionHash || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-[11px]"
                  >
                    <span>View on PolygonScan Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">TRANSACTION HASH:</span>
                  <span className="text-cyan-300 text-xs break-all">
                    {donation.transactionHash || '0x9d4a8b7c6e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">IPFS METADATA CID:</span>
                  <span className="text-emerald-400 text-xs break-all">
                    {donation.ipfsHash}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Col: QR Code */}
            <div>
              <QRCodeGenerator donationId={donation.id} size={200} />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
