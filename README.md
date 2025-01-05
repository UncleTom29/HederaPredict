# HederaPredict

BSC Testnet Deployment: https://testnet.bscscan.com/address/0xAEf867357ec1e31453E03F239d939ba2AE31Bf44

Hedera Testnet Deployment: https://hashscan.io/testnet/contract/0.0.5351100

HederaPredict leverages the Hedera Consensus Service (HCS) to ensure the integrity and immutability of data used for predictive analytics. By using real-time, tamper-proof logs of supply chain activities, weather patterns, and market trends, the platform empowers businesses to optimize operations and mitigate risks. Through advanced AI models trained on Hedera-verified data, HederaPredict provides actionable insights, such as identifying supply chain bottlenecks or forecasting commodity price shifts. 

Applications extend beyond supply chains to include financial market analysis and urban planning. The secure and scalable nature of Hedera ensures that businesses and institutions can rely on fast, cost-effective data processing without compromising transparency. HederaPredict thus represents a fusion of AI's predictive power with Hedera's DLT reliability.

Hedera Topic ID (Testnet): https://hashscan.io/testnet/topic/0.0.5332178

# HederaPredict: Multi-Chain Supply Chain Prediction DApp

HederaPredict is a decentralized application that provides AI-powered predictive analytics for supply chain management. Deployed on both Hedera and BSC networks, it leverages machine learning models and blockchain technology to deliver secure, transparent, and accurate supply chain predictions.


## Features

- 🔮 **AI-Powered Predictions**: Advanced machine learning models for supply chain disruption prediction
- ⛓️ **Multi-Chain Support**: 
  - Hedera Testnet/Mainnet integration
  - BSC Testnet/Mainnet integration
- 📊 **Real-time Analytics**: Interactive dashboards with supply chain metrics and KPIs
- 🔐 **Multi-Wallet Integration**: 
  - Hedera wallet connectivity via DAppConnector
  - BSC wallet connectivity via WalletConnect v2
- 📈 **Performance Tracking**: Monitor prediction accuracy and system performance
- 📁 **CSV Data Support**: Easy upload and analysis of supply chain data
- 🔄 **Cross-Chain Compatibility**: Unified interface for both networks

## Technology Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations

### Blockchain
- Hedera Network Integration:
  - @hashgraph/sdk
  - @hashgraph/hedera-wallet-connect
- BSC Integration:
  - wagmi v2
  - viem v2
  - Web3Modal

### Smart Contracts
- Solidity v0.8.19
- OpenZeppelin Contracts
- Hardhat + Ignition

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- A Hedera testnet/mainnet account
- A BSC testnet/mainnet wallet
- MetaMask or WalletConnect compatible wallet

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hederapredict.git
cd hederapredict
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_HEDERA_TOPIC_ID=your_hedera_topic_id
```

4. Start the development server:
```bash
npm run dev
```

## Smart Contract Deployment

1. Install Hardhat and dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ignition
```

2. Configure networks in hardhat.config.ts:
```typescript
export default {
  solidity: "0.8.19",
  networks: {
    hedera_testnet: {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 296
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 97
    }
  }
};
```

3. Deploy using Ignition:
```bash
# Hedera Testnet
npx hardhat ignition deploy ignition/HederaPredictModule.ts --network hedera_testnet

# BSC Testnet
npx hardhat ignition deploy ignition/HederaPredictModule.ts --network bsc_testnet
```

## Usage

### Connecting Wallets

1. Hedera Wallet:
   - Click "Connect Hedera Wallet"
   - Select your Hedera-compatible wallet
   - Approve the connection

2. BSC Wallet:
   - Click "Connect BSC Wallet"
   - Scan QR code or select wallet
   - Approve the connection

### Submitting Predictions

1. Upload Data:
   - Prepare CSV files with supply chain metrics
   - Use the upload interface
   - Supported metrics: disruptions, efficiency, cost, lead time, inventory levels, quality score

2. View Results:
   - Monitor prediction status
   - Review confidence scores
   - Track transaction history

## Smart Contract Functions

### Core Functions
```solidity
function submitPrediction(
    SupplyChainMetrics memory _metrics,
    Prediction memory _prediction,
    uint256 _confidence
) external payable returns (bytes32)

function confirmPrediction(bytes32 _id) external

function getPrediction(bytes32 _id) external view returns (PredictionData memory)
```

### Admin Functions
```solidity
function authorizePredictor(address _predictor, bool _status) external onlyOwner
function setConfidenceThreshold(uint256 _newThreshold) external onlyOwner
function setPredictionFee(uint256 _newFee) external onlyOwner
```


# HederaPredict: Supply Chain Prediction DApp

HederaPredict is a decentralized application built on the Hedera network that provides AI-powered predictive analytics for supply chain management. It leverages machine learning models and blockchain technology to deliver secure, transparent, and accurate supply chain predictions.


## Features

- 🔮 **AI-Powered Predictions**: Advanced machine learning models for supply chain disruption prediction
- ⛓️ **Blockchain Integration**: Secure storage and verification of predictions on Hedera network
- 📊 **Real-time Analytics**: Interactive dashboards with supply chain metrics and KPIs
- 🔐 **Wallet Integration**: Seamless connection with Hedera wallets using WalletConnect
- 📈 **Performance Tracking**: Monitor prediction accuracy and system performance
- 📁 **CSV Data Support**: Easy upload and analysis of supply chain data

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Hedera Network (Testnet/Mainnet)
- **Machine Learning**: TensorFlow.js
- **Data Processing**: Papaparse, Lodash
- **Visualization**: Recharts
- **UI Components**: shadcn/ui
- **Wallet Integration**: @hashgraph/hedera-wallet-connect


## Installation

1. Clone the repository:
```bash
git clone https://github.com/UncleTom29/HederaPredict.git
cd hederapredict
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. **Connect Wallet**
   - Click the "Connect Wallet" button
   - Select your Hedera or BSC wallet
   - Approve the connection request

2. **Upload Data**
   - Prepare your CSV files with supply chain metrics
   - Use the upload interface to submit your data
   - Supported metrics: disruptions, efficiency, cost, lead time, inventory levels, quality score

3. **View Predictions**
   - Review generated predictions in the dashboard
   - Monitor confidence scores and risk assessments
   - Track prediction accuracy over time

4. **Analyze Results**
   - Use the analytics dashboard to visualize trends
   - Export reports for further analysis
   - Review transaction history on the Hedera network

## Project Structure

```
src/
├── components/
│   ├── dapp/
│   │   ├── AnalyticsOverview.tsx
│   │   ├── RecentTransactions.tsx
│   │   └── types.ts
│   └── ui/
├── utils/
│   ├── dataProcessing.ts
│   ├── confidence.ts
│   └── metrics.ts
├── services/
│   ├── hederaService.ts
│   └── predictionService.ts
└── DApp.tsx
```

## Technical Details

### Supply Chain Metrics

The system analyzes the following metrics:
- Disruption Rate
- Operational Efficiency
- Cost Optimization
- Lead Time Performance
- Inventory Management
- Quality Scores

### Prediction Model

The TensorFlow.js model architecture:
- Input Layer: 6 neurons (one for each metric)
- Hidden Layers: 12 and 8 neurons with ReLU activation
- Output Layer: 4 neurons with sigmoid activation
- Optimization: Adam optimizer with MSE loss function

### Hedera Integration

- Uses Hedera Consensus Service (HCS) for storing predictions
- Implements WalletConnect for secure wallet connections
- Supports both testnet and mainnet environments


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## Support

For support, please open an issue in the GitHub repository or contact the team at @Tom_Tom29 on Telegram.