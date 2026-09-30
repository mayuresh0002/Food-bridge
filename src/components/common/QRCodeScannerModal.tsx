import React, { useState } from 'react';
import { X, QrCode, Camera, CheckCircle2, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (donationId: string) => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const { donations } = useApp();
  const [manualInput, setManualInput] = useState('');

  if (!isOpen) return null;

  const handleSimulatedScan = (id: string) => {
    onScanSuccess(id);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl border border-cyan-500/20">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code Traceability Scanner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scan food container label to verify authenticity</p>
          </div>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/50 flex flex-col items-center justify-center text-center p-4 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

          {/* Scanner laser line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-cyan-400 shadow-glow-cyan animate-pulse" style={{ animationDuration: '2s' }}></div>

          <Camera className="w-12 h-12 text-cyan-400/80 mb-2 animate-bounce" />
          <p className="text-xs font-mono text-cyan-300 font-medium">Position QR Code within Viewfinder</p>
          <span className="text-[10px] text-slate-400 mt-1">Optical Camera Feed Active (Demo Simulation)</span>
        </div>

        {/* Quick select demo donation IDs */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Quick Test Demo Code Scan:
          </p>
          <div className="flex flex-wrap gap-2">
            {donations.slice(0, 3).map((d) => (
              <button
                key={d.id}
                onClick={() => handleSimulatedScan(d.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                {d.id}
              </button>
            ))}
          </div>
        </div>

        {/* Manual lookup input */}
        <form onSubmit={handleManualSubmit} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="e.g. FB-2026-00142"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};
