# IPFS Upload & Blockchain Integration Guide

## Overview
This upload system integrates:
- **IPFS (Pinata)** for decentralized file storage
- **Monad Testnet** for on-chain metadata registration
- **AI Analysis** (Groq) for dataset quality scoring

## Features Implemented

### 1. IPFS Integration (Pinata)
- ✅ File upload to IPFS via Pinata API
- ✅ Metadata JSON upload to IPFS
- ✅ Gateway URL generation for file access
- ✅ Progress tracking during upload

**API Credentials:**
- API Key: `2c69a4dc0ba4f744b913`
- Secret Key: `bf1be79f2089dfa99e97331e2b1c7d277ec0a1d3f3c174d830221351d5ef076d`
- Gateway: `green-obedient-lizard-820.mypinata.cloud`

### 2. Upload Flow
The upload process follows these steps:

```
1. Select File → User drops/selects file
2. Fill Metadata → Name, description, category, price, tags
3. IPFS Upload → File uploaded to IPFS (returns hash)
4. Metadata Upload → Metadata JSON uploaded to IPFS (returns hash)
5. Blockchain Registration → Register both hashes on Monad smart contract
```

### 3. Monad Blockchain Integration

#### Smart Contract (Pending Deployment)
Location: `lib/contract/datasetContract.ts`

The contract needs to be deployed to Monad Testnet. Here's how:

**Deploy Contract:**

1. Get the Solidity code:
```typescript
import { getContractCode } from '@/lib/contract/datasetContract';
const code = getContractCode();
```

2. Deploy using Remix or Hardhat:
   - Network: Monad Testnet
   - Chain ID: 10143
   - RPC: `https://testnet-rpc.monad.xyz`

3. Update contract address in `datasetContract.ts`:
```typescript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

#### Contract Functions
- `registerDataset(dataHash, metadataHash, price, category)` - Register new dataset
- `getDataset(datasetId)` - Get dataset details
- `getDatasetsByOwner(address)` - Get all datasets by owner
- `purchaseDataset(datasetId)` - Buy a dataset

### 4. Metadata Structure

```typescript
interface DatasetMetadata {
  name: string;              // Dataset name
  description: string;        // Description
  fileType: string;          // MIME type
  fileSize: number;          // Size in bytes
  category: string;          // Category (ML, NLP, etc.)
  price: string;             // Price in MONAD
  qualityScore?: number;     // AI quality score (0-100)
  uploadedBy: string;        // Wallet address
  uploadedAt: string;        // ISO timestamp
  tags?: string[];           // Search tags
}
```

### 5. IPFS URLs

After upload, you get two IPFS hashes:

**File Hash:** `QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Pinata Gateway: `https://green-obedient-lizard-820.mypinata.cloud/ipfs/{hash}`
- Public Gateway: `https://ipfs.io/ipfs/{hash}`

**Metadata Hash:** `QmYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`
- Contains JSON with all dataset information

## Usage

### Upload a Dataset

1. **Connect Wallet**
   - Click "Connect Wallet" in navbar
   - Approve Monad Testnet network addition
   - Ensure you're on Chain ID 10143

2. **Select File**
   - Drag & drop or click to browse
   - Supported: CSV, JSON, Parquet, ZIP, Images, Audio, Video
   - Max size: 10 GB

3. **Fill Metadata Form**
   - Name: Dataset name
   - Description: Detailed description
   - Category: Select category
   - Price: Price in MONAD tokens
   - Tags: Comma-separated tags

4. **Upload**
   - Click "Start Upload to IPFS"
   - Wait for IPFS upload (file + metadata)
   - Blockchain registration (requires deployed contract)

5. **Access Your Files**
   - Copy IPFS hashes
   - View files via Pinata gateway
   - Share with buyers

## AI Analysis (Bonus)

For JSON datasets, the system automatically:
- Analyzes data quality
- Scores: diversity, accuracy, completeness, consistency
- Detects bias levels
- Provides insights and recommendations

## Next Steps

### Required for Full Functionality:

1. **Deploy Smart Contract**
   ```bash
   # Using Hardhat
   npx hardhat run scripts/deploy.js --network monad-testnet
   ```

2. **Update Contract Address**
   ```typescript
   // lib/contract/datasetContract.ts
   const CONTRACT_ADDRESS = '0xYourContractAddress';
   ```

3. **Test Upload Flow**
   - Upload a small test file
   - Verify IPFS hashes
   - Check blockchain transaction

4. **Optional Enhancements**
   - Add file encryption before IPFS upload
   - Implement access control via NFTs
   - Add payment escrow system

## Troubleshooting

### IPFS Upload Fails
- Check Pinata API keys are correct
- Verify file size < 10 GB
- Check internet connection

### Blockchain Registration Fails
- Ensure contract is deployed
- Check wallet has MONAD testnet tokens
- Verify you're on correct network (10143)

### Metadata Issues
- Name and description are required
- Price must be a valid number
- Category must be selected

## API Services Used

- **Pinata**: IPFS pinning service
- **Monad Testnet**: EVM-compatible blockchain
- **Groq AI**: Dataset quality analysis (optional)

## File Structure

```
lib/
├── ipfs/
│   └── pinataService.ts       # IPFS upload functions
├── contract/
│   └── datasetContract.ts     # Smart contract interface
└── wallet/
    └── MonadWalletProvider.tsx # Wallet connection

app/
└── upload/
    └── page.tsx               # Main upload UI
```

## Environment Variables (Optional)

For security, you can move API keys to `.env.local`:

```env
NEXT_PUBLIC_PINATA_API_KEY=2c69a4dc0ba4f744b913
NEXT_PUBLIC_PINATA_SECRET=bf1be79f2089dfa99e97331e2b1c7d277ec0a1d3f3c174d830221351d5ef076d
NEXT_PUBLIC_PINATA_GATEWAY=green-obedient-lizard-820.mypinata.cloud
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

Then update `pinataService.ts` to use them.
