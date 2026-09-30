export type UserRole = 'donor' | 'ngo' | 'admin' | 'guest';

export type VerificationStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export type DonationStatus = 
  | 'Available'
  | 'Matching'
  | 'NGO Review'
  | 'Accepted'
  | 'Pickup Scheduled'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgType: string; // e.g. 'Restaurant', 'Hotel', 'Supermarket', 'Non-Profit Organization'
  regId?: string;
  contactPerson: string;
  phone: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  verificationStatus: VerificationStatus;
  walletAddress?: string;
  capacityMealsPerDay?: number;
  servicedAreas?: string[];
  avatarUrl?: string;
}

export interface FoodDonation {
  id: string; // e.g. 'FB-2026-00142'
  numericId: number;
  donorId: string;
  donorName: string;
  donorOrgType: string;
  donorVerificationStatus: VerificationStatus;
  foodName: string;
  category: 'Prepared Meals' | 'Fresh Produce' | 'Bakery & Grains' | 'Dairy & Refrigerated' | 'Packaged Foods' | 'Beverages';
  quantity: number;
  unit: 'meals' | 'kg' | 'boxes' | 'items' | 'liters';
  description: string;
  preparationTime: string;
  expiryTime: string;
  pickupLocation: string;
  lat: number;
  lng: number;
  pickupDeadline: string;
  storageCondition: 'Ambient / Room Temp' | 'Refrigerated (2-4°C)' | 'Frozen (-18°C)' | 'Hot Holding (>60°C)';
  imageUrl: string;
  specialInstructions?: string;
  matchedNgoId?: string;
  matchedNgoName?: string;
  ngoVerificationStatus?: VerificationStatus;
  status: DonationStatus;
  ipfsHash: string;
  transactionHash?: string;
  blockNumber?: number;
  compatibilityScore?: number;
  createdAt: string;
  acceptedAt?: string;
  pickupTime?: string;
  deliveredAt?: string;
  completedAt?: string;
}

export interface CompatibilityBreakdown {
  overallScore: number;
  locationScore: number;
  foodTypeScore: number;
  quantityScore: number;
  urgencyScore: number;
  capacityScore: number;
  distanceKm: number;
  reasons: string[];
}

export interface MatchResult {
  ngoId: string;
  ngoName: string;
  ngoAddress: string;
  compatibility: CompatibilityBreakdown;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  eventType: 'DonationCreated' | 'DonationMatched' | 'DonationAccepted' | 'PickupConfirmed' | 'DeliveryConfirmed' | 'DonationCompleted';
  donationId: string;
  fromAddress: string;
  toAddress: string;
  status: 'Confirmed' | 'Pending' | 'Demo';
  gasUsed: string;
  ipfsHash?: string;
}

export interface LogisticsRecord {
  donationId: string;
  foodName: string;
  quantity: number;
  unit: string;
  donorName: string;
  donorAddress: string;
  donorLat: number;
  donorLng: number;
  ngoName: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  status: 'Pickup Assigned' | 'Driver En Route' | 'Food Picked Up' | 'In Transit' | 'NGO Received' | 'Completed';
  assignedDriver: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  pickupScheduled: string;
  estimatedArrival: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'blockchain';
  donationId?: string;
}
