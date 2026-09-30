import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Filter
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { VerificationBadge } from '../components/common/VerificationBadge';
import type { FoodDonation } from '../types';

export const DonorDashboard: React.FC = () => {
  const { currentUser, donations, addDonation, setActiveView, setSelectedDonationId } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'list'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodDonation['category']>('Prepared Meals');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<FoodDonation['unit']>('meals');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('2026-09-29 14:00');
  const [expiryTime, setExpiryTime] = useState('2026-09-30 02:00');
  const [pickupLocation, setPickupLocation] = useState(currentUser.address || '452 Culinary Way, Kitchen Dock');
  const [pickupDeadline, setPickupDeadline] = useState('2026-09-29 20:00');
  const [storageCondition, setStorageCondition] = useState<FoodDonation['storageCondition']>('Refrigerated (2-4°C)');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter donor's own donations
  const myDonations = donations.filter(d => d.donorId === currentUser.id || d.donorName === currentUser.name);

  const activeDonations = myDonations.filter(d => d.status !== 'Completed' && d.status !== 'Cancelled').length;
  const completedDonations = myDonations.filter(d => d.status === 'Completed').length;
  const pendingMatches = myDonations.filter(d => d.status === 'Available' || d.status === 'Matching').length;
  const foodSavedKg = myDonations.reduce((acc, d) => acc + (d.unit === 'kg' ? d.quantity : d.quantity * 0.4), 0);

  const filteredList = myDonations.filter(d => {
    if (statusFilter === 'ALL') return true;
    return d.status === statusFilter;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDonation({
        foodName,
        category,
        quantity: Number(quantity),
        unit,
        description,
        preparationTime,
        expiryTime,
        pickupLocation,
        lat: currentUser.lat || 37.7749,
        lng: currentUser.lng || -122.4194,
        pickupDeadline,
        storageCondition,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
        specialInstructions
      });
      setActiveTab('list');
    } catch (err) {
      console.error('Donation creation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Dashboard Top Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h1>
                <VerificationBadge status={currentUser.verificationStatus} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentUser.orgType} • Reg: <span className="font-mono">{currentUser.regId}</span>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Wallet: {currentUser.walletAddress?.slice(0, 6)}...{currentUser.walletAddress?.slice(-4)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Overview Stats
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'create'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Create Donation
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              My Donations ({myDonations.length})
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: OVERVIEW CARDS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Donations"
              value={activeDonations}
              subtitle="In matching / transit pipeline"
              icon={Utensils}
              color="cyan"
            />
            <StatCard
              title="Completed Donations"
              value={completedDonations}
              subtitle="Immutable delivery verified"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Pending Matches"
              value={pendingMatches}
              subtitle="Scanning nearby NGOs"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Food Saved"
              value={`${Math.round(foodSavedKg)} kg`}
              subtitle="Prevented from landfills"
              icon={Layers}
              color="purple"
            />
          </div>

          {/* Quick Action Banner */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-2xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                PROMOTING ZERO WASTAGE
              </span>
              <h3 className="text-xl font-bold">Have Surplus Food Available Right Now?</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Register listing details to immediately trigger FoodBridge's deterministic P2P matching engine and notify nearby verified non-profit organizations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-cyan whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              Post Surplus Donation
            </button>
          </div>
        </div>
      )}

      {/* SECTION B: CREATE DONATION FORM */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-cyan-500" />
                Register Surplus Food Listing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Metadata will be pinned to IPFS & minted on Polygon Amoy Smart Contract
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Food Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Portions Gourmet Vegetable Lasagna & Salad"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Food Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Prepared Meals">Prepared Meals</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Bakery & Grains">Bakery & Grains</option>
                  <option value="Dairy & Refrigerated">Dairy & Refrigerated</option>
                  <option value="Packaged Foods">Packaged Foods</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Measurement Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="meals">meals</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                  <option value="items">items</option>
                  <option value="liters">liters</option>
                </select>
              </div>

              {/* Storage Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Refrigerated (2-4°C)">Refrigerated (2-4°C)</option>
                  <option value="Ambient / Room Temp">Ambient / Room Temp</option>
                  <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                  <option value="Hot Holding (>60°C)">Hot Holding (&gt;60°C)</option>
                </select>
              </div>

              {/* Expiry Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry / Use-By Timestamp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="YYYY-MM-DD HH:MM"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Timestamp
                </label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD HH:MM"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Pickup Deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pickup Deadline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="YYYY-MM-DD HH:MM"
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pickup Address & Bay Location *
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Image URL / Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Food Quality Image URL / IPFS Media Link
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Food Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Food Description & Packaging Details
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Freshly prepared buffet surplus, individually boxed."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Special Handling Instructions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Transport in insulated thermal containers. Loading dock bay 2."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-cyan transition-all"
              >
                {isSubmitting ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Create Donation & Mint Smart Contract
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION C: MY DONATIONS TABLE & CARDS */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card-soft space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Food Surplus Listings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track smart contract state and recipient matches</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {['ALL', 'Available', 'Accepted', 'In Transit', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Render Table */}
          {filteredList.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Utensils className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No surplus food listings yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create your first donation and connect with a verified NGO distribution network.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Create First Donation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Donation ID</th>
                    <th className="py-3 px-4">Food Item</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">NGO Match</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Blockchain Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {filteredList.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-navy-950/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {d.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={d.imageUrl}
                            alt={d.foodName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{d.foodName}</span>
                            <span className="text-[10px] text-slate-400">{d.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {d.quantity} {d.unit}
                      </td>
                      <td className="py-4 px-4">
                        {d.matchedNgoName ? (
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {d.matchedNgoName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Searching NGO...</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                        {d.transactionHash ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed (Block #{d.blockNumber || 48921045})
                          </span>
                        ) : (
                          <span className="text-amber-500">Pending Mint</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedDonationId(d.id);
                            setActiveView('traceability');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          QR Trace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
