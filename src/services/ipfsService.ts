/**
 * IPFS Decentralized Storage Abstraction Layer
 */

export interface IpfsUploadResult {
  cid: string;
  ipfsUri: string;
  gatewayUrl: string;
  timestamp: string;
  sizeBytes: number;
}

export const ipfsService = {
  /**
   * Simulates uploading metadata and images to IPFS returning CID (Content Identifier)
   */
  async uploadDonationMetadata(metadata: Record<string, any>): Promise<IpfsUploadResult> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Latency simulation

    const hexChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let hashBody = '';
    for (let i = 0; i < 44; i++) {
      hashBody += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    const cid = `Qm${hashBody}`;
    const jsonStr = JSON.stringify(metadata);

    return {
      cid,
      ipfsUri: `ipfs://${cid}`,
      gatewayUrl: `https://ipfs.io/ipfs/${cid}`,
      timestamp: new Date().toISOString(),
      sizeBytes: jsonStr.length + 1024
    };
  },

  getGatewayUrl(ipfsUri: string): string {
    if (!ipfsUri) return '';
    const cid = ipfsUri.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
};
