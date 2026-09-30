import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import type { 
  UserProfile, 
  FoodDonation, 
  BlockchainTransaction, 
  LogisticsRecord, 
  SystemNotification,
  DonationStatus
} from '../types';
import { INITIAL_USERS, INITIAL_DONATIONS, INITIAL_TRANSACTIONS, INITIAL_LOGISTICS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { walletService } from '../services/blockchain/walletService';
import type { WalletState } from '../services/blockchain/walletService';
import { contractService } from '../services/blockchain/contractService';
import { ipfsService } from '../services/ipfsService';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  
  donations: FoodDonation[];
  addDonation: (donationData: Omit<FoodDonation, 'id' | 'numericId' | 'donorId' | 'donorName' | 'donorOrgType' | 'donorVerificationStatus' | 'status' | 'ipfsHash' | 'createdAt'>) => Promise<FoodDonation>;
  acceptDonation: (donationId: string, ngoId?: string, ngoName?: string) => Promise<void>;
  rejectDonation: (donationId: string) => void;
  updateDonationStatus: (donationId: string, newStatus: DonationStatus) => Promise<void>;
  
  runOneClickDemoFlow: () => Promise<void>;

  transactions: BlockchainTransaction[];
  logistics: LogisticsRecord[];
  
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  activeView: string;
  setActiveView: (view: string) => void;
  selectedDonationId: string | null;
  setSelectedDonationId: (id: string | null) => void;
  
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default to Donor
  const [wallet, setWallet] = useState<WalletState>(walletService.getInitialState());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  
  const [donations, setDonations] = useState<FoodDonation[]>(INITIAL_DONATIONS);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(INITIAL_TRANSACTIONS);
  const [logistics, setLogistics] = useState<LogisticsRecord[]>(INITIAL_LOGISTICS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const connectWallet = async () => {
    const newWalletState = await walletService.connectWallet();
    setWallet(newWalletState);
    showToast(`Wallet Connected: ${newWalletState.address?.slice(0, 6)}...${newWalletState.address?.slice(-4)}`, 'success');
  };

  const disconnectWallet = () => {
    const disconnected = walletService.disconnectWallet();
    setWallet(disconnected);
    showToast('Wallet disconnected', 'info');
  };

  const addDonation = async (formData: Omit<FoodDonation, 'id' | 'numericId' | 'donorId' | 'donorName' | 'donorOrgType' | 'donorVerificationStatus' | 'status' | 'ipfsHash' | 'createdAt'>): Promise<FoodDonation> => {
    const numericId = 143 + donations.length;
    const donationId = `FB-2026-00${numericId}`;

    // Upload metadata to IPFS
    const ipfsRes = await ipfsService.uploadDonationMetadata({
      id: donationId,
      donor: currentUser.name,
      food: formData.foodName,
      quantity: `${formData.quantity} ${formData.unit}`,
      category: formData.category,
      storage: formData.storageCondition
    });

    // Smart contract execution
    const { txHash, blockNumber, transaction } = await contractService.executeCreateDonationOnChain({
      id: donationId,
      ipfsHash: ipfsRes.ipfsUri,
      foodName: formData.foodName
    });

    const newDonation: FoodDonation = {
      ...formData,
      id: donationId,
      numericId,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorOrgType: currentUser.orgType,
      donorVerificationStatus: currentUser.verificationStatus,
      status: 'Available',
      ipfsHash: ipfsRes.ipfsUri,
      transactionHash: txHash,
      blockNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      compatibilityScore: 95
    };

    setDonations((prev) => [newDonation, ...prev]);
    setTransactions((prev) => [transaction, ...prev]);

    // Create Notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Surplus Donation Registered',
      message: `Donation #${donationId} saved to IPFS & minted on Polygon Amoy. Matching engine active.`,
      read: false,
      type: 'blockchain',
      donationId
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Donation ${donationId} created & recorded on blockchain!`, 'success');
    return newDonation;
  };

  const acceptDonation = async (donationId: string, ngoId?: string, ngoName?: string) => {
    const targetNgoId = ngoId || currentUser.id;
    const targetNgoName = ngoName || currentUser.name;

    const ngoUser = users.find(u => u.id === targetNgoId) || currentUser;

    const { transaction } = await contractService.executeAcceptDonationOnChain(donationId, ngoUser.walletAddress || '');

    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          return {
            ...item,
            status: 'Accepted',
            matchedNgoId: targetNgoId,
            matchedNgoName: targetNgoName,
            ngoVerificationStatus: ngoUser.verificationStatus,
            acceptedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            pickupTime: 'Today at 18:30 PM'
          };
        }
        return item;
      })
    );

    setTransactions((prev) => [transaction, ...prev]);

    // Automatically create a logistics tracking record
    const targetDonation = donations.find(d => d.id === donationId);
    if (targetDonation) {
      const newLogistics: LogisticsRecord = {
        donationId: targetDonation.id,
        foodName: targetDonation.foodName,
        quantity: targetDonation.quantity,
        unit: targetDonation.unit,
        donorName: targetDonation.donorName,
        donorAddress: targetDonation.pickupLocation,
        donorLat: targetDonation.lat || 37.7749,
        donorLng: targetDonation.lng || -122.4194,
        ngoName: targetNgoName,
        ngoAddress: ngoUser.address || '312 Community Hub Way',
        ngoLat: ngoUser.lat || 37.7600,
        ngoLng: ngoUser.lng || -122.4250,
        currentStep: 2,
        status: 'Pickup Assigned',
        assignedDriver: {
          name: 'David Miller (EcoDispatch)',
          phone: '+1 (555) 321-9988',
          vehicleNumber: 'EV-GREEN-08'
        },
        pickupScheduled: 'Today, 18:30 PM',
        estimatedArrival: 'Today, 19:15 PM'
      };
      setLogistics((prev) => [newLogistics, ...prev]);
    }

    // Add notification
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Donation Accepted!',
      message: `NGO ${targetNgoName} accepted donation #${donationId}. Smart contract agreement locked.`,
      read: false,
      type: 'success',
      donationId
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Donation ${donationId} accepted by ${targetNgoName}`, 'success');
  };

  const rejectDonation = (donationId: string) => {
    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          return { ...item, status: 'Available', matchedNgoId: undefined, matchedNgoName: undefined };
        }
        return item;
      })
    );
    showToast(`Donation ${donationId} rejected. Returned to available pool.`, 'info');
  };

  const updateDonationStatus = async (donationId: string, newStatus: DonationStatus) => {
    if (newStatus === 'In Transit') {
      const res = await contractService.executeConfirmPickupOnChain(donationId);
      setTransactions((prev) => [res.transaction, ...prev]);
    } else if (newStatus === 'Completed') {
      const res = await contractService.executeCompleteDonationOnChain(donationId);
      setTransactions((prev) => [res.transaction, ...prev]);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {
        // Ignore if canvas fails
      }
    }

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          return {
            ...d,
            status: newStatus,
            completedAt: newStatus === 'Completed' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : d.completedAt
          };
        }
        return d;
      })
    );

    // Update logistics step
    setLogistics((prev) =>
      prev.map((log) => {
        if (log.donationId === donationId) {
          let step: 1 | 2 | 3 | 4 | 5 | 6 | 7 = log.currentStep;
          let statusText: any = log.status;
          if (newStatus === 'In Transit') {
            step = 4;
            statusText = 'In Transit';
          } else if (newStatus === 'Delivered') {
            step = 6;
            statusText = 'NGO Received';
          } else if (newStatus === 'Completed') {
            step = 7;
            statusText = 'Completed';
          }
          return { ...log, currentStep: step, status: statusText };
        }
        return log;
      })
    );

    showToast(`Status updated to '${newStatus}' for ${donationId}`, 'success');
  };

  /**
   * 1-Click Interactive Demo Flow:
   * Auto-creates, auto-matches, auto-accepts, executes smart contract, and opens QR Traceability!
   */
  const runOneClickDemoFlow = async () => {
    showToast('🚀 Running 1-Click Interactive Demo Workflow...', 'info');

    // 1. Create donation
    const numericId = 143 + donations.length;
    const donationId = `FB-2026-00${numericId}`;

    const ipfsRes = await ipfsService.uploadDonationMetadata({
      id: donationId,
      donor: 'FreshBite Restaurant',
      food: '150 Portions Chef\'s Special Gourmet Pasta & Salad Bowls',
      quantity: '150 meals',
      category: 'Prepared Meals',
      storage: 'Refrigerated (2-4°C)'
    });

    const { txHash, blockNumber, transaction } = await contractService.executeCreateDonationOnChain({
      id: donationId,
      ipfsHash: ipfsRes.ipfsUri,
      foodName: '150 Portions Chef\'s Special Gourmet Pasta & Salad Bowls'
    });

    const autoDonation: FoodDonation = {
      id: donationId,
      numericId,
      donorId: 'donor-1',
      donorName: 'FreshBite Restaurant',
      donorOrgType: 'Restaurant',
      donorVerificationStatus: 'Verified',
      foodName: '150 Portions Chef\'s Special Gourmet Pasta & Salad Bowls',
      category: 'Prepared Meals',
      quantity: 150,
      unit: 'meals',
      description: 'Hot gourmet lunch buffet surplus packaged in biodegradable thermal containers.',
      preparationTime: '2026-09-30 12:00',
      expiryTime: '2026-10-01 02:00',
      pickupLocation: '452 Culinary Way, Kitchen Loading Bay',
      lat: 37.7749,
      lng: -122.4194,
      pickupDeadline: '2026-09-30 20:00',
      storageCondition: 'Refrigerated (2-4°C)',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      specialInstructions: 'Transport in refrigerated EV truck.',
      matchedNgoId: 'ngo-1',
      matchedNgoName: 'Hope Foundation Relief',
      ngoVerificationStatus: 'Verified',
      status: 'Completed',
      ipfsHash: ipfsRes.ipfsUri,
      transactionHash: txHash,
      blockNumber,
      compatibilityScore: 96,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      acceptedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setDonations((prev) => [autoDonation, ...prev]);
    setTransactions((prev) => [transaction, ...prev]);

    // Confetti celebration
    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } catch (e) {
      // Ignore canvas error
    }

    setSelectedDonationId(donationId);
    setActiveView('traceability');
    showToast(`🎉 1-Click Workflow Complete! Donation #${donationId} minted, accepted & verified!`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        wallet,
        connectWallet,
        disconnectWallet,
        isDemoMode,
        setIsDemoMode,
        donations,
        addDonation,
        acceptDonation,
        rejectDonation,
        updateDonationStatus,
        runOneClickDemoFlow,
        transactions,
        logistics,
        notifications,
        markNotificationRead,
        clearNotifications,
        activeView,
        setActiveView,
        selectedDonationId,
        setSelectedDonationId,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
