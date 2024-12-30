# HederaPredict
HederaPredict leverages the Hedera Consensus Service (HCS) to ensure the integrity and immutability of data used for predictive analytics. By using real-time, tamper-proof logs of supply chain activities, weather patterns, and market trends, the platform empowers businesses to optimize operations and mitigate risks. Through advanced AI models trained on Hedera-verified data, HederaPredict provides actionable insights, such as identifying supply chain bottlenecks or forecasting commodity price shifts.

Applications extend beyond supply chains to include financial market analysis and urban planning. The secure and scalable nature of Hedera ensures that businesses and institutions can rely on fast, cost-effective data processing without compromising transparency. HederaPredict thus represents a fusion of AI's predictive power with Hedera's DLT reliability.

Hedera Topic ID (Testnet): https://hashscan.io/testnet/topic/0.0.5332178


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

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- A Hedera testnet/mainnet account
- A compatible Hedera wallet (e.g., HashPack)

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
   - Select your Hedera wallet
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

## Acknowledgments

- Hedera Network for blockchain infrastructure
- TensorFlow.js team for machine learning capabilities
- shadcn/ui for component library
- WalletConnect for wallet integration

## Support

For support, please open an issue in the GitHub repository or contact the team at @Tom_Tom29 on Telegram.