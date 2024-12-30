// src/scripts/createTopic.ts
import * as dotenv from "dotenv";
import {
  Client,
  TopicCreateTransaction,
  PrivateKey,
  AccountId
} from "@hashgraph/sdk";

// Load environment variables
dotenv.config();

async function createTopic() {
  // Check environment variables
  const operatorKey = process.env.HEDERA_PRIVATE_KEY;
  const operatorId = process.env.HEDERA_ACCOUNT_ID;
  
  if (!operatorKey || !operatorId) {
    throw new Error("Environment variables HEDERA_PRIVATE_KEY and HEDERA_ACCOUNT_ID must be present");
  }

  // Create client
  const client = Client.forTestnet();
  
  // Set the operator
  client.setOperator(
    AccountId.fromString(operatorId),
    PrivateKey.fromString(operatorKey)
  );

  try {
    // Create a new topic
    const transaction = new TopicCreateTransaction()
      .setSubmitKey(PrivateKey.fromString(operatorKey).publicKey)
      .setAdminKey(PrivateKey.fromString(operatorKey).publicKey)
      .setTopicMemo("HederaPredict Supply Chain Analytics");

    // Sign and submit the transaction
    const txResponse = await transaction.execute(client);

    // Get the receipt
    const receipt = await txResponse.getReceipt(client);

    // Get the topic ID
    const topicId = receipt.topicId;

    console.log(`Created topic with ID: ${topicId}`);
    
    return topicId;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  } finally {
    client.close();
  }
}

// Run the function
createTopic()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });