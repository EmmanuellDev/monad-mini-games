# Bounty System Deployment Guide

## Overview
The bounty system allows users to create bounties for datasets they need and enables data providers to submit solutions and earn rewards.

## Smart Contract Deployment

### 1. Deploy BountyRegistry Contract

The contract is located at: `contracts/BountyRegistry.sol`

**Deploy using Remix IDE:**

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `BountyRegistry.sol`
3. Copy the contract code from `contracts/BountyRegistry.sol`
4. Select compiler version `0.8.20` or higher
5. Compile the contract
6. Switch to "Deploy & Run Transactions" tab
7. Select "Injected Provider - MetaMask" as environment
8. Ensure you're connected to Monad Testnet (Chain ID: 10143)
9. Deploy the contract
10. Copy the deployed contract address

### 2. Update Contract Address

After deployment, update the contract address in:
`lib/contract/bountyContract.ts`

```typescript
// Line 4: Replace with your deployed contract address
export const BOUNTY_CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

## Features

### For Bounty Creators
- **Create Bounties**: Post requests for specific datasets with reward amounts
- **Set Deadlines**: Define timeframes for bounty completion
- **Review Submissions**: View and approve submissions from data providers
- **Cancel Bounties**: Get refunds for unfulfilled bounties

### For Data Providers
- **Browse Bounties**: View active bounties filtered by category, reward, or deadline
- **Submit Solutions**: Upload datasets to IPFS and submit to bounties
- **Earn Rewards**: Receive MONAD tokens when submissions are approved
- **Track Progress**: Monitor your submissions across multiple bounties

## Platform Mechanics

### Reward System
- Bounty creators deposit rewards when creating bounties (held in smart contract)
- Platform fee: 2.5% of reward (deducted when bounty is fulfilled)
- Remaining 97.5% goes to the approved submitter
- Cancelled bounties return 100% to creator

### Bounty Status
- **Active (0)**: Accepting submissions, deadline not passed
- **Fulfilled (1)**: A submission has been approved and rewarded
- **Cancelled (2)**: Creator cancelled, funds returned

### Submission Flow
1. Data provider uploads dataset to IPFS
2. Submits IPFS hash + description to bounty
3. Creator reviews all submissions
4. Creator approves best submission
5. Smart contract automatically distributes rewards

## Testing Guide

### Prerequisites
- MetaMask installed and connected to Monad Testnet
- MONAD testnet tokens for gas fees
- Test wallet addresses for creating/submitting to bounties

### Test Scenarios

**Scenario 1: Create a Bounty**
1. Connect wallet on bounties page
2. Click "Create Bounty"
3. Fill in:
   - Title: "Test Healthcare Dataset"
   - Description: "Need patient diagnostic data"
   - Category: Healthcare
   - Reward: 0.1 MONAD
   - Deadline: 7 days
4. Submit and confirm transaction
5. Verify bounty appears in list

**Scenario 2: Submit to Bounty**
1. Browse active bounties
2. Click "Submit Solution" on a bounty
3. Upload a test file (any CSV/JSON)
4. Wait for IPFS upload
5. Add description
6. Submit and confirm transaction
7. Verify submission count increases

**Scenario 3: Approve Submission** (requires creator wallet)
1. Create a bounty with your wallet
2. Switch to different wallet
3. Submit to your bounty
4. Switch back to creator wallet
5. Use contract directly to call `approveBounty(bountyId, 0)`
6. Verify bounty status changes to Fulfilled
7. Check submitter wallet receives reward

## Contract Functions

### Read Functions
- `totalBounties()`: Get total number of bounties
- `getBounty(id)`: Get bounty details
- `getBountySubmissions(id)`: Get all submissions for a bounty
- `getCreatorBounties(address)`: Get bounties by creator
- `getSubmitterBounties(address)`: Get bounties by submitter

### Write Functions
- `createBounty()`: Create new bounty (payable)
- `submitToBounty()`: Submit solution to bounty
- `approveBounty()`: Approve a submission (creator only)
- `cancelBounty()`: Cancel bounty and refund (creator only)

## Frontend Integration

### Key Files
- `app/bounties/page.tsx` - Main bounties page
- `components/features/bounty/BountyCard.tsx` - Individual bounty display
- `components/features/bounty/CreateBountyModal.tsx` - Create bounty modal
- `components/features/bounty/SubmitBountyModal.tsx` - Submit to bounty modal
- `lib/contract/bountyContract.ts` - Contract interaction layer

### State Management
- Bounties loaded from blockchain on page mount
- Real-time stats calculated from on-chain data
- Wallet connection required for creating/submitting
- Auto-refresh after transactions

## IPFS Integration

### Files Stored on IPFS
1. **Bounty Metadata**: Detailed requirements and specifications
2. **Submission Data**: Dataset files submitted by providers
3. **Submission Descriptions**: Text explanations of submissions

### Gateway URLs
- Pinata Gateway: `https://green-obedient-lizard-820.mypinata.cloud/ipfs/{hash}`
- Public Gateway: `https://gateway.pinata.cloud/ipfs/{hash}`

