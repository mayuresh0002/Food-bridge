# FoodBridge 🥑
### Decentralized Platform for Surplus Food Allocation

**FoodBridge** is a modern Web3-powered social impact platform connecting surplus food donors (restaurants, hotels, supermarkets) directly with verified distribution networks (NGOs, shelters, community centers) while maintaining an immutable, traceable record of every donation on the Polygon blockchain.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
# Clone or navigate to the project directory
cd c:/Users/jayga/Music/Mayuresh

# Install dependencies
npm install
```

### 2. Running Locally (Development Mode)
```bash
npm run dev
```
The application will launch locally at: **`http://localhost:5173/`**

### 3. Production Build & Preview
```bash
# Type-check and compile bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔑 Demo Login Credentials & Accounts

You can instantly switch roles using the **Role Switcher Dropdown** in the top navigation bar or use the prefilled credentials:

| Role | Entity Name | Demo Email | Wallet Address | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Donor** | FreshBite Restaurant | `donor@freshbite.org` | `0x742d...91FA` | Verified |
| **Donor** | GreenLeaf Hotel & Suites | `events@greenleafhotel.com` | `0x3F28...48B2` | Verified |
| **NGO** | Hope Foundation Relief | `ngo@hopefoundation.org` | `0x8A2B...92BC` | Verified |
| **NGO** | FoodCare Network | `intake@foodcarenet.org` | `0x4D5e...1234` | Verified |
| **Admin** | FoodBridge Governance | `admin@foodbridge.io` | `0x0000...ADMIN` | Platform Admin |

*Password for all demo accounts: `demo12345`*

---

## 🏗️ Project Architecture & File Structure

```
c:/Users/jayga/Music/Mayuresh/
├── contracts/
│   └── FoodBridgeDonation.sol       # Solidity Smart Contract (Solidity 0.8.20)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.tsx        # Login & Web3 Wallet Authentication
│   │   ├── common/
│   │   │   ├── DemoModeBanner.tsx   # Top Demo Mode status toggle banner
│   │   │    font-mono LeafletMap.tsx # Interactive route map visualizer
│   │   │   ├── MatchingScoreModal.tsx# Detailed scoring breakdown modal
│   │   │   ├── QRCodeGenerator.tsx  # Dynamic SVG QR code generator with download
│   │   │   ├── QRCodeScannerModal.tsx# Optical camera scanner simulation
│   │   │   ├── StatCard.tsx         # Dashboard metrics card
│   │   │   ├── StatusBadge.tsx      # Donation status pill badge
│   │   │   ├── Toast.tsx            # Floating toast notification system
│   │   │   ├── VerificationBadge.tsx# Identity verification badge
│   │   │   └── WorkflowProgress.tsx # Visual 11-step progress timeline
│   │   └── layout/
│   │       ├── Footer.tsx           # Startup footer with stack info
│   │       └── Navbar.tsx           # Top navigation with role & wallet selectors
│   ├── context/
│   │   └── AppContext.tsx           # Global React Context state management
│   ├── data/
│   │   └── mockData.ts              # Seed data for donors, NGOs, donations & txs
│   ├── pages/
│   │   ├── AdminDashboard.tsx       # Platform verification queue & oversight
│   │   ├── BlockchainDashboard.tsx  # Polygon Amoy block explorer & timeline
│   │   ├── DonorDashboard.tsx       # Surplus listing creation & donor overview
│   │   ├── LandingPage.tsx          # Hero, node network diagram, stats & impact chart
│   │   ├── LogisticsPage.tsx        # Active shipment tracking & EV dispatch
│   │   ├── MatchingEnginePage.tsx   # Interactive P2P algorithm inspect page
│   │   ├── NGODashboard.tsx         # Discovery feed with multi-parameter filter
│   │   └── TraceabilityPage.tsx     # Public audit lookup & proof certificate
│   ├── services/
│   │   ├── blockchain/
│   │   │   ├── contractService.ts   # Smart contract invocation layer
│   │   │   ├── transactionService.ts# Transaction hash & explorer helper
│   │   │   └── walletService.ts     # MetaMask EIP-1193 & demo fallback
│   │   ├── ipfsService.ts           # IPFS metadata CID upload abstraction
│   │   └── matchingEngine.ts        # Haversine & 5-factor scoring engine
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.tsx                      # Root component
│   └── index.css                    # Tailwind CSS directives & theme styles
├── tailwind.config.js               # Theme color palette & shadows
└── index.html                       # Base HTML file with SEO & Google Fonts
```

---

## 📜 Smart Contract Lifecycle (`FoodBridgeDonation.sol`)

The platform's on-chain workflow executes the following state transitions:

```
[createDonation] ➔ [acceptDonation] ➔ [confirmPickup] ➔ [confirmDelivery] ➔ [completeDonation]
```

### Events Emitted on Polygon Amoy:
1. `DonationCreated(donationId, donorAddress, foodName, quantity, ipfsHash)`
2. `DonationMatched(donationId, ngoAddress, compatibilityScore)`
3. `DonationAccepted(donationId, ngoAddress, timestamp)`
4. `PickupConfirmed(donationId, logisticsPartner, pickupTimestamp)`
5. `DeliveryConfirmed(donationId, recipientNgo, deliveryTimestamp)`
6. `DonationCompleted(donationId, timestamp, verificationHash)`

---

## ⚙️ Complete End-to-End Demo Flow

1. **Donor Login & Dashboard**:
   - Switch role to `FreshBite Restaurant` (`Donor`).
   - Navigate to `/dashboard/donor` and click **Create Donation**.
   - Submit a surplus food item (e.g. `120 Prepared Meals`).
   - Notice the instant IPFS CID generation and Polygon Amoy transaction minting.

2. **P2P Matching Engine**:
   - Navigate to **Matching Engine**.
   - Inspect the 5-factor deterministic compatibility breakdown (Location 95%, Food Type 100%, Quantity 90%, Urgency 88%, Capacity 95% = **94% Match**).

3. **NGO Discovery & Acceptance**:
   - Switch role to `Hope Foundation Relief` (`NGO`).
   - Navigate to `/dashboard/ngo` to discover available food listings within specified radius filters.
   - Click **View & Accept**, inspect the matching breakdown, and click **Accept & Sign Smart Contract**.

4. **Blockchain Event Verification**:
   - Navigate to **Blockchain & Contracts** to see the transaction confirmed on Polygon Amoy Testnet with gas usage and block height.

5. **Cold-Chain Logistics Tracking**:
   - Navigate to **Logistics** to view the live GPS route map, assigned driver, and shipment status timeline (`Pickup Assigned ➔ In Transit ➔ Delivered`).

6. **Public Traceability & QR Code Verification**:
   - Navigate to **Traceability** or click **QR Trace**.
   - Download the SVG QR Code or scan it using the embedded **QR Scanner** to view the immutable audit certificate and proof on PolygonScan.

---

## 🌿 Technical Stack Summary

- **Frontend Framework**: React 18 + Vite + TypeScript
- **Styling & Aesthetics**: Tailwind CSS (Navy `#0B1220`, Electric Cyan `#06B6D4`, Emerald `#10B981`)
- **Web3 Architecture**: Ethers.js, Solidity 0.8.20, Polygon Amoy Testnet abstraction
- **Storage Layer**: IPFS CID metadata upload abstraction
- **Data Visualizations**: Recharts area charts, Haversine geo-distance, QRCodeSVG, Leaflet route maps
- **Icons & UI**: Lucide Icons, Framer-inspired micro-animations, Canvas Confetti

---

## 📄 License & Project Context
College Project Prototype / Demonstration. Architecture is Web3-ready for live Polygon Mainnet / Amoy deployment.
