import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Wallet, 
  FileCode2, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Copy,
  Check
} from 'lucide-react';
import { transactionService } from '../services/blockchain/transactionService';
import { CONTRACT_ADDRESS } from '../services/blockchain/contractService';
import type { BlockchainTransaction } from '../types';

export const BlockchainDashboard: React.FC = () => {
  const { wallet, transactions, isDemoMode } = useApp();
  const [searchTxHash, setSearchTxHash] = useState('');
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(transactions[0] || null);
  const [copied, setCopied] = useState(false);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTxList = transactions.filter((tx) => {
    if (!searchTxHash) return true;
    return (
      tx.hash.toLowerCase().includes(searchTxHash.toLowerCase()) ||
      tx.donationId.toLowerCase().includes(searchTxHash.toLowerCase()) ||
      tx.eventType.toLowerCase().includes(searchTxHash.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-cyan-500 to-electric-500 rounded-2xl text-slate-950 font-bold shadow-glow-cyan">
              <Layers className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">POLYGON AMOY TESTNET & SMART CONTRACTS</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {isDemoMode ? 'DEMO SIMULATION' : 'LIVE TESTNET'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                FoodBridgeDonation.sol • Decentralized Escrow & Verification State Machine
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Network info */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card-soft">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Active Network</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-base font-bold text-slate-900 dark:text-white">{wallet.network}</span>
          </div>
          <span className="text-xs font-mono text-slate-400 mt-2 block">Chain ID: {wallet.chainId || 80002}</span>
        </div>

        {/* Connected Wallet */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card-soft">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Active Signer Wallet</span>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
              {transactionService.formatTxHash(wallet.address || '0x742d35Cc6634C0532925a3b844Bc454e443891FA')}
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-semibold mt-2 block">Balance: {wallet.balanceEth}</span>
        </div>

        {/* Smart Contract Address */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card-soft">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Deployed Contract</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {transactionService.formatTxHash(CONTRACT_ADDRESS)}
              </span>
            </div>
            <button
              onClick={handleCopyContract}
              className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-xs text-slate-400 mt-2 block">Solidity 0.8.20 Compliant</span>
        </div>

      </div>

      {/* SMART CONTRACT EVENT LIFECYCLE TIMELINE (Section 8 requirement) */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
              SOLIDITY EVENT SEQUENCE
            </span>
            <h2 className="text-xl font-bold mt-2">Smart Contract Transaction Timeline</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:block">Polygon Block Time: ~2.1s</span>
        </div>

        {/* Timeline visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { title: 'Donation Created', event: 'DonationCreated', icon: '1' },
            { title: 'Smart Contract Minted', event: 'IpfsMetadataPinned', icon: '2' },
            { title: 'NGO Verified', event: 'VerifyNgo', icon: '3' },
            { title: 'Donation Accepted', event: 'DonationAccepted', icon: '4' },
            { title: 'Pickup Triggered', event: 'PickupConfirmed', icon: '5' },
            { title: 'Delivery Confirmed', event: 'DonationCompleted', icon: '6' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-cyan-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                  {item.icon}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
              <span className="text-[10px] font-mono text-cyan-400 block">{item.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK BLOCK EXPLORER LOOKUP & TRANSACTION LOG TABLE */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Polygon Amoy Block Explorer Stream</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live verified smart contract event emissions</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Tx Hash or Donation ID..."
              value={searchTxHash}
              onChange={(e) => setSearchTxHash(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Tx Hash</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Donation ID</th>
                <th className="py-3 px-4">From Wallet</th>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredTxList.map((tx) => (
                <tr
                  key={tx.hash}
                  onClick={() => setSelectedTx(tx)}
                  className={`hover:bg-slate-50 dark:hover:bg-navy-950/40 cursor-pointer transition-colors ${
                    selectedTx?.hash === tx.hash ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-cyan-600 dark:text-cyan-400 font-bold">
                    {transactionService.formatTxHash(tx.hash, 4)}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">
                    {tx.eventType}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {tx.donationId}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {transactionService.formatTxHash(tx.fromAddress, 4)}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    #{tx.blockNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button className="text-xs text-cyan-500 hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Tx Detail Box */}
        {selectedTx && (
          <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">Transaction Inspector</span>
              <a
                href={transactionService.getPolygonScanUrl(selectedTx.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400"
              >
                <span>PolygonScan Explorer Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Transaction Hash:</span>
                <span className="text-white text-xs break-all">{selectedTx.hash}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">IPFS Content CID:</span>
                <span className="text-cyan-300 text-xs break-all">{selectedTx.ipfsHash || 'ipfs://QmW2X5T89v1ZpK7R3m4N8u9L2k1J5y6H7g8f9e0d1c2b3a'}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Gas Consumption:</span>
                <span className="text-emerald-400">{selectedTx.gasUsed}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Timestamp:</span>
                <span className="text-white">{selectedTx.timestamp}</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
