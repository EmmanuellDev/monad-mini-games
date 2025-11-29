# Montify

# Montify - Certify Your Data on Monad

A decentralized marketplace for high-quality, AI-verified datasets built on Monad blockchain.

**🌐 Live Demo**: [https://montify.vercel.app](https://montify.vercel.app)

## 🌟 Features

### Core Functionality

- **📤 Dataset Upload**: Upload datasets (CSV, JSON, Parquet, etc.) to decentralized storage (Coming Soon)
- **🤖 AI Quality Analysis**: Automated quality assessment using Groq AI (LLaMA 3.3 70B)
- **🎨 NFT Certificates**: Mint blockchain certificates with quality scores on Monad (Coming Soon)
- **🛒 Marketplace**: Browse and discover AI-verified datasets
- **🔐 Wallet Integration**: Monad wallet support for secure transactions (Coming Soon)

### Technical Highlights

- **Decentralized Storage**: Integration with decentralized storage coming soon
- **AI Evaluation**: Comprehensive analysis (quality, diversity, accuracy, completeness, consistency, bias)
- **Blockchain Verification**: Smart contracts on Monad (Coming Soon)
- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Monad-compatible Wallet (MetaMask recommended)
- **Groq API Key** (free) - [Get one here](https://console.groq.com/keys)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd montify

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Groq API key:
# GROQ_API_KEY=gsk_your_actual_api_key_here

# Run development server
npm run dev
```

### Getting Your Groq API Key

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Click "Create API Key"
4. Copy your API key
5. Add it to `.env.local`: `GROQ_API_KEY=gsk_your_key_here`
6. Restart the dev server

**Note**: The app will work without an API key but will use mock analysis instead of real AI. See [GROQ_SETUP.md](./GROQ_SETUP.md) for detailed instructions.

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Package Versions

```json
{
  "next": "16.0.1",
  "react": "19.2.0",
  "framer-motion": "^12.23.24"
}
```

## 🏗️ Architecture

### Smart Contract

- **Network**: Monad (Coming Soon)
- **Status**: Migration from Sui to Monad in progress

### AI Analysis

- **Provider**: Groq
- **Model**: llama-3.3-70b-versatile
- **Evaluation Metrics**:
  - Quality Score (0-100)
  - Diversity Score (0-100%)
  - Accuracy Score (0-100%)
  - Completeness Score (0-100%)
  - Consistency Score (0-100%)
  - Bias Level (Low/Medium/High)

## 📁 Project Structure

```
datasetdao/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── upload/            # Dataset upload page
│   ├── marketplace/       # Browse datasets
│   └── dataset/[id]/      # Dataset details
├── components/            # React components
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components
├── lib/                   # Core utilities
│   └── ai/               # Groq AI integration
└── public/              # Static assets
```

## 🎯 Usage Guide

### 1. Connect Wallet

Connect your Monad-compatible wallet (Coming Soon).

### 2. Upload Dataset

1. Navigate to Upload page
2. Drag & drop your dataset file (max 10 GB)
3. Click "Start Upload Process"
4. AI will automatically analyze JSON datasets

### 3. NFT Certificate (Coming Soon)

Blockchain certification with Monad smart contracts will be available soon.

### 4. Browse Marketplace

- Filter by quality score, price, category
- Sort by relevance, quality, price, date
- Click dataset cards for details

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get Groq API key from: https://console.groq.com

### Smart Contract

Monad smart contract deployment coming soon.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add `GROQ_API_KEY` to Vercel environment variables.

## 📊 Features Roadmap

- [ ] Real-time dataset marketplace with purchases
- [ ] Dataset preview/sampling
- [ ] User profiles and reputation
- [ ] Advanced search and recommendations
- [ ] Dataset versioning
- [ ] Collaborative filtering
- [ ] API access tokens

## 🐛 Known Issues

- Mock data used for marketplace (real data integration pending)
- Blockchain integration with Monad in progress

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- **Monad Network**: https://monad.xyz
- **Groq AI**: https://groq.com

## 💬 Support

For issues or questions:

- Open a GitHub issue

---

**Built with ❤️ using Monad and Groq AI**

## Features

- Dataset upload with decentralized storage (Coming Soon)
- AI quality analysis using Groq
- NFT certificate minting on Monad blockchain (Coming Soon)
- Marketplace for dataset trading
- Bounty system for data collection

## Tech Stack

- Next.js 16 + TypeScript
- Monad blockchain (Solidity smart contracts - Coming Soon)
- Groq AI (llama-3.3-70b-versatile)

## Setup

```bash
npm install
npm run dev
```

Create `.env.local`:

```
GROQ_API_KEY=your_key_here
```

## Smart Contract

**Status**: Migration to Monad in progress
