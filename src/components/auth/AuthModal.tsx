import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Lock, Wallet, Utensils, HeartHandshake, Shield, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { users, setCurrentUser, connectWallet, setActiveView, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<'donor' | 'ngo' | 'admin'>('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = users.find(u => u.role === selectedRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      showToast(`Logged in as ${matchedUser.name} (${selectedRole.toUpperCase()})`, 'success');
      if (selectedRole === 'donor') setActiveView('donor');
      else if (selectedRole === 'ngo') setActiveView('ngo');
      else setActiveView('admin');
      onClose();
    }
  };

  const handleWalletAuth = async () => {
    await connectWallet();
    const matchedUser = users.find(u => u.role === selectedRole) || users[0];
    setCurrentUser(matchedUser);
    showToast(`Wallet authenticated! Logged in as ${matchedUser.name}`, 'success');
    if (selectedRole === 'donor') setActiveView('donor');
    else if (selectedRole === 'ngo') setActiveView('ngo');
    else setActiveView('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to FoodBridge</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Access role-specific decentralized dashboard</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-100 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole('donor')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'donor'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ngo')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'ngo'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>NGO</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'admin'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Web3 Direct Wallet Auth */}
        <button
          onClick={handleWalletAuth}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-navy-900 to-navy-950 border border-cyan-500/40 text-cyan-400 hover:border-cyan-400 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-glow-cyan mb-4 transition-all"
        >
          <Wallet className="w-4 h-4 text-cyan-400" />
          <span>Connect MetaMask / Web3 Wallet</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase font-mono">Or Email Demo Sign-In</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email || (selectedRole === 'donor' ? 'donor@freshbite.org' : selectedRole === 'ngo' ? 'ngo@hopefoundation.org' : 'admin@foodbridge.io')}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password || 'demo12345'}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
          >
            <CheckCircle2 className="w-4 h-4" />
            Enter {selectedRole.toUpperCase()} Dashboard
          </button>
        </form>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-navy-950 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Demo mode pre-fills credentials for instant interactive evaluation.
        </div>
      </div>
    </div>
  );
};
