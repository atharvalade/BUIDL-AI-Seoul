# TrueLens - Authentic News for Better Trades

## Overview

TrueLens is a decentralized platform that solves the authenticity crisis in news media, helping users make informed trading decisions based on verified information. In today's market, especially during periods of high volatility, news drives significant market movements. TrueLens uses blockchain technology, AI agents, and community verification to ensure only authentic news reaches traders.

## Problem Statement

Under the current political climate, news has become a driving force for market movements:
- The VIX has skyrocketed to COVID-era levels
- Fake news leads to misled trading decisions and potential financial losses
- Lack of verification mechanisms for news from multiple sources

## Solution

TrueLens provides a three-pronged approach:

1. **AI-Powered News Aggregation**: AI agents scrape data from multiple sources (TruthSocial, X, YouTube, etc.) to collect and analyze news items.

2. **Decentralized Verification**: 
   - Community members stake TRUE tokens to participate in news verification
   - Verified news (90%+ consensus) appears in users' feeds
   - Community flagging system to remove later-identified fake news
   - Token rewards for accurate verifiers, with a level-based reward system

3. **Trading Insights**:
   - AI summarization of verified news
   - Trading suggestions based on verified information
   - Market sentiment analysis
   - Personalized feeds tailored to user interests

## Architecture

### Blockchain Infrastructure

- **SAGA Chainlet**: Primary chain for verification and TRUE token
  - TRUEToken: ERC20 token for verification staking and rewards
  - TrueLensVerification: Smart contract for news verification
  - TrueLensHyperlaneAdapter: Adapter for cross-chain messaging

- **Rootstock Integration**: Secondary chain for pool management and rewards
  - TrueLensPool: Manages the pool of TRUE tokens
  - TrueLensLeaderboard: Tracks top verifiers and level benefits

- **Hyperlane Bridge**: Cross-chain communication between SAGA and Rootstock
  - Enables TRUE token bridging and reward distribution

### Storage

- Content stored on IPFS with hash-key verification
- Similar to archive.org but built for Web3

### Front-End

- Modern, clean UI built with Next.js and Tailwind CSS
- Feed page displaying verified news with sources
- Profile page showing user level, benefits, and token balance
- Verification marketplace for staking and earning

## Token Economics

- **TRUE Token**: Native utility token of the platform
- **Staking**: 10 TRUE tokens required to participate in verification
- **Reward Distribution**:
  - Tokens distributed to accurate verifiers
  - Higher rewards for higher-level users
  - Pool system for fair distribution
- **Level System**:
  - Users level up based on verification accuracy
  - Higher levels unlock additional benefits
  - Token swap options at higher levels for BTC, ETH, or USDC

## Getting Started

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-org/truelens.git

# Navigate to backend directory
cd truelens_backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Deploy contracts
npm run deploy:saga
npm run deploy:rootstock
npm run deploy:hyperlane
```

### Frontend Setup
```bash
# Navigate to UI directory
cd truelens_UI

# Install dependencies
npm install

# Start development server
npm run dev
```

Made with ❤️ in Seoul by Atharva
