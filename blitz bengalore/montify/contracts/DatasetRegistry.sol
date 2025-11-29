// SPDX-License-Identifier: MIT
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
    
    // Platform payment address - all payments go here
    address public constant PLATFORM_ADDRESS = 0xE8C42b0c182d31F06d938a97a969606A7731fFda;
    
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
        
        // Transfer payment to platform address
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
}
