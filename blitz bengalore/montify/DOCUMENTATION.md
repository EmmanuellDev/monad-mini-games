# Montify - Complete Project Documentation

**Version:** 0.1.0  
**Last Updated:** November 29, 2025  
**Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Core Features](#core-features)
5. [Technical Implementation](#technical-implementation)
6. [Directory Structure](#directory-structure)
7. [Component Documentation](#component-documentation)
8. [API & Services](#api--services)
9. [Data Models & Types](#data-models--types)
10. [Styling & Design System](#styling--design-system)
11. [Environment Configuration](#environment-configuration)
12. [Deployment Guide](#deployment-guide)
13. [Development Workflow](#development-workflow)
14. [Testing Strategy](#testing-strategy)
15. [Performance Optimization](#performance-optimization)
16. [Security Considerations](#security-considerations)
17. [Future Roadmap](#future-roadmap)
18. [Troubleshooting](#troubleshooting)
19. [Contributing Guidelines](#contributing-guidelines)
20. [License & Credits](#license--credits)

---

## Executive Summary

**Montify** is a cutting-edge, decentralized dataset marketplace that combines artificial intelligence with blockchain technology to revolutionize how datasets are traded, verified, and certified. Built on the Monad blockchain (integration in progress), Montify ensures every dataset comes with provable quality metrics through AI-powered analysis.

### Key Differentiators

- ✅ **AI-Powered Quality Verification** - Automated dataset analysis using Groq's LLaMA 3.3 70B model
- ✅ **Blockchain Certification** - Immutable quality certificates as NFTs (Monad integration coming)
- ✅ **Decentralized Architecture** - Built for web3 with modern React/Next.js
- ✅ **Transparent Metrics** - Public quality scores for every dataset
- ✅ **Developer-Friendly** - Clean API, comprehensive documentation

### Current Status

**Live Features:**
- ✅ AI quality analysis for JSON datasets
- ✅ Dataset upload interface with drag & drop
- ✅ Marketplace browsing with mock data
- ✅ User dashboard and analytics
- ✅ Bounty system for data collection

**In Development:**
- ✅ Monad blockchain smart contract integration
- ✅ Wallet connectivity (Monad-compatible wallets)
- 🚧 NFT certificate minting
- 🚧 Decentralized storage integration
- 🚧 Real marketplace transactions

---

## Project Overview

### Vision & Mission

**Vision:** To become the world's most trusted platform for AI-verified, blockchain-certified datasets.

**Mission:** Eliminate low-quality datasets from the market by providing transparent, AI-powered quality verification backed by immutable blockchain certificates.

### Problem Statement

The current dataset marketplace suffers from:
- **Quality Uncertainty** - No standardized quality metrics
- **Trust Issues** - No verification of dataset authenticity
- **Centralization** - Data stored on centralized platforms
- **Price Opacity** - Unclear pricing based on quality
- **No Provenance** - Difficulty tracking dataset origin and modifications

### Solution

Montify solves these problems through:

1. **AI Quality Analysis**
   - Automated evaluation of datasets using advanced LLM
   - Comprehensive metrics: quality, diversity, accuracy, completeness, consistency, bias
   - Actionable insights and recommendations

2. **Blockchain Certification**
   - Immutable NFT certificates with quality scores
   - On-chain provenance tracking
   - Transparent transaction history

3. **Decentralized Storage** (Coming Soon)
   - Redundant, distributed file storage
   - Cryptographic proof of availability
   - Encrypted access control

4. **Smart Contract Automation**
   - Automated payments and escrow
   - Quality-based pricing mechanisms
   - Reputation systems for sellers

---

## Architecture & Technology Stack

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 16 (App Router)         │
│         React 19 + TypeScript           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  Client Pages  │    │   API Routes    │
│  - Upload      │    │  - /api/analyze │
│  - Marketplace │    │                 │
│  - Dashboard   │    │                 │
└────────────────┘    └─────────────────┘
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│   Components   │    │   Services      │
│  - UI          │    │  - Groq AI      │
│  - Features    │    │  - Blockchain   │
│  - Layout      │    │  - Storage      │
└────────────────┘    └─────────────────┘
```

### Technology Stack

#### Core Framework
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library with latest features
- **TypeScript 5.x** - Type-safe JavaScript
- **Turbopack** - Next-gen bundler for fast development

#### UI & Styling
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Lucide React 0.553.0** - Icon library
- **clsx + tailwind-merge** - Conditional class utilities

#### 3D Graphics
- **Three.js 0.181.0** - WebGL 3D library
- **@react-three/fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - Three.js helpers

#### AI & Data Processing
- **OpenAI SDK 6.8.1** - For Groq API integration
- **Groq Cloud** - LLaMA 3.3 70B Versatile model

#### State Management & Data Fetching
- **TanStack Query 5.90.7** - Async state management
- **React Hooks** - Built-in state management

#### File Handling
- **react-dropzone 14.3.8** - Drag & drop file uploads

#### Blockchain
- **ethers.js 6.13.0** - Ethereum library for wallet interaction
- **Monad Testnet** - EVM-compatible blockchain (Chain ID: 10143)

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Upload UI  │  │  Marketplace │  │   Dashboard  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (API Routes)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /api/analyze - AI Quality Analysis             │   │
│  │  - Receives JSON dataset                        │   │
│  │  - Calls Groq AI API                            │   │
│  │  - Returns quality metrics                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│    Groq Cloud    │  │  Monad Blockchain │
│  LLaMA 3.3 70B   │  │  (Coming Soon)    │
│  - Dataset AI    │  │  - Smart Contract │
│  - Analysis      │  │  - NFT Minting    │
└──────────────────┘  └──────────────────┘
```

---

## Core Features

### 1. Dataset Upload System

**Location:** `/app/upload/page.tsx`

**Functionality:**
- Drag & drop file upload interface
- Support for multiple file formats (CSV, JSON, Parquet, ZIP, Images, Audio, Video)
- Maximum file size: 10 GB
- Real-time upload progress tracking
- 5-step wizard interface:
  1. Upload - Select and upload file
  2. Metadata - File processing
  3. Encrypting - Preparing for storage
  4. Verification - AI analysis (for JSON)
  5. Listing - Final confirmation

**User Flow:**
```
Select File → Upload → [AI Analysis] → Generate Certificate → Complete
```

**AI Analysis Trigger:**
- Automatically triggered for JSON files
- Uses Groq AI to analyze data quality
- Provides comprehensive quality metrics

**Key Components:**
- File dropzone with react-dropzone
- Progress indicator with Framer Motion animations
- AI analysis results display
- Mock storage implementation (decentralized storage coming)

### 2. AI Quality Analysis

**Location:** `/lib/ai/groqService.ts`, `/app/api/analyze/route.ts`

**Analysis Metrics:**

1. **Overall Quality Score (0-100)**
   - Composite score based on all metrics
   - Weighted average of individual scores

2. **Diversity Score (0-100%)**
   - Measures variety in data distribution
   - Checks for balanced categorical values
   - Identifies underrepresented groups

3. **Accuracy Score (0-100%)**
   - Validates data format consistency
   - Checks for logical inconsistencies
   - Identifies outliers and anomalies

4. **Completeness Score (0-100%)**
   - Measures missing data percentage
   - Tracks null/undefined values
   - Evaluates required field coverage

5. **Consistency Score (0-100%)**
   - Checks format standardization
   - Validates data type consistency
   - Identifies duplicate records

6. **Bias Level (Low/Medium/High)**
   - Detects demographic bias
   - Identifies sampling bias
   - Checks for selection bias

**Additional Outputs:**
- **Insights** - Key findings about the dataset
- **Recommendations** - Actionable improvement suggestions
- **Statistics** - Total records, fields, missing data %, data types

**Implementation:**
```typescript
interface DatasetAnalysis {
  qualityScore: number;
  diversity: number;
  accuracy: number;
  completeness: number;
  consistency: number;
  bias: 'low' | 'medium' | 'high';
  insights: string[];
  recommendations: string[];
  statistics: {
    totalRecords: number;
    totalFields: number;
    missingDataPercentage: number;
    dataTypes: string[];
  };
}
```

### 3. Marketplace

**Location:** `/app/marketplace/page.tsx`

**Features:**
- Grid layout with dataset cards
- Filter by:
  - Quality score range
  - Price range
  - Category (Healthcare, Finance, Education, etc.)
  - Data type (Tabular, Image, Text, etc.)
- Sort by:
  - Relevance
  - Quality (high to low)
  - Price (low to high)
  - Date added (newest first)
- Dataset preview cards showing:
  - Title and description
  - Quality score badge
  - Price in MON tokens
  - File size and format
  - Seller information
  - Tags and categories

**Current Status:**
- Mock data implementation
- UI fully functional
- Real blockchain transactions coming soon

### 4. Dashboard

**Location:** `/app/dashboard/page.tsx`

**Sections:**

1. **Overview Stats**
   - Total datasets owned
   - Total earnings
   - Average quality score
   - Active listings

2. **My Datasets**
   - List of uploaded datasets
   - Edit/delete functionality
   - Performance metrics

3. **Purchase History**
   - Datasets purchased
   - Transaction details
   - Download links

4. **Earnings**
   - Revenue analytics
   - Payout history
   - Pending transactions

### 5. Analytics

**Location:** `/app/analytics/page.tsx`

**Metrics Tracked:**
- Dataset views
- Download statistics
- Revenue trends
- Quality score distribution
- Market trends
- User engagement

**Visualizations:**
- Charts and graphs (coming soon)
- Real-time data updates
- Export functionality

### 6. Bounty System

**Location:** `/app/bounties/page.tsx`

**Concept:**
- Users post requests for specific datasets
- Set reward amounts in MON tokens
- Contributors submit datasets
- Automatic quality verification
- Smart contract escrow

**Workflow:**
```
Create Bounty → Contributors Submit → AI Verification → Award Winner
```

### 7. User Profiles

**Location:** `/app/profile/page.tsx`

**Features:**
- Profile information
- Reputation score
- Dataset portfolio
- Transaction history
- Badges and achievements
- Social links

---

## Technical Implementation

### App Router Structure

Montify uses Next.js 16's App Router with the following structure:

```
app/
├── layout.tsx          # Root layout (metadata, providers)
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── head.tsx            # Custom head metadata
│
├── upload/
│   └── page.tsx        # Dataset upload interface
│
├── marketplace/
│   └── page.tsx        # Browse datasets
│
├── dataset/
│   └── [id]/
│       └── page.tsx    # Individual dataset details
│
├── dashboard/
│   └── page.tsx        # User dashboard
│
├── analytics/
│   └── page.tsx        # Analytics dashboard
│
├── bounties/
│   └── page.tsx        # Bounty marketplace
│
├── profile/
│   └── page.tsx        # User profile
│
└── api/
    └── analyze/
        └── route.ts    # AI analysis API endpoint
```

### Key Implementation Details

#### 1. File Upload System

**Technologies:**
- `react-dropzone` for drag & drop
- `FileReader API` for client-side file reading
- Mock storage (decentralized coming soon)

**Code Example:**
```typescript
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  multiple: false,
  accept: {
    'text/csv': ['.csv'],
    'application/json': ['.json'],
    'application/x-parquet': ['.parquet'],
    'application/zip': ['.zip'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'audio/*': ['.mp3', '.wav', '.flac'],
    'video/*': ['.mp4', '.avi', '.mov'],
  },
  maxSize: 10 * 1024 * 1024 * 1024, // 10 GB
});
```

#### 2. AI Analysis Flow

**Step 1: Client-side File Reading**
```typescript
export async function readJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.readAsText(file);
  });
}
```

**Step 2: API Route Call**
```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonData }),
});
```

**Step 3: Server-side AI Analysis**
```typescript
// /app/api/analyze/route.ts
const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: "You are a data quality expert..."
    },
    {
      role: "user",
      content: `Analyze this dataset: ${JSON.stringify(jsonData)}`
    }
  ],
  model: "llama-3.3-70b-versatile",
  temperature: 0.5,
});
```

#### 3. State Management

**Upload Page State:**
```typescript
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);
const [blobId, setBlobId] = useState<string | null>(null);
const [uploadComplete, setUploadComplete] = useState(false);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [aiAnalysis, setAiAnalysis] = useState<DatasetAnalysis | null>(null);
const [currentStep, setCurrentStep] = useState(1);
```

#### 4. Animation System

**Framer Motion Variants:**
```typescript
// lib/motionVariants.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## Directory Structure

### Complete File Tree

```
montify/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage (Hero + Features)
│   ├── globals.css               # Global Tailwind styles
│   ├── head.tsx                  # Custom head metadata
│   ├── icon.tsx                  # Favicon generator
│   ├── apple-icon.tsx            # Apple touch icon
│   │
│   ├── upload/
│   │   └── page.tsx              # Dataset upload wizard
│   │
│   ├── marketplace/
│   │   └── page.tsx              # Dataset marketplace
│   │
│   ├── dataset/
│   │   └── [id]/
│   │       └── page.tsx          # Dataset detail page
│   │
│   ├── dashboard/
│   │   └── page.tsx              # User dashboard
│   │
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   │
│   ├── bounties/
│   │   └── page.tsx              # Bounty system
│   │
│   ├── profile/
│   │   └── page.tsx              # User profile
│   │
│   └── api/
│       └── analyze/
│           └── route.ts          # AI analysis API
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Page footer
│   │   ├── Logo.tsx              # Brand logo
│   │   ├── Button.tsx            # Custom button
│   │   ├── Input.tsx             # Form input
│   │   ├── Modal.tsx             # Modal dialog
│   │   ├── GlassCard.tsx         # Glassmorphism card
│   │   ├── StatCard.tsx          # Statistics card
│   │   └── Hero/
│   │       ├── Hero.tsx          # Hero section
│   │       ├── HeroParticles.tsx # 3D particles
│   │       └── Particles.tsx     # Particle system
│   │
│   └── features/                 # Feature-specific components
│       ├── dataset/
│       │   ├── DatasetCard.tsx   # Marketplace card
│       │   ├── DatasetGrid.tsx   # Grid layout
│       │   ├── FilterSidebar.tsx # Filters & sorting
│       │   └── PurchaseModal.tsx # Purchase dialog
│       │
│       └── marketplace/
│           ├── DatasetCard.tsx   # Dataset preview card
│           ├── DatasetGrid.tsx   # Grid container
│           └── FilterSidebar.tsx # Filter controls
│
├── lib/                          # Core utilities & services
│   ├── ai/
│   │   └── groqService.ts        # Groq AI integration
│   │
│   ├── context/
│   │   └── ToastContext.tsx      # Toast notifications
│   │
│   ├── mockData/
│   │   └── datasets.ts           # Mock dataset data
│   │
│   ├── cn.ts                     # Tailwind class merger
│   └── motionVariants.ts         # Framer Motion presets
│
├── public/                       # Static assets
│   └── logo.jpg                  # Brand logo
│
├── Datasets/                     # Sample datasets
│   └── healthcare_sample.json    # Healthcare demo data
│
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Example env file
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── package-lock.json             # Dependency lock
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config
│
├── README.md                     # Project readme
├── BRANDING.md                   # Brand guidelines
├── DOCUMENTATION.md              # This file
└── LICENSE                       # MIT License
```

---

## Component Documentation

### UI Components

#### Navbar Component
**File:** `components/ui/Navbar.tsx`

**Features:**
- Sticky header with scroll detection
- Responsive mobile menu
- Glassmorphism effect
- Connect wallet button (placeholder)
- Navigation links with hover effects

**Props:** None (uses global state)

**Usage:**
```tsx
import { Navbar } from '@/components/ui/Navbar';

<Navbar />
```

#### Logo Component
**File:** `components/ui/Logo.tsx`

**Props:**
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}
```

**Sizes:**
- `sm`: 32px icon
- `md`: 40px icon
- `lg`: 48px icon

**Usage:**
```tsx
<Logo size="md" showText={true} />
```

#### GlassCard Component
**File:** `components/ui/GlassCard.tsx`

**Features:**
- Glassmorphism effect
- Border glow on hover
- Customizable padding
- Dark/light mode support

**Props:**
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
```

#### Modal Component
**File:** `components/ui/Modal.tsx`

**Features:**
- Animated entrance/exit
- Backdrop click to close
- ESC key handler
- Focus trap
- Portal rendering

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

#### ConnectWalletButton Component
**File:** `components/ui/ConnectWalletButton.tsx`

**Features:**
- MetaMask/Web3 wallet integration
- Monad testnet automatic switching
- Real-time balance display
- Network status indicator
- Dropdown with wallet details
- Transaction history link

**States:**
- Disconnected: Shows "Connect Wallet" button
- Connected (Correct Network): Shows address, balance, and status
- Connected (Wrong Network): Shows warning and switch button

**Usage:**
```tsx
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';

<ConnectWalletButton />
```

**Wallet Integration:**
```tsx
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';

const { address, isConnected, chainId, balance, connect, disconnect } = useMonadWallet();
```

### Feature Components

#### DatasetCard Component
**File:** `components/features/marketplace/DatasetCard.tsx`

**Displays:**
- Dataset title and description
- Quality score badge
- Price in MON tokens
- File size and format
- Category tags
- Action buttons

**Props:**
```typescript
interface Dataset {
  id: string;
  title: string;
  description: string;
  qualityScore: number;
  price: number;
  category: string;
  format: string;
  size: string;
  imageUrl: string;
  tags: string[];
}
```

#### FilterSidebar Component
**File:** `components/features/marketplace/FilterSidebar.tsx`

**Filters:**
- Quality score range (0-100)
- Price range
- Category selection
- Data type selection
- Sort options

**Props:**
```typescript
interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
  onSortChange: (sort: SortOption) => void;
}
```

#### Hero Component
**File:** `components/ui/Hero/Hero.tsx`

**Features:**
- 3D particle background (Three.js)
- Animated text effects
- Call-to-action buttons
- Responsive layout
- Glassmorphism cards

**Animations:**
- Fade in on mount
- Staggered text reveal
- Floating particles

---

## Wallet Integration

### Monad Testnet Configuration

**Network Details:**
- **Chain ID:** 10143 (0x279F in hex)
- **Network Name:** Monad Testnet
- **RPC URL:** https://testnet-rpc.monad.xyz
- **Currency Symbol:** MON
- **Block Explorer:** https://testnet.monadexplorer.com

### MonadWalletProvider

**File:** `lib/wallet/MonadWalletProvider.tsx`

**Purpose:** React Context provider for managing wallet connection state across the application.

**Features:**
- Automatic wallet detection (MetaMask, etc.)
- Network switching with automatic Monad testnet addition
- Real-time balance updates
- Event listeners for account/network changes
- Auto-reconnect on page refresh

**Context Values:**
```typescript
interface MonadWalletContextType {
  address: string | null;           // Connected wallet address
  isConnected: boolean;              // Connection status
  chainId: number | null;            // Current chain ID
  balance: string | null;            // MON balance (in ETH format)
  connect: () => Promise<void>;      // Connect wallet function
  disconnect: () => void;            // Disconnect wallet function
  switchToMonad: () => Promise<void>; // Switch to Monad testnet
  provider: ethers.BrowserProvider | null;  // Ethers provider
  signer: ethers.Signer | null;     // Ethers signer
}
```

**Usage in Components:**
```typescript
import { useMonadWallet } from '@/lib/wallet/MonadWalletProvider';

function MyComponent() {
  const { 
    address, 
    isConnected, 
    chainId, 
    balance, 
    connect, 
    disconnect,
    provider,
    signer 
  } = useMonadWallet();

  // Check if connected
  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  // Check if on correct network
  if (chainId !== 10143) {
    return <p>Please switch to Monad Testnet</p>;
  }

  // Use wallet
  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} MON</p>
    </div>
  );
}
```

### Wallet Connection Flow

**1. Initial Connection:**
```
User clicks "Connect Wallet" 
→ MetaMask prompts for permission
→ User approves
→ Check network (10143?)
→ If wrong network, auto-switch
→ If network doesn't exist, add it
→ Fetch balance
→ Update context state
```

**2. Network Switching:**
```typescript
const switchToMonad = async () => {
  try {
    // Try to switch
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x279F' }], // 10143
    });
  } catch (error) {
    // Network doesn't exist, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x279F',
          chainName: 'Monad Testnet',
          nativeCurrency: {
            name: 'Monad',
            symbol: 'MON',
            decimals: 18,
          },
          rpcUrls: ['https://testnet-rpc.monad.xyz'],
          blockExplorerUrls: ['https://testnet.monadexplorer.com'],
        }],
      });
    }
  }
};
```

**3. Event Listeners:**
- `accountsChanged`: Updates address, re-fetches balance
- `chainChanged`: Updates chain ID, reloads page (recommended by MetaMask)
- `disconnect`: Clears wallet state

### Wallet-Gated Features

**Upload Page:**
- Requires wallet connection before file upload
- Checks for Monad testnet
- Displays wallet status banner
- Shows connected address

**Marketplace (Future):**
- Purchase datasets
- Create listings
- Manage transactions

**Dashboard (Future):**
- View owned datasets
- Track earnings
- Withdraw funds

### Testing Wallet Integration

**Local Testing:**
1. Install MetaMask browser extension
2. Create/import wallet
3. Visit application (localhost:3000)
4. Click "Connect Wallet"
5. Approve connection in MetaMask
6. MetaMask will auto-add Monad testnet
7. Switch to Monad testnet
8. Test features

**Getting Test MON:**
- Monad testnet faucet (check Monad Discord/docs)
- Community faucets

### Security Considerations

**Private Keys:**
- ✅ Never stored on server
- ✅ Managed by user's wallet (MetaMask)
- ✅ All signing happens client-side

**RPC Calls:**
- ✅ Read-only by default
- ✅ Write operations require user signature
- ✅ Transaction details shown to user before signing

**Best Practices:**
- Never request private keys
- Always show transaction details
- Use ethers.js for secure signing
- Validate all inputs before blockchain interaction

---

## API & Services

### API Routes

#### POST /api/analyze

**Purpose:** Analyze dataset quality using Groq AI

**Request:**
```typescript
{
  jsonData: any  // JSON dataset to analyze
}
```

**Response:**
```typescript
{
  analysis: DatasetAnalysis
}
```

**Error Responses:**
```typescript
// 400 Bad Request
{
  error: "No data provided"
}

// 500 Internal Server Error
{
  error: "AI analysis failed: [error message]"
}
```

**Implementation:**
```typescript
// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { jsonData } = await request.json();
    
    if (!jsonData) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    // Call Groq AI
    const completion = await groq.chat.completions.create({
      messages: [...],
      model: "llama-3.3-70b-versatile",
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json(
      { error: `AI analysis failed: ${error.message}` },
      { status: 500 }
    );
  }
}
```

### Services

#### Groq AI Service

**File:** `lib/ai/groqService.ts`

**Functions:**

1. **analyzeDataset(jsonData: any): Promise<DatasetAnalysis>**
   - Analyzes a JSON dataset
   - Calls `/api/analyze` endpoint
   - Returns quality metrics

2. **canAnalyzeFile(file: File): boolean**
   - Checks if file can be analyzed
   - Returns true for JSON files

3. **readJsonFile(file: File): Promise<any>**
   - Reads and parses JSON file
   - Returns parsed object
   - Throws error for invalid JSON

**Groq Models Available:**
```typescript
export const GROQ_MODELS = {
  MIXTRAL: 'mixtral-8x7b-32768',      // Fast, balanced
  LLAMA3_70B: 'llama3-70b-8192',      // Most powerful
  LLAMA3_8B: 'llama3-8b-8192',        // Fastest
  LLAMA33_70B: 'llama-3.3-70b-versatile', // Currently used
  GEMMA_7B: 'gemma-7b-it',            // Google's model
};
```

---

## Data Models & Types

### TypeScript Interfaces

#### DatasetAnalysis
```typescript
interface DatasetAnalysis {
  qualityScore: number;        // 0-100
  diversity: number;           // 0-100
  accuracy: number;            // 0-100
  completeness: number;        // 0-100
  consistency: number;         // 0-100
  bias: 'low' | 'medium' | 'high';
  insights: string[];
  recommendations: string[];
  statistics: {
    totalRecords: number;
    totalFields: number;
    missingDataPercentage: number;
    dataTypes: string[];
  };
}
```

#### Dataset
```typescript
interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  price: number;
  qualityScore: number;
  uploadDate: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  tags: string[];
  imageUrl: string;
  blobId?: string;
  analysis?: DatasetAnalysis;
}
```

#### User
```typescript
interface User {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  reputation: number;
  datasets: Dataset[];
  purchases: Purchase[];
  earnings: number;
}
```

#### Purchase
```typescript
interface Purchase {
  id: string;
  datasetId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  timestamp: number;
  txHash: string;
}
```

---

## Styling & Design System

### Color Palette

**Primary Colors:**
```css
--color-accent-pink: #FF2CB2;
--color-accent-magenta: #C400FF;
--color-accent-teal: #00D9B3;
--color-accent-orange: #FF9500;
--color-accent-green: #30D158;
```

**Neutral Colors:**
```css
--color-bg-base: #0A0A0B;
--color-bg-elevated: #1C1C1E;
--color-bg-surface: #2C2C2E;
--color-fg-primary: #FFFFFF;
--color-fg-secondary: #A1A1A6;
--color-fg-tertiary: #636366;
--color-border-DEFAULT: #38383A;
```

### Typography

**Font Families:**
- Display: Default system font stack
- Body: Default system font stack

**Font Sizes:**
```css
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
text-2xl: 1.5rem;    /* 24px */
text-3xl: 1.875rem;  /* 30px */
text-4xl: 2.25rem;   /* 36px */
text-5xl: 3rem;      /* 48px */
```

### Spacing System

Uses Tailwind's default spacing scale (0.25rem increments)

### Glassmorphism Effect

```css
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### Gradient System

**Primary Gradient:**
```css
background: linear-gradient(135deg, #FF2CB2 0%, #C400FF 100%);
```

**Mesh Gradient:**
```css
background: linear-gradient(135deg, 
  #FF2CB2 0%, 
  #C400FF 50%, 
  #00D9B3 100%
);
```

### Shadow System

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
shadow-glow-pink: 0 0 20px rgba(255, 44, 178, 0.5);
```

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` file:

```bash
# Groq AI API Key (Required for AI analysis)
GROQ_API_KEY=gsk_your_api_key_here

# Monad Blockchain (Coming Soon)
# NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
# NEXT_PUBLIC_MONAD_CHAIN_ID=123

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Getting API Keys

**Groq API Key:**
1. Visit https://console.groq.com
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into `.env.local`

**Groq Limits (Free Tier):**
- 30 requests per minute
- 14,400 requests per day
- No cost

---

## Deployment Guide

### Vercel Deployment (Recommended)

**Prerequisites:**
- GitHub/GitLab/Bitbucket repository
- Vercel account

**Steps:**

1. **Push to Git Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your Git repository
- Configure project:
  - Framework Preset: Next.js
  - Root Directory: ./
  - Build Command: `npm run build`
  - Output Directory: `.next`

3. **Add Environment Variables**
- Go to Project Settings → Environment Variables
- Add `GROQ_API_KEY`
- Click Save

4. **Deploy**
- Click Deploy
- Wait for build to complete
- Visit your live URL

**Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records
- Wait for SSL certificate

### Manual Deployment

**Build for Production:**
```bash
npm run build
npm start
```

**Using Docker:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy to VPS:**
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone <repo-url>
cd montify
npm install
npm run build

# Start with PM2
pm2 start npm --name "montify" -- start
pm2 save
pm2 startup
```

---

## Development Workflow

### Setup Development Environment

```bash
# 1. Clone repository
git clone <repo-url>
cd montify

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Start development server
npm run dev
```

### Development Scripts

```bash
# Start dev server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent fixes

**Commit Convention:**
```
type(scope): subject

feat: Add new dataset filter
fix: Resolve upload progress bug
docs: Update API documentation
style: Format code with prettier
refactor: Restructure component hierarchy
test: Add unit tests for AI service
chore: Update dependencies
```

---

## Testing Strategy

### Current Status
- ✅ Manual testing
- 🚧 Unit tests (coming soon)
- 🚧 Integration tests (coming soon)
- 🚧 E2E tests (coming soon)

### Planned Test Coverage

**Unit Tests (Jest + React Testing Library):**
```typescript
// Example: groqService.test.ts
describe('Groq AI Service', () => {
  it('should analyze dataset successfully', async () => {
    const data = { /* sample data */ };
    const analysis = await analyzeDataset(data);
    expect(analysis.qualityScore).toBeGreaterThan(0);
  });
});
```

**Integration Tests:**
- API route testing
- Database integration
- Blockchain interaction

**E2E Tests (Playwright):**
```typescript
test('upload and analyze dataset', async ({ page }) => {
  await page.goto('/upload');
  await page.setInputFiles('input[type="file"]', 'sample.json');
  await page.click('button:has-text("Upload")');
  await expect(page.locator('.quality-score')).toBeVisible();
});
```

---

## Performance Optimization

### Current Optimizations

1. **Next.js Features:**
   - Server-side rendering for SEO
   - Static generation where possible
   - Image optimization with next/image
   - Font optimization
   - Code splitting

2. **React Optimizations:**
   - React.memo for expensive components
   - useMemo for computed values
   - useCallback for event handlers
   - Lazy loading for heavy components

3. **Bundle Optimization:**
   - Turbopack for fast builds
   - Tree shaking
   - Dynamic imports
   - Chunk splitting

4. **Asset Optimization:**
   - WebP images
   - SVG optimization
   - CSS purging with Tailwind

### Performance Metrics

**Target Metrics:**
- Lighthouse Score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

### Monitoring

**Recommended Tools:**
- Vercel Analytics
- Google Lighthouse
- WebPageTest
- Chrome DevTools Performance

---

## Security Considerations

### Current Security Measures

1. **API Key Protection:**
   - GROQ_API_KEY stored server-side only
   - Never exposed to client
   - Environment variable isolation

2. **Input Validation:**
   - File type checking
   - File size limits (10 GB)
   - JSON parsing with error handling

3. **HTTPS:**
   - Enforced on Vercel
   - SSL certificates auto-renewed

4. **CORS:**
   - Restricted API endpoints
   - Same-origin policy

### Future Security (Blockchain Integration)

1. **Wallet Security:**
   - User controls private keys
   - No key storage on servers
   - Hardware wallet support

2. **Smart Contract Security:**
   - Audited contracts
   - Reentrancy protection
   - Access control
   - Pausable functionality

3. **Data Encryption:**
   - Client-side encryption before upload
   - Decryption keys via blockchain
   - Zero-knowledge proofs

---

## Future Roadmap

### Phase 1: MVP (Current)
- ✅ AI quality analysis
- ✅ Upload interface
- ✅ Marketplace UI
- ✅ Mock data

### Phase 2: Blockchain Integration (Q1 2026)
- ✅ Monad smart contracts
- ✅ Wallet connectivity
- 🚧 NFT certificate minting
- 🚧 On-chain transactions

### Phase 3: Decentralized Storage (Q2 2026)
- 🔜 IPFS/Arweave integration
- 🔜 Encrypted file storage
- 🔜 Distributed file retrieval
- 🔜 Content addressing

### Phase 4: Advanced Features (Q3 2026)
- 🔜 Dataset versioning
- 🔜 Collaborative datasets
- 🔜 API marketplace
- 🔜 Data licensing system

### Phase 5: Ecosystem Growth (Q4 2026)
- 🔜 DAO governance
- 🔜 Staking & rewards
- 🔜 Cross-chain compatibility
- 🔜 Mobile apps

---

## Troubleshooting

### Common Issues

#### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: AI analysis fails
**Causes:**
- Missing GROQ_API_KEY
- Invalid API key
- Rate limit exceeded
- Invalid JSON data

**Solutions:**
1. Check `.env.local` file exists
2. Verify API key is correct
3. Wait for rate limit reset
4. Validate JSON format

#### Issue: Styling not working
**Solution:**
```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./dist/output.css

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Issue: Build fails on Vercel
**Checklist:**
- [ ] All dependencies in package.json
- [ ] Environment variables set in Vercel
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Build succeeds locally (`npm run build`)

### Debug Mode

**Enable Verbose Logging:**
```bash
# .env.local
NEXT_PUBLIC_DEBUG=true
```

**Console Logs in AI Service:**
```typescript
console.log('🤖 Starting Groq AI analysis...');
console.log('✅ Analysis completed successfully');
console.log('📊 Quality Score:', analysis.qualityScore);
```

---

## Contributing Guidelines

### How to Contribute

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Code Standards

**TypeScript:**
- Use strict mode
- Define all types explicitly
- No `any` types (use `unknown` if necessary)

**React:**
- Functional components only
- Hooks for state management
- Props interface for all components

**Styling:**
- Tailwind CSS utility classes
- Custom CSS only when necessary
- Follow design system

**Testing:**
- Write tests for new features
- Maintain >80% coverage
- Test edge cases

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Comments added where necessary
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors
- [ ] Lighthouse score >90

---

## License & Credits

### License

MIT License - see [LICENSE](./LICENSE) file

### Credits

**Built by:** Montify Team  
**Powered by:**
- Next.js by Vercel
- Groq AI
- Monad Blockchain
- Tailwind CSS
- Framer Motion
- Three.js

**Special Thanks:**
- Groq for free AI API
- Monad for blockchain infrastructure
- Vercel for hosting
- Open source community

---

## Appendix

### Useful Links

- **Live Demo:** https://montify.vercel.app
- **GitHub:** [Your GitHub URL]
- **Twitter:** @montify_io
- **Discord:** [Your Discord Invite]
- **Documentation:** This file

### Glossary

- **NFT** - Non-Fungible Token
- **MON** - Monad native token
- **AI** - Artificial Intelligence
- **LLM** - Large Language Model
- **JSON** - JavaScript Object Notation
- **CSV** - Comma-Separated Values
- **API** - Application Programming Interface
- **SDK** - Software Development Kit

### Version History

**v0.1.0** (November 29, 2025)
- Initial release
- AI quality analysis
- Upload system
- Marketplace UI
- Mock data implementation

---

**Last Updated:** November 29, 2025  
**Document Version:** 1.0.0  
**Project Status:** Active Development

For questions or support, please open an issue on GitHub or contact the team.
