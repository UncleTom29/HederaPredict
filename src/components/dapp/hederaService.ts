// hederaService.ts
import { 
  Client, 
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  AccountId,
  PrivateKey,
  TopicId,
  TransactionId
} from "@hashgraph/sdk";

import { PredictionData } from "./types";

export class HederaService {
  private client: Client;
  private topicId: TopicId;

  constructor(accountId: string, privateKeyString: string, topicId: string) {
    if (!privateKeyString) {
      throw new Error('Private key is required');
    }

    try {
      // Use the new recommended method for private key initialization
      // If the key is DER encoded
      let privKey: PrivateKey;
      if (privateKeyString.startsWith('302e')) {
        privKey = PrivateKey.fromStringDer(privateKeyString.trim());
      } else {
        // If the key is hex encoded ECDSA
        privKey = PrivateKey.fromStringECDSA(privateKeyString.trim());
      }

      const accId = AccountId.fromString(accountId.trim());
      
      this.client = Client.forTestnet().setOperator(accId, privKey);
      this.topicId = TopicId.fromString(topicId);
    } catch (error) {
      console.error('Failed to initialize Hedera service:', error);
      throw new Error(`Hedera service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async submitPrediction(data: PredictionData): Promise<TransactionId> {
    try {
      const message = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(JSON.stringify(data));

      const response = await message.execute(this.client);
      return response.transactionId;
    } catch (error) {
      console.error('Failed to submit prediction:', error);
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  subscribeToPredictions(callback: (data: PredictionData) => void): void {
    new TopicMessageQuery()
      .setTopicId(this.topicId)
      .subscribe(
        this.client,
        (message) => {
          if (message?.contents) {
            try {
              const data = JSON.parse(message.contents.toString()) as PredictionData;
              callback(data);
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        },
        (error) => console.error("Topic subscription error:", error)
      );
  }
}