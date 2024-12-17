import { useState } from "react";
import { HashConnect } from "hashconnect";

export interface WalletData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: null;
  pairedAccounts: string[];
}

export const useWalletConnect = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);

  const connectWallet = async () => {
    console.log(`\n=======================================`);
    console.log("- Connecting wallet...");

    let saveData: WalletData = {
      topic: "",
      pairingString: "",
      privateKey: "",
      pairedWalletData: null,
      pairedAccounts: [],
    };
    let appMetadata = {
      name: "Hedera dApp Days",
      description: "Let's buidl a dapp on Hedera",
      icon: "https://raw.githubusercontent.com/ed-marquez/hedera-dapp-days/testing/src/assets/hederaLogo.png",
    };

    let hashconnect = new HashConnect();

    // Initialize HashConnect
    const initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;
    console.log(`- Private key for pairing: ${saveData.privateKey}`);

    // Connect and store the topic
    const state = await hashconnect.connect();
    saveData.topic = state.topic;
    console.log(`- Pairing topic is: ${saveData.topic}`);

    // Generate a pairing string
    saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);

    // Find local wallets and connect
    hashconnect.findLocalWallets();
    hashconnect.connectToLocalWallet(saveData.pairingString);

    setWalletData(saveData);
    setHashconnect(hashconnect);
  };

  return { walletData, hashconnect, connectWallet };
};
