import React from 'react';
import type { VerificationStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  if (status === 'Verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        Verified
      </span>
    );
  }

  if (status === 'Pending Verification') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
        <Clock className="w-3.5 h-3.5 text-amber-500" />
        Pending Verification
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
      Rejected
    </span>
  );
};
