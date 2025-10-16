# Zama fhEVM Block Explorer

A blockchain explorer specifically designed for Zama.ai's fhEVM (Fully Homomorphic Encryption Virtual Machine) protocol. This explorer showcases encrypted transaction tracking, ACL visualization, coprocessor status monitoring, and real-time block updates.

## Project Overview

This block explorer adapts the familiar Etherscan interface for Zama's unique FHE architecture, where transaction values are encrypted and displayed as cryptographic handles rather than plaintext values.

### Key Features

- **Real-time Block Updates**: WebSocket integration provides live block and transaction updates
- **Encrypted Data Visualization**: Purple badges indicate encrypted data types (euint64, euint32, ebool, eaddress, etc.)
- **Comprehensive Block Information**: View detailed block data including gas usage, timestamps, and transaction counts
- **Transaction Analysis**: Detailed transaction views with encrypted parameter tracking
- **Address Explorer**: Track address activity and transaction history
- **FHE Coprocessor Status**: Monitor coprocessor job processing and decryption operations
- **ACL System Visualization**: View access control permissions for encrypted data

## Architecture

### Frontend (React + TypeScript + Vite)

**Pages:**
- `/` - Homepage with network stats and recent blocks/transactions
- `/block/:number` - Block detail page
- `/tx/:hash` - Transaction detail page  
- `/address/:address` - Address detail page

**Key Components:**
- `EncryptedBadge` - Displays encrypted data type indicators
- `StatusBadge` - Shows transaction status (Success/Failed/Pending)
- `CoprocessorStatus` - FHE coprocessor monitoring dashboard
- `NetworkStats` - Network-wide statistics display
- `BlocksTable` & `TransactionsTable` - Interactive data tables

**Styling:**
- Purple accent color (280 70% 60%) for encrypted data indicators
- JetBrains Mono monospace font for handles, hashes, and addresses
- Responsive design with dark mode support
- Etherscan-inspired UI/UX

### Backend (Express + WebSocket)

**REST API Endpoints:**
- `GET /api/stats` - Network statistics
- `GET /api/blocks/latest` - Latest 10 blocks
- `GET /api/transactions/latest` - Latest 10 transactions
- `GET /api/blocks/:number` - Specific block details
- `GET /api/transactions/:hash` - Specific transaction details
- `GET /api/address/:address` - Address information and transactions

**WebSocket (`/ws`):**
- Broadcasts `new_block` events when blocks are generated
- Frontend auto-connects via `useWebSocket` hook
- Invalidates React Query cache on new blocks for automatic UI updates

**Data Storage:**
- In-memory storage (MemStorage) for development
- Stores blocks, transactions, and computed statistics

### Mock Blockchain System

Due to Zama devnet RPC (`devnet.zama.ai`) being unavailable in the Replit environment, the app uses a sophisticated mock blockchain system:

- **Block Generation**: New blocks created every 8 seconds with realistic data
- **Transaction Types**: Supports encrypted transfers, ACL operations, coprocessor jobs
- **Encrypted Values**: Represented as cryptographic handles (e.g., `0xhandle_euint64_abc123...`)
- **Data Types**: euint8, euint16, euint32, euint64, ebool, eaddress, ebytes
- **ACL System**: Mock access control lists showing permission grants/revocations

## Technical Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express, WebSocket (ws), ethers.js
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Data Validation**: Zod with Drizzle schemas
- **Icons**: Lucide React

## Development

The app is already configured to run automatically:

```bash
npm run dev  # Starts Express backend + Vite frontend on port 5000
```

WebSocket server runs on the same port (`/ws` endpoint).

## Data Models

See `shared/schema.ts` for complete type definitions.

### Block
- number, hash, timestamp, parentHash
- gasUsed, gasLimit, transactionCount
- miner address

### Transaction  
- hash, blockNumber, from, to
- value (encrypted handle for FHE txs)
- gas, gasPrice, gasUsed
- status, timestamp
- hasEncryptedData flag
- encryptedParams (array of encrypted values with type info)

### Address
- address, balance (encrypted handle)
- transactionCount, lastActive
- isContract flag

## Design Guidelines

Comprehensive design system documented in `design_guidelines.md`:
- Color palette with FHE-specific accent colors
- Typography using JetBrains Mono for blockchain data
- Component patterns for encrypted data visualization
- Spacing and layout conventions

## Known Limitations

1. **RPC Access**: Zama devnet RPC is not accessible from Replit, so the app uses mock data
2. **JsonRpcProvider Logs**: ethers.js logs connection retry messages - these are informational and don't affect functionality
3. **Historical Data**: Mock system generates limited historical blocks (starts at block 1000)

## Future Enhancements

When connecting to live Zama fhEVM:
- Replace mock data with actual RPC calls in `server/blockchain.ts`
- Set `useMockData = false` in `server/routes.ts`
- Update `ZAMA_RPC_URL` if devnet URL changes
- Add pagination for large block/transaction lists
- Implement advanced search and filtering
- Add contract verification features

## Recent Changes

**2025-10-16**: 
- Implemented WebSocket real-time updates
- Created `useWebSocket` hook for frontend
- Fixed backend to skip RPC polling when using mock data
- Added cache invalidation on new block events
- Completed end-to-end testing with Playwright verification
