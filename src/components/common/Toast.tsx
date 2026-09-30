import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    error: <ShieldAlert className="w-5 h-5 text-rose-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-navy-950 text-white',
    info: 'border-cyan-500/40 bg-navy-950 text-white',
    warning: 'border-amber-500/40 bg-navy-950 text-white',
    error: 'border-rose-500/40 bg-navy-950 text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md max-w-md ${borders[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-xs font-semibold">{toast.message}</p>
      </div>
    </div>
  );
};
