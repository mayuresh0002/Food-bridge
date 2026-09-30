import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Utensils, 
  HeartHandshake, 
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { users, setUsers, donations, transactions, showToast, setActiveView, setSelectedDonationId } = useApp();
  const [activeTab, setActiveTab] = useState<'verifications' | 'donations' | 'users' | 'transactions'>('verifications');

  const donors = users.filter(u => u.role === 'donor');
  const ngos = users.filter(u => u.role === 'ngo');
  const verifiedNgosCount = ngos.filter(u => u.verificationStatus === 'Verified').length;
  const verifiedDonorsCount = donors.filter(u => u.verificationStatus === 'Verified').length;
  const completedDeliveriesCount = donations.filter(d => d.status === 'Completed').length;

  const handleVerifyUser = (userId: string, newStatus: 'Verified' | 'Rejected') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: newStatus } : u));
    showToast(`User verification updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl text-slate-950 font-bold shadow-glow-cyan">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PLATFORM GOVERNANCE & ADMIN PANEL</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identity Verification, Audit Log & Smart Contract Oversight
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Surplus Donations"
          value={donations.length}
          subtitle="System wide listings"
          icon={Utensils}
          color="cyan"
        />
        <StatCard
          title="Verified NGOs"
          value={verifiedNgosCount}
          subtitle="Non-profit entities"
          icon={HeartHandshake}
          color="emerald"
        />
        <StatCard
          title="Verified Donors"
          value={verifiedDonorsCount}
          subtitle="Commercial food partners"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Completed Deliveries"
          value={completedDeliveriesCount}
          subtitle="Immutable record logged"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Main Admin Tabbed Box */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'verifications'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Verification Requests Queue
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'donations'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Donation Audit ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'users'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Platform Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'transactions'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              On-Chain Audit Log ({transactions.length})
            </button>
          </div>

        </div>

        {/* TAB 1: VERIFICATIONS QUEUE */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Pending & Active Identity Verifications
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Entity Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Org Type</th>
                    <th className="py-3 px-4">Registration ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-navy-950/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="py-4 px-4 uppercase font-mono font-bold text-cyan-500">
                        {u.role}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {u.orgType}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400">
                        {u.regId || 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <VerificationBadge status={u.verificationStatus} />
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {u.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => handleVerifyUser(u.id, 'Verified')}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                          >
                            Approve & Verify
                          </button>
                        )}
                        {u.verificationStatus !== 'Rejected' && (
                          <button
                            onClick={() => handleVerifyUser(u.id, 'Rejected')}
                            className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white font-semibold rounded-lg text-xs"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DONATIONS AUDIT */}
        {activeTab === 'donations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Donation ID</th>
                  <th className="py-3 px-4">Food Name</th>
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Matched NGO</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-navy-950/40">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-500">{d.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{d.foodName}</td>
                    <td className="py-3 px-4 text-slate-400">{d.donorName}</td>
                    <td className="py-3 px-4 text-emerald-400">{d.matchedNgoName || 'Pending'}</td>
                    <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDonationId(d.id);
                          setActiveView('traceability');
                        }}
                        className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold"
                      >
                        Inspect Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: USERS LIST */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">User / Org Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                    <td className="py-3 px-4 font-mono uppercase text-cyan-400">{u.role}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{u.walletAddress?.slice(0, 8)}...</td>
                    <td className="py-3 px-4"><VerificationBadge status={u.verificationStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: TRANSACTIONS AUDIT LOG */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Tx Hash</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Donation ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.hash}>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{tx.hash.slice(0, 12)}...</td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">{tx.eventType}</td>
                    <td className="py-3 px-4 text-slate-300">{tx.donationId}</td>
                    <td className="py-3 px-4 text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 px-4"><span className="text-emerald-400 font-bold">{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
