/**
 * Dataset Smart Contract Service for Monad Testnet
 * Handles on-chain storage of dataset metadata
 */

import { ethers } from 'ethers';

// Dataset Registry Contract ABI - from deployed contract
const DATASET_REGISTRY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "datasetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DatasetPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "datasetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DatasetRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "datasetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DatasetUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "PLATFORM_ADDRESS",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "datasets",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "dataHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_datasetId",
        "type": "uint256"
      }
    ],
    "name": "getDataset",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "dataHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getDatasetsByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ownerDatasets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_datasetId",
        "type": "uint256"
      }
    ],
    "name": "purchaseDataset",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_dataHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_metadataHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      }
    ],
    "name": "registerDataset",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDatasets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_datasetId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_metadataHash",
        "type": "string"
      }
    ],
    "name": "updateDatasetMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Deployed contract address on Monad Testnet
const CONTRACT_ADDRESS = '0x1D177eC014324d0820c89aD4716296EEdC434f70';

export interface DatasetOnChain {
  id: number;
  owner: string;
  dataHash: string;
  metadataHash: string;
  price: string;
  category: string;
  timestamp: number;
  active: boolean;
}

/**
 * Get contract instance
 */
export function getDatasetContract(signer: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, DATASET_REGISTRY_ABI, signer);
}

/**
 * Register a new dataset on-chain
 */
export async function registerDataset(
  signer: ethers.Signer,
  dataHash: string,
  metadataHash: string,
  price: string,
  category: string
): Promise<{ datasetId: number; txHash: string }> {
  try {
    const contract = getDatasetContract(signer);
    
    // Convert price to wei
    const priceInWei = ethers.parseEther(price);
    
    const tx = await contract.registerDataset(
      dataHash,
      metadataHash,
      priceInWei,
      category
    );
    
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    // Extract dataset ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'DatasetRegistered';
      } catch {
        return false;
      }
    });
    
    let datasetId = 0;
    if (event) {
      const parsed = contract.interface.parseLog(event);
      datasetId = Number(parsed?.args[0] || 0);
    }
    
    return {
      datasetId,
      txHash: tx.hash,
    };
  } catch (error) {
    console.error('Error registering dataset:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register dataset on-chain');
  }
}

/**
 * Get dataset details from blockchain
 */
export async function getDatasetDetails(
  provider: ethers.Provider,
  datasetId: number
): Promise<DatasetOnChain> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATASET_REGISTRY_ABI, provider);
    
    const result = await contract.getDataset(datasetId);
    
    return {
      id: datasetId,
      owner: result[0],
      dataHash: result[1],
      metadataHash: result[2],
      price: ethers.formatEther(result[3]),
      category: result[4],
      timestamp: Number(result[5]),
      active: result[6],
    };
  } catch (error) {
    console.error('Error fetching dataset:', error);
    throw new Error('Failed to fetch dataset from blockchain');
  }
}

/**
 * Get datasets owned by an address
 */
export async function getDatasetsByOwner(
  provider: ethers.Provider,
  ownerAddress: string
): Promise<number[]> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATASET_REGISTRY_ABI, provider);
    const datasetIds = await contract.getDatasetsByOwner(ownerAddress);
    return datasetIds.map((id: bigint) => Number(id));
  } catch (error) {
    console.error('Error fetching owner datasets:', error);
    throw new Error('Failed to fetch datasets by owner');
  }
}

/**
 * Purchase a dataset
 */
export async function purchaseDataset(
  signer: ethers.Signer,
  datasetId: number,
  price: string
): Promise<string> {
  try {
    const contract = getDatasetContract(signer);
    
    const priceInWei = ethers.parseEther(price);
    
    const tx = await contract.purchaseDataset(datasetId, {
      value: priceInWei,
    });
    
    console.log('Purchase transaction sent:', tx.hash);
    await tx.wait();
    console.log('Purchase confirmed');
    
    return tx.hash;
  } catch (error) {
    console.error('Error purchasing dataset:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to purchase dataset');
  }
}

/**
 * Get total number of datasets
 */
export async function getTotalDatasets(provider: ethers.Provider): Promise<number> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATASET_REGISTRY_ABI, provider);
    const total = await contract.totalDatasets();
    return Number(total);
  } catch (error) {
    console.error('Error fetching total datasets:', error);
    return 0;
  }
}

