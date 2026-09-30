import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Search, 
  MapPin, 
  Clock, 
  Utensils, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { MatchingScoreModal } from '../components/common/MatchingScoreModal';
import type { FoodDonation } from '../types';
import { matchingEngine } from '../services/matchingEngine';

export const NGODashboard: React.FC = () => {
  const { currentUser, donations, acceptDonation, setActiveView } = useApp();
  
  // Discovery Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [maxDistance, setMaxDistance] = useState<number>(25); // km
  const [selectedDonationForModal, setSelectedDonationForModal] = useState<FoodDonation | null>(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);

  const availableDonations = donations.filter(d => d.status === 'Available' || d.status === 'Matching');
  const acceptedByMe = donations.filter(d => d.matchedNgoId === currentUser.id || d.matchedNgoName === currentUser.name);
  const completedByMe = acceptedByMe.filter(d => d.status === 'Completed');
  const pendingRequests = acceptedByMe.filter(d => d.status === 'Accepted' || d.status === 'Pickup Scheduled' || d.status === 'In Transit');

  const filteredDiscovery = availableDonations.filter(d => {
    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
    const compat = matchingEngine.calculateCompatibility(d, currentUser);
    if (compat.distanceKm > maxDistance) return false;
    return true;
  });

  const handleOpenMatchingBreakdown = (donation: FoodDonation) => {
    setSelectedDonationForModal(donation);
    setIsMatchingModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* NGO Dashboard Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&h=150&fit=crop'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h1>
                <VerificationBadge status={currentUser.verificationStatus} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Serviced Areas: {currentUser.servicedAreas?.join(', ') || 'Metropolitan Hubs'} • Capacity: <span className="font-mono font-bold text-emerald-500">{currentUser.capacityMealsPerDay || 500} meals/day</span>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Non-Profit Wallet: {currentUser.walletAddress?.slice(0, 6)}...{currentUser.walletAddress?.slice(-4)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('logistics')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4 text-cyan-400" />
              Active Logistics ({pendingRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Available Surplus"
          value={availableDonations.length}
          subtitle="Ready for NGO discovery"
          icon={Utensils}
          color="cyan"
        />
        <StatCard
          title="Accepted Donations"
          value={acceptedByMe.length}
          subtitle="Total accepted by this NGO"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Active Logistics"
          value={pendingRequests.length}
          subtitle="Pickups & in-transit food"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Deliveries"
          value={completedByMe.length}
          subtitle="Distributed to beneficiaries"
          icon={HeartHandshake}
          color="purple"
        />
      </div>

      {/* DONATION DISCOVERY SECTION */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-500" />
              Surplus Food Discovery Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic P2P matching ranks available food by compatibility score
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Max Distance:</span>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value={5}>Within 5 km</option>
                <option value={15}>Within 15 km</option>
                <option value={25}>Within 25 km</option>
                <option value={50}>Within 50 km</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Bakery & Grains">Bakery & Grains</option>
                <option value="Dairy & Refrigerated">Dairy & Refrigerated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Discovery Cards Grid */}
        {filteredDiscovery.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Utensils className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No surplus food listings match filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting the max distance or category filter parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscovery.map((d) => {
              const compat = matchingEngine.calculateCompatibility(d, currentUser);

              return (
                <div
                  key={d.id}
                  className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between shadow-sm group"
                >
                  <div>
                    {/* Food Image & Badge */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={d.imageUrl}
                        alt={d.foodName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-navy-950/90 border border-cyan-400 text-cyan-300 text-xs font-bold font-mono shadow-glow-cyan">
                        {compat.overallScore}% MATCH
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-navy-950/80 backdrop-blur text-white text-[11px] font-medium border border-slate-700">
                        {d.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-cyan-500 font-bold">{d.id}</span>
                        <VerificationBadge status={d.donorVerificationStatus} />
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {d.foodName}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {d.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 font-medium">
                        <div className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Quantity</span>
                          <span className="font-bold text-slate-900 dark:text-white">{d.quantity} {d.unit}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Distance</span>
                          <span className="font-bold text-slate-900 dark:text-white">{compat.distanceKm} km away</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                          <span className="truncate">{d.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>Pickup Deadline: {d.pickupDeadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenMatchingBreakdown(d)}
                      className="text-xs text-slate-500 hover:text-cyan-400 underline underline-offset-2 font-mono"
                    >
                      Score Info
                    </button>
                    <button
                      onClick={() => handleOpenMatchingBreakdown(d)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-colors"
                    >
                      <span>View & Accept</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MATCHING ENGINE BREAKDOWN & ACCEPT MODAL */}
      <MatchingScoreModal
        donation={selectedDonationForModal}
        ngo={currentUser}
        isOpen={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        onAccept={() => {
          if (selectedDonationForModal) {
            acceptDonation(selectedDonationForModal.id);
          }
        }}
      />

    </div>
  );
};
