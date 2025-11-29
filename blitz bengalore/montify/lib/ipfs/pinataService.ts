/**
 * Pinata IPFS Service
 * Handles file uploads to IPFS via Pinata
 */

const PINATA_API_KEY = '2c69a4dc0ba4f744b913';
const PINATA_SECRET_KEY = 'bf1be79f2089dfa99e97331e2b1c7d277ec0a1d3f3c174d830221351d5ef076d';
const PINATA_GATEWAY = 'green-obedient-lizard-820.mypinata.cloud';

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface DatasetMetadata {
  name: string;
  description: string;
  fileType: string;
  fileSize: number;
  category: string;
  price: string;
  qualityScore?: number;
  uploadedBy: string;
  uploadedAt: string;
  tags?: string[];
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadToIPFS(file: File): Promise<PinataUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Optional: Add metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      uploadedAt: new Date().toISOString(),
      fileSize: file.size.toString(),
      fileType: file.type,
    }
  });
  formData.append('pinataMetadata', metadata);

  // Optional: Add options
  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append('pinataOptions', options);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`IPFS upload failed: ${errorData.error || response.statusText}`);
  }

  const data: PinataUploadResponse = await response.json();
  return data;
}

/**
 * Upload file to IPFS and return just the hash (alias for convenience)
 */
export async function pinFileToIPFS(file: File): Promise<string> {
  const response = await uploadToIPFS(file);
  return response.IpfsHash;
}

/**
 * Upload JSON to IPFS and return just the hash
 */
export async function pinJSONToIPFS(jsonData: any, fileName?: string): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: JSON.stringify({
      pinataContent: jsonData,
      pinataMetadata: {
        name: fileName || `json-${Date.now()}`,
        keyvalues: {
          type: 'json-data',
          uploadedAt: new Date().toISOString(),
        }
      },
      pinataOptions: {
        cidVersion: 1,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`JSON upload failed: ${errorData.error || response.statusText}`);
  }

  const data: PinataUploadResponse = await response.json();
  return data.IpfsHash;
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadMetadataToIPFS(metadata: DatasetMetadata): Promise<PinataUploadResponse> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${metadata.name}-metadata`,
        keyvalues: {
          type: 'dataset-metadata',
          uploadedAt: metadata.uploadedAt,
        }
      },
      pinataOptions: {
        cidVersion: 1,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Metadata upload failed: ${errorData.error || response.statusText}`);
  }

  const data: PinataUploadResponse = await response.json();
  return data;
}

/**
 * Get IPFS gateway URL for a hash
 */
export function getIPFSUrl(ipfsHash: string): string {
  return `https://${PINATA_GATEWAY}/ipfs/${ipfsHash}`;
}

/**
 * Get public gateway URL (alternative)
 */
export function getPublicIPFSUrl(ipfsHash: string): string {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

/**
 * Unpin file from IPFS (optional cleanup)
 */
export async function unpinFromIPFS(ipfsHash: string): Promise<void> {
  const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
    method: 'DELETE',
    headers: {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Unpin failed: ${errorData.error || response.statusText}`);
  }
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}
