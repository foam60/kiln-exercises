# ERC-1155 NFT Claim dApp

A React + TypeScript dApp for viewing and claiming ERC-1155 NFTs on the Base Sepolia testnet.

## 🚀 Features

- **NFT Gallery**: Browse and view NFT collections with smooth carousel navigation
- **NFT Details**: Detailed view with metadata, attributes, and claiming functionality
- **Wallet Integration**: Connect with MetaMask and other injected wallets
- **ERC-1155 Claiming**: Claim NFTs directly from the Kiln1155 smart contract
- **Real-time Balance**: View your NFT balance with live updates
- **Transaction Status**: Comprehensive UI for pending, success, and error states
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Web3**: Wagmi + Viem for blockchain interactions
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Blockchain**: Base Sepolia testnet

## 📁 Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── assets/             # Static assets (images, logos)
└── main.tsx           # Application entry point
```

## 🧩 Components

### `DetailsPanel.tsx`
The main NFT details component displaying selected NFT information.

**Features:**
- NFT image display with IPFS resolution
- Metadata display (name, description, attributes)
- Share and like buttons
- "You own X" balance display
- Free mint pricing with ETH logo
- Claim button with transaction status UI
- BaseScan transaction link on success

**Props:**
- `selectedId: string | null` - ID of the selected NFT

### `KilnCard.tsx`
Information card about the Kiln project and company.

**Features:**
- Kiln logo with verified badge
- Company description
- Social media links (Twitter/X, Instagram)
- Website button with external link arrow
- Responsive grid layout

### `NFTCarousel.tsx`
Horizontal carousel displaying NFT collection items.

**Features:**
- 4 items per row on desktop
- Smooth scrolling with snap behavior
- Hover effects and prefetching
- Filtered to exclude selected NFT
- Responsive design

**Props:**
- `data: NFT[]` - Array of NFT data
- `selectedId: string | null` - Currently selected NFT ID
- `onSelect: (id: string) => void` - Selection callback

### `WalletStatus.tsx`
Wallet connection and status management component.

**Features:**
- Connect/disconnect wallet functionality
- Balance display for current chain
- Address truncation for display
- Error handling for connection issues

## 🎣 Custom Hooks

### `useNfts.ts`
Manages NFT data fetching and caching.

**Exports:**
- `useNfts()` - Fetches all NFTs from API
- `useNft(id)` - Fetches specific NFT by ID

**Features:**
- TanStack Query integration
- IPFS URL resolution
- Optimistic updates
- Error handling

### `useClaim.ts`
Handles ERC-1155 NFT claiming functionality.

**Exports:**
- `useClaim()` - Returns claim function and status

**Features:**
- Wagmi integration for contract interactions
- Transaction status tracking (pending, confirming, success, error)
- Error handling and user feedback

### `useBalance.ts`
Fetches user's NFT balance from the smart contract.

**Exports:**
- `useBalance(tokenId)` - Returns balance for specific token ID

**Features:**
- Real-time balance updates
- Contract integration via Wagmi
- Automatic refetching on account changes

## 📚 Libraries

### `lib/api.ts`
API client for fetching NFT data from the backend.

**Functions:**
- `getNfts()` - Fetch all NFTs
- `getNft(id)` - Fetch specific NFT

**Features:**
- TypeScript interfaces for API responses
- Error handling
- Base URL configuration

### `lib/ipfs.ts`
IPFS URL resolution utility.

**Functions:**
- `resolveIpfsUrl(url)` - Converts IPFS URLs to HTTP gateway URLs

**Features:**
- Multiple IPFS gateway support
- Fallback handling
- URL validation

### `lib/wagmi.ts`
Wagmi configuration for Web3 functionality.

**Configuration:**
- Base Sepolia chain setup
- Injected wallet connector
- RPC URL configuration
- Transport configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erc1155-claim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Environment Setup

The app is configured to work with:
- **Network**: Base Sepolia testnet
- **Contract**: ERC-1155 Kiln NFT contract
- **RPC**: Alchemy Base Sepolia endpoint

## 🔧 Configuration

### Smart Contract
- **Address**: `0x4b37bEa1E4049dC2bD9d12EB2E0Df4792E4a5440`
- **Standard**: ERC-1155
- **Functions**: `claim(id, amount)`, `balanceOf(owner, id)`

### API Endpoints
- **Base URL**: Configured in `lib/api.ts`
- **Endpoints**: `/nfts`, `/nfts/:id`

## 🎨 Styling

The app uses Tailwind CSS with custom configuration:
- **Custom colors**: Brand color palette
- **Responsive design**: Mobile-first approach
- **Custom utilities**: Scrollbar hiding, focus states
- **Component styling**: Consistent spacing and typography