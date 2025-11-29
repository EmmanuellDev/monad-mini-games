import { ethers } from 'ethers';

// Deployed BountyRegistry contract address
export const BOUNTY_CONTRACT_ADDRESS = '0x75f5978c8cc7B41C11c38642226bD20725E140E5';

export const BOUNTY_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256" }
    ],
    "name": "BountyCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "BountyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "fulfiller", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }
    ],
    "name": "BountyFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "bountyId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "submitter", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "dataHash", "type": "string" }
    ],
    "name": "BountySubmitted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "PLATFORM_ADDRESS",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE_PERCENT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" },
      { "internalType": "uint256", "name": "_submissionIndex", "type": "uint256" }
    ],
    "name": "approveBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "bounties",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "enum BountyRegistry.BountyStatus", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "fulfiller", "type": "address" },
      { "internalType": "string", "name": "submissionHash", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "bountySubmissions",
    "outputs": [
      { "internalType": "address", "name": "submitter", "type": "address" },
      { "internalType": "string", "name": "dataHash", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" }
    ],
    "name": "cancelBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string", "name": "_metadataHash", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" }
    ],
    "name": "createBounty",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "creatorBounties",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" }
    ],
    "name": "getBounty",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "enum BountyRegistry.BountyStatus", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "address", "name": "fulfiller", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" }
    ],
    "name": "getBountySubmissionCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" }
    ],
    "name": "getBountySubmissions",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "submitter", "type": "address" },
          { "internalType": "string", "name": "dataHash", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "bool", "name": "approved", "type": "bool" }
        ],
        "internalType": "struct BountyRegistry.Submission[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_creator", "type": "address" }
    ],
    "name": "getCreatorBounties",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_submitter", "type": "address" }
    ],
    "name": "getSubmitterBounties",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_bountyId", "type": "uint256" },
      { "internalType": "string", "name": "_dataHash", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" }
    ],
    "name": "submitToBounty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "submitterBounties",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalBounties",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface Bounty {
  id: number;
  creator: string;
  title: string;
  description: string;
  metadataHash: string;
  reward: bigint;
  category: string;
  deadline: number;
  status: 0 | 1 | 2; // 0: Active, 1: Fulfilled, 2: Cancelled
  timestamp: number;
  fulfiller: string;
  submissionCount: number;
}

export interface Submission {
  submitter: string;
  dataHash: string;
  description: string;
  timestamp: number;
  approved: boolean;
}

// Get contract instance
export function getBountyContract(provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(BOUNTY_CONTRACT_ADDRESS, BOUNTY_CONTRACT_ABI, provider);
}

// Create a new bounty
export async function createBounty(
  signer: ethers.Signer,
  title: string,
  description: string,
  metadataHash: string,
  category: string,
  deadline: number,
  rewardInEth: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getBountyContract(signer);
  const rewardInWei = ethers.parseEther(rewardInEth);
  return await contract.createBounty(title, description, metadataHash, category, deadline, {
    value: rewardInWei
  });
}

// Submit to a bounty
export async function submitToBounty(
  signer: ethers.Signer,
  bountyId: number,
  dataHash: string,
  description: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = getBountyContract(signer);
  return await contract.submitToBounty(bountyId, dataHash, description);
}

// Approve a bounty submission
export async function approveBountySubmission(
  signer: ethers.Signer,
  bountyId: number,
  submissionIndex: number
): Promise<ethers.ContractTransactionResponse> {
  const contract = getBountyContract(signer);
  return await contract.approveBounty(bountyId, submissionIndex);
}

// Cancel a bounty
export async function cancelBounty(
  signer: ethers.Signer,
  bountyId: number
): Promise<ethers.ContractTransactionResponse> {
  const contract = getBountyContract(signer);
  return await contract.cancelBounty(bountyId);
}

// Get total bounties count
export async function getTotalBounties(provider: ethers.Provider): Promise<number> {
  const contract = getBountyContract(provider);
  const total = await contract.totalBounties();
  return Number(total);
}

// Get bounty details
export async function getBountyDetails(provider: ethers.Provider, bountyId: number): Promise<Bounty> {
  const contract = getBountyContract(provider);
  const result = await contract.getBounty(bountyId);
  const submissionCount = await contract.getBountySubmissionCount(bountyId);
  
  return {
    id: bountyId,
    creator: result.creator,
    title: result.title,
    description: result.description,
    metadataHash: result.metadataHash,
    reward: result.reward,
    category: result.category,
    deadline: Number(result.deadline),
    status: result.status,
    timestamp: Number(result.timestamp),
    fulfiller: result.fulfiller,
    submissionCount: Number(submissionCount)
  };
}

// Get bounty submissions
export async function getBountySubmissions(provider: ethers.Provider, bountyId: number): Promise<Submission[]> {
  const contract = getBountyContract(provider);
  const submissions = await contract.getBountySubmissions(bountyId);
  
  return submissions.map((s: any) => ({
    submitter: s.submitter,
    dataHash: s.dataHash,
    description: s.description,
    timestamp: Number(s.timestamp),
    approved: s.approved
  }));
}

// Get bounties by creator
export async function getBountiesByCreator(provider: ethers.Provider, creatorAddress: string): Promise<number[]> {
  const contract = getBountyContract(provider);
  const bountyIds = await contract.getCreatorBounties(creatorAddress);
  return bountyIds.map((id: bigint) => Number(id));
}

// Get bounties by submitter
export async function getBountiesBySubmitter(provider: ethers.Provider, submitterAddress: string): Promise<number[]> {
  const contract = getBountyContract(provider);
  const bountyIds = await contract.getSubmitterBounties(submitterAddress);
  return bountyIds.map((id: bigint) => Number(id));
}
