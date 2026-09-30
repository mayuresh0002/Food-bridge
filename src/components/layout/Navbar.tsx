import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Utensils, 
  Wallet, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  QrCode,
  Zap
} from 'lucide-react';
import { transactionService } from '../../services/blockchain/transactionService';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenQRScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQRScanner }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    wallet, 
    connectWallet, 
    disconnectWallet,
    notifications,
    markNotificationRead,
    clearNotifications,
    activeView, 
    setActiveView,
    runOneClickDemoFlow
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'donor', label: 'Donor Dashboard' },
    { id: 'ngo', label: 'NGO Discovery' },
    { id: 'matching', label: 'Matching Engine' },
    { id: 'blockchain', label: 'Blockchain & Contracts' },
    { id: 'traceability', label: 'Traceability' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'admin', label: 'Admin Panel' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-electric-500 rounded-2xl shadow-glow-cyan text-slate-950 font-bold">
              <Utensils className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  FOOD<span className="text-cyan-400">BRIDGE</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  WEB3 P2P
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono">
                Decentralized Surplus Food Allocation
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: 1-Click Demo, Role Selector, Notifications, QR Scanner, Wallet Connect */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick 1-Click Demo Flow Button */}
            <button
              onClick={runOneClickDemoFlow}
              title="Run 1-Click Automated Demo Workflow"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>1-Click Demo</span>
            </button>

            {/* Quick QR Scanner Button */}
            <button
              onClick={onOpenQRScanner}
              title="Scan Food Container QR Code"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-800 transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white hover:border-slate-700 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-semibold truncate max-w-[110px] sm:max-w-none">
                  {currentUser.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-slate-800 text-cyan-400">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-navy-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
                    Switch Active User Role (Demo)
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setRoleDropdownOpen(false);
                        if (u.role === 'donor') setActiveView('donor');
                        else if (u.role === 'ngo') setActiveView('ngo');
                        else if (u.role === 'admin') setActiveView('admin');
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        currentUser.id === u.id ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.orgType}</div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 max-h-96 overflow-y-auto animate-fade-in">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Notifications ({notifications.length})
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer text-xs transition-colors ${
                          !n.read ? 'bg-cyan-500/5' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Wallet Connect Button */}
            <button
              onClick={wallet.isConnected ? disconnectWallet : connectWallet}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                wallet.isConnected
                  ? 'bg-gradient-to-r from-navy-900 to-navy-950 border border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-glow-cyan'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">
                {wallet.isConnected
                  ? transactionService.formatTxHash(wallet.address || '')
                  : 'Connect Wallet'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-950 border-b border-slate-800 px-4 py-4 space-y-2 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeView === item.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              runOneClickDemoFlow();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            ⚡ Run 1-Click Auto Demo Flow
          </button>
        </div>
      )}
    </header>
  );
};
