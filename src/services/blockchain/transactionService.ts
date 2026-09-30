import type { BlockchainTransaction } from '../../types';

export const transactionService = {
  formatTxHash(hash: string, chars = 6): string {
    if (!hash) return '';
    return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
  },

  getPolygonScanUrl(hash: string): string {
    return `https://amoy.polygonscan.com/tx/${hash}`;
  },

  getMockExplorerDetails(tx: BlockchainTransaction) {
    return {
      hash: tx.hash,
      status: tx.status,
      blockNumber: tx.blockNumber,
      timestamp: tx.timestamp,
      from: tx.fromAddress,
      to: tx.toAddress,
      eventType: tx.eventType,
      donationId: tx.donationId,
      gasUsed: tx.gasUsed,
      ipfsHash: tx.ipfsHash || 'N/A',
      confirmations: 128,
      networkFee: '0.0012 MATIC'
    };
  }
};
