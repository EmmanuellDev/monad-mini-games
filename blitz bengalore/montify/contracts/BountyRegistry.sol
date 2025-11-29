// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BountyRegistry {
    enum BountyStatus { Active, Fulfilled, Cancelled }
    
    struct Bounty {
        address creator;
        string title;
        string description;
        string metadataHash;    // IPFS hash with full requirements
        uint256 reward;         // Reward in wei
        string category;
        uint256 deadline;       // Unix timestamp
        BountyStatus status;
        uint256 timestamp;
        address fulfiller;      // Address that fulfilled the bounty
        string submissionHash;  // IPFS hash of submission
    }
    
    struct Submission {
        address submitter;
        string dataHash;        // IPFS hash of submitted data
        string description;
        uint256 timestamp;
        bool approved;
    }
    
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Submission[]) public bountySubmissions;
    mapping(address => uint256[]) public creatorBounties;
    mapping(address => uint256[]) public submitterBounties;
    uint256 public totalBounties;
    
    // Platform payment address
    address public constant PLATFORM_ADDRESS = 0xE8C42b0c182d31F06d938a97a969606A7731fFda;
    uint256 public constant PLATFORM_FEE_PERCENT = 25; // 2.5%
    
    event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 reward, uint256 deadline);
    event BountySubmitted(uint256 indexed bountyId, address indexed submitter, string dataHash);
    event BountyFulfilled(uint256 indexed bountyId, address indexed fulfiller, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId);
    
    function createBounty(
        string memory _title,
        string memory _description,
        string memory _metadataHash,
        string memory _category,
        uint256 _deadline
    ) public payable returns (uint256) {
        require(msg.value > 0, "Reward must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        uint256 bountyId = totalBounties++;
        
        bounties[bountyId] = Bounty({
            creator: msg.sender,
            title: _title,
            description: _description,
            metadataHash: _metadataHash,
            reward: msg.value,
            category: _category,
            deadline: _deadline,
            status: BountyStatus.Active,
            timestamp: block.timestamp,
            fulfiller: address(0),
            submissionHash: ""
        });
        
        creatorBounties[msg.sender].push(bountyId);
        
        emit BountyCreated(bountyId, msg.sender, msg.value, _deadline);
        
        return bountyId;
    }
    
    function submitToBounty(
        uint256 _bountyId,
        string memory _dataHash,
        string memory _description
    ) public {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        require(block.timestamp < bounty.deadline, "Bounty deadline passed");
        
        bountySubmissions[_bountyId].push(Submission({
            submitter: msg.sender,
            dataHash: _dataHash,
            description: _description,
            timestamp: block.timestamp,
            approved: false
        }));
        
        submitterBounties[msg.sender].push(_bountyId);
        
        emit BountySubmitted(_bountyId, msg.sender, _dataHash);
    }
    
    function approveBounty(uint256 _bountyId, uint256 _submissionIndex) public {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.creator == msg.sender, "Not the bounty creator");
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        
        Submission storage submission = bountySubmissions[_bountyId][_submissionIndex];
        submission.approved = true;
        
        // Calculate platform fee
        uint256 platformFee = (bounty.reward * PLATFORM_FEE_PERCENT) / 1000;
        uint256 fulfillerReward = bounty.reward - platformFee;
        
        // Update bounty status
        bounty.status = BountyStatus.Fulfilled;
        bounty.fulfiller = submission.submitter;
        bounty.submissionHash = submission.dataHash;
        
        // Transfer rewards
        payable(submission.submitter).transfer(fulfillerReward);
        payable(PLATFORM_ADDRESS).transfer(platformFee);
        
        emit BountyFulfilled(_bountyId, submission.submitter, fulfillerReward);
    }
    
    function cancelBounty(uint256 _bountyId) public {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.creator == msg.sender, "Not the bounty creator");
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        
        bounty.status = BountyStatus.Cancelled;
        
        // Refund the reward to creator
        payable(msg.sender).transfer(bounty.reward);
        
        emit BountyCancelled(_bountyId);
    }
    
    function getBounty(uint256 _bountyId) public view returns (
        address creator,
        string memory title,
        string memory description,
        string memory metadataHash,
        uint256 reward,
        string memory category,
        uint256 deadline,
        BountyStatus status,
        uint256 timestamp,
        address fulfiller
    ) {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.creator,
            bounty.title,
            bounty.description,
            bounty.metadataHash,
            bounty.reward,
            bounty.category,
            bounty.deadline,
            bounty.status,
            bounty.timestamp,
            bounty.fulfiller
        );
    }
    
    function getBountySubmissionCount(uint256 _bountyId) public view returns (uint256) {
        return bountySubmissions[_bountyId].length;
    }
    
    function getBountySubmissions(uint256 _bountyId) public view returns (Submission[] memory) {
        return bountySubmissions[_bountyId];
    }
    
    function getCreatorBounties(address _creator) public view returns (uint256[] memory) {
        return creatorBounties[_creator];
    }
    
    function getSubmitterBounties(address _submitter) public view returns (uint256[] memory) {
        return submitterBounties[_submitter];
    }
}
