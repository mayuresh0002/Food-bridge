import React from 'react';
import type { DonationStatus } from '../../types';

interface StatusBadgeProps {
  status: DonationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Available':
      badgeStyle = 'bg-cyan-500/10 text-cyan-700 border-cyan-300 dark:text-cyan-300 dark:border-cyan-800';
      break;
    case 'Matching':
      badgeStyle = 'bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-800 animate-pulse-subtle';
      break;
    case 'NGO Review':
      badgeStyle = 'bg-indigo-500/10 text-indigo-700 border-indigo-300 dark:text-indigo-300 dark:border-indigo-800';
      break;
    case 'Accepted':
      badgeStyle = 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-800';
      break;
    case 'Pickup Scheduled':
      badgeStyle = 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-800';
      break;
    case 'In Transit':
      badgeStyle = 'bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-800';
      break;
    case 'Delivered':
      badgeStyle = 'bg-teal-500/10 text-teal-700 border-teal-300 dark:text-teal-300 dark:border-teal-800';
      break;
    case 'Completed':
      badgeStyle = 'bg-emerald-600/15 text-emerald-600 border-emerald-400 font-bold dark:text-emerald-400';
      break;
    case 'Cancelled':
      badgeStyle = 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-800';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeStyle} ${sizeClasses[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