## Troubleshooting

### Contract Not Deployed Error
**Symptom**: Yellow banner "Bounty Contract Not Deployed"
**Solution**: Deploy BountyRegistry.sol and update BOUNTY_CONTRACT_ADDRESS

### Wallet Connection Issues
**Symptom**: "Connect Wallet" button doesn't work
**Solution**: 
- Ensure MetaMask is installed
- Switch to Monad Testnet (Chain ID: 10143)
- Refresh page after network change

### Transaction Failures
**Symptom**: Transaction reverts or fails
**Common Causes**:
- Insufficient MONAD for gas + reward
- Deadline in the past
- Not the bounty creator (for approve/cancel)
- Bounty already fulfilled/cancelled

### IPFS Upload Failures
**Symptom**: "Failed to upload to IPFS"
**Solution**:
- Check internet connection
- Verify Pinata API keys are valid
- Ensure file size is reasonable (<100MB recommended)

## Security Considerations

### Smart Contract
- Rewards held in contract until bounty fulfilled/cancelled
- Only creator can approve submissions or cancel
- Reentrancy protection via transfer patterns
- Deadline validation prevents expired bounties

### Frontend
- Wallet signatures required for all transactions
- IPFS hashes verified before submission
- Client-side validation before blockchain calls
- Error handling for failed transactions

## Gas Optimization Tips

- **Batch Operations**: Review multiple submissions off-chain before approving
- **Deadline Planning**: Longer deadlines reduce urgency gas spikes
- **Metadata Size**: Keep IPFS metadata compact to reduce upload costs

## Future Enhancements

### Planned Features
- [ ] Multi-submission bounties (multiple winners)
- [ ] Escrow with milestone payments
- [ ] Reputation system for submitters
- [ ] Automated quality checks
- [ ] Bounty categories with custom rules
- [ ] Dispute resolution mechanism
- [ ] NFT certificates for fulfilled bounties

## Support

### Resources
- Monad Testnet Explorer: https://testnet.monadexplorer.com
- Monad Testnet RPC: https://testnet-rpc.monad.xyz
- Pinata Docs: https://docs.pinata.cloud
- IPFS Docs: https://docs.ipfs.tech

### Common Questions

**Q: Can I edit a bounty after creation?**
A: No, bounties are immutable. Cancel and create a new one if needed.

**Q: What happens if deadline passes?**
A: No new submissions accepted. Creator can still approve existing submissions or cancel.

**Q: Can multiple people submit to one bounty?**
A: Yes! Creator chooses the best submission to approve.

**Q: Are rewards automatically distributed?**
A: Yes, when creator approves a submission, smart contract handles payment.

**Q: Can I submit to my own bounty?**
A: Technically yes, but ethically questionable. System doesn't prevent it.

---

**Deployment Checklist:**
- [ ] Deploy BountyRegistry.sol to Monad Testnet
- [ ] Update BOUNTY_CONTRACT_ADDRESS in bountyContract.ts
- [ ] Test bounty creation with small amount
- [ ] Test submission flow
- [ ] Test approval flow
- [ ] Verify IPFS uploads working
- [ ] Check wallet connection on all pages
- [ ] Test filters and sorting
- [ ] Verify stats calculations
- [ ] Test with multiple wallets

**Ready to go live once contract is deployed! 🚀**
