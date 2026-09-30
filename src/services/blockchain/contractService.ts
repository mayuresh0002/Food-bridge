import type { FoodDonation, BlockchainTransaction } from '../../types';

export const CONTRACT_ADDRESS = '0x8A2B9c3D4e5F607182930a4B5c6D7e8F901292BC';
export const NETWORK_NAME = 'Polygon Amoy Testnet';

export const contractService = {
  getContractDetails() {
    return {
      address: CONTRACT_ADDRESS,
      network: NETWORK_NAME,
      standard: 'ERC-FoodBridge-v1.0 (Solidity 0.8.20)',
      verificationStatus: 'Verified Source Code on Amoy PolygonScan',
      deployer: '0x000000000000000000000000000000000000ADMIN'
    };
  },

  /**
   * Generates a realistic mock transaction hash
   */
  generateTxHash(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Simulates calling the smart contract createDonation method
   */
  async executeCreateDonationOnChain(donation: Partial<FoodDonation>): Promise<{ txHash: string; blockNumber: number; transaction: BlockchainTransaction }> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated network latency

    const txHash = this.generateTxHash();
    const blockNumber = 48921150 + Math.floor(Math.random() * 50);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction: BlockchainTransaction = {
      hash: txHash,
      blockNumber,
      timestamp: now,
      eventType: 'DonationCreated',
      donationId: donation.id || 'FB-2026-TEMP',
      fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e443891FA',
      toAddress: CONTRACT_ADDRESS,
      status: 'Confirmed',
      gasUsed: `${38000 + Math.floor(Math.random() * 5000)} Gwei`,
      ipfsHash: donation.ipfsHash
    };

    return { txHash, blockNumber, transaction };
  },

  /**
   * Simulates calling the smart contract acceptDonation method
   */
  async executeAcceptDonationOnChain(donationId: string, ngoWallet: string): Promise<{ txHash: string; blockNumber: number; transaction: BlockchainTransaction }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const txHash = this.generateTxHash();
    const blockNumber = 48921200 + Math.floor(Math.random() * 50);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction: BlockchainTransaction = {
      hash: txHash,
      blockNumber,
      timestamp: now,
      eventType: 'DonationAccepted',
      donationId,
      fromAddress: ngoWallet || '0x8A2B9c3D4e5F607182930a4B5c6D7e8F901292BC',
      toAddress: CONTRACT_ADDRESS,
      status: 'Confirmed',
      gasUsed: `${41200 + Math.floor(Math.random() * 3000)} Gwei`
    };

    return { txHash, blockNumber, transaction };
  },

  /**
   * Simulates calling the smart contract confirmPickup method
   */
  async executeConfirmPickupOnChain(donationId: string): Promise<{ txHash: string; transaction: BlockchainTransaction }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const txHash = this.generateTxHash();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction: BlockchainTransaction = {
      hash: txHash,
      blockNumber: 48921250 + Math.floor(Math.random() * 20),
      timestamp: now,
      eventType: 'PickupConfirmed',
      donationId,
      fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e443891FA',
      toAddress: CONTRACT_ADDRESS,
      status: 'Confirmed',
      gasUsed: '39,120 Gwei'
    };

    return { txHash, transaction };
  },

  /**
   * Simulates calling the smart contract confirmDelivery and completeDonation methods
   */
  async executeCompleteDonationOnChain(donationId: string): Promise<{ txHash: string; transaction: BlockchainTransaction }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const txHash = this.generateTxHash();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const transaction: BlockchainTransaction = {
      hash: txHash,
      blockNumber: 48921300 + Math.floor(Math.random() * 20),
      timestamp: now,
      eventType: 'DonationCompleted',
      donationId,
      fromAddress: CONTRACT_ADDRESS,
      toAddress: '0x8A2B9c3D4e5F607182930a4B5c6D7e8F901292BC',
      status: 'Confirmed',
      gasUsed: '44,900 Gwei'
    };

    return { txHash, transaction };
  }
};
