// import { HashConnect } from "hashconnect";

// export interface SaveData {
//   topic: string;
//   pairingString: string;
//   privateKey: string;
//   pairedWalletData: any;
//   pairedAccounts: string[];
// }

// export async function walletConnectFcn(): Promise<[HashConnect, SaveData]> {
//   console.log(`\n=======================================`);
//   console.log("- Connecting wallet...");

//   let saveData: SaveData = {
//     topic: "",
//     pairingString: "",
//     privateKey: "",
//     pairedWalletData: null,
//     pairedAccounts: [],
//   };
  
//   let appMetadata = {
//     name: "HederaPredict",
//     description: "AI-Powered Predictive Analytics for Real-Time Decision-Making",
//     icon: "https://your-icon-url.com/icon.png", // Replace with your actual icon URL
//   };
  
//   let hashconnect = new HashConnect();

//   // First init and store the pairing private key for later (this is NOT your account private key)
//   const initData = await hashconnect.init(appMetadata);
//   saveData.privateKey = initData.privKey;
//   console.log(`- Private key for pairing: ${saveData.privateKey}`);

//   // Then connect, storing the new topic for later
//   const state = await hashconnect.connect();
//   saveData.topic = state.topic;
//   console.log(`- Pairing topic is: ${saveData.topic}`);

//   // Generate a pairing string, which you can display and generate a QR code from
//   saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);

//   // Find any supported local wallets
//   hashconnect.findLocalWallets();
//   hashconnect.connectToLocalWallet(saveData.pairingString);

//   return [hashconnect, saveData];
// }