/**
 * Get purchase history for a buyer
 */
export async function getPurchaseHistory(provider: ethers.Provider, buyerAddress: string): Promise<Array<{
  datasetId: number;
  price: bigint;
  timestamp: number;
}>> {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATASET_REGISTRY_ABI, provider);
    
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    
    // Use very small block range (100 blocks) for Monad testnet strict limits
    const blockRange = 100;
    const fromBlock = Math.max(0, currentBlock - blockRange);
    
    // Get DatasetPurchased events for this buyer with very limited block range
    const filter = contract.filters.DatasetPurchased(null, buyerAddress);
    
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);
    
    return events.map((event: any) => ({
      datasetId: Number(event.args.datasetId),
      price: event.args.price,
      timestamp: Number(event.args.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    // Return empty array on error - RPC limits are too strict
    // Note: This will only show purchases from last ~100 blocks
    return [];
  }
}

/**
 * Get total purchases count for a buyer
 */
export async function getTotalPurchases(provider: ethers.Provider, buyerAddress: string): Promise<number> {
  const purchases = await getPurchaseHistory(provider, buyerAddress);
  return purchases.length;
}

/**
 * Generate Solidity contract code for deployment
 */
export function getContractCode(): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DatasetRegistry {
    struct Dataset {
        address owner;
        string dataHash;        // IPFS hash of actual data
        string metadataHash;    // IPFS hash of metadata JSON
        uint256 price;          // Price in wei
        string category;
        uint256 timestamp;
        bool active;
    }
    
    mapping(uint256 => Dataset) public datasets;
    mapping(address => uint256[]) public ownerDatasets;
    uint256 public totalDatasets;
    
    // Platform payment address
    address public constant PLATFORM_ADDRESS = 0xe8c42b0c182d31f06d938a97a969606a7731ffda;
    
    event DatasetRegistered(uint256 indexed datasetId, address indexed owner, string ipfsHash, uint256 timestamp);
    event DatasetUpdated(uint256 indexed datasetId, string metadataHash, uint256 timestamp);
    event DatasetPurchased(uint256 indexed datasetId, address indexed buyer, uint256 price, uint256 timestamp);
    
    function registerDataset(
        string memory _dataHash,
        string memory _metadataHash,
        uint256 _price,
        string memory _category
    ) public returns (uint256) {
        uint256 datasetId = totalDatasets++;
        
        datasets[datasetId] = Dataset({
            owner: msg.sender,
            dataHash: _dataHash,
            metadataHash: _metadataHash,
            price: _price,
            category: _category,
            timestamp: block.timestamp,
            active: true
        });
        
        ownerDatasets[msg.sender].push(datasetId);
        
        emit DatasetRegistered(datasetId, msg.sender, _dataHash, block.timestamp);
        
        return datasetId;
    }
    
    function updateDatasetMetadata(uint256 _datasetId, string memory _metadataHash) public {
        require(datasets[_datasetId].owner == msg.sender, "Not the owner");
        datasets[_datasetId].metadataHash = _metadataHash;
        emit DatasetUpdated(_datasetId, _metadataHash, block.timestamp);
    }
    
    function purchaseDataset(uint256 _datasetId) public payable {
        Dataset storage dataset = datasets[_datasetId];
        require(dataset.active, "Dataset not active");
        require(msg.value >= dataset.price, "Insufficient payment");
        
        // Transfer payment to platform address instead of owner
        payable(PLATFORM_ADDRESS).transfer(msg.value);
        
        emit DatasetPurchased(_datasetId, msg.sender, msg.value, block.timestamp);
    }
    
    function getDataset(uint256 _datasetId) public view returns (
        address owner,
        string memory dataHash,
        string memory metadataHash,
        uint256 price,
        string memory category,
        uint256 timestamp,
        bool active
    ) {
        Dataset storage dataset = datasets[_datasetId];
        return (
            dataset.owner,
            dataset.dataHash,
            dataset.metadataHash,
            dataset.price,
            dataset.category,
            dataset.timestamp,
            dataset.active
        );
    }
    
    function getDatasetsByOwner(address _owner) public view returns (uint256[] memory) {
        return ownerDatasets[_owner];
    }
}`;
}
