// import {
//   HederaSessionEvent,
//   HederaJsonRpcMethod,
//   DAppConnector,
//   HederaChainId,
// } from '@hashgraph/hedera-wallet-connect'
// import { LedgerId, TransferTransaction, TransactionId, AccountId, Hbar } from '@hashgraph/sdk'
// import { SessionTypes } from '@walletconnect/types';

// const projectId = 'your-project-id-from-wallet-connect';
// const metadata = {
//   name: 'MydApp',
//   description: 'My dApp does things.',
//   url: 'https://mywebsite.com',
//   icons: ['https://mywebsite.com/logo.jpg'],
// };

// let dAppConnector: DAppConnector;

// // Session handling function
// function handleNewSession(session: SessionTypes.Struct) {
//   const sessionAccount = session.namespaces?.hedera?.accounts?.[0]
//   const sessionParts = sessionAccount?.split(':')
//   const accountId = sessionParts.pop()
//   const network = sessionParts.pop()

//   if (!accountId) {
//     return
//   } else {
//     localStorage.setItem('hederaAccountId', accountId)
//     localStorage.setItem('hederaNetwork', network)
//     console.log('sessionAccount is', accountId, network)
//   }
// }

// // Initialize and set up event listeners
// async function initializeWalletConnect() {
//   dAppConnector = new DAppConnector(
//     metadata,
//     LedgerId.TESTNET,
//     projectId,
//     Object.values(HederaJsonRpcMethod),
//     [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
//     [HederaChainId.Mainnet],
//   )
//   await dAppConnector.init({ logger: 'error' })

//   dAppConnector.onSessionIframeCreated = (session) => {
//     handleNewSession(session)
//   }
// }

// // Connect wallet function
// async function connectWallet() {
//   const session = await dAppConnector.openModal()
//   handleNewSession(session)
// }

// // Example transfer function
// // async function transferHbar(fromAccountId, toAccountId, amount) {
// //   try {
// //     // Create the transaction
// //     const transaction = new TransferTransaction()
// //       .setTransactionId(TransactionId.generate(fromAccountId))
// //       .addHbarTransfer(AccountId.fromString(fromAccountId), new Hbar(-amount))
// //       .addHbarTransfer(AccountId.fromString(toAccountId), new Hbar(amount))

// //     // Get the signer for the connected account
// //     const accountId = localStorage.getItem('hederaAccountId')
// //     const signer = dAppConnector.signers.find(
// //       (signer_) => signer_.getAccountId().toString() === accountId,
// //     )

// //     // Sign and execute the transaction
// //     const signedTx = await transaction.freezeWithSigner(signer)
// //     const executedTx = await signedTx.executeWithSigner(signer)
// //     const receipt = await executedTx.getReceiptWithSigner(signer)

// //     return receipt
// //   } catch (error) {
// //     console.error('Transfer failed:', error)
// //     throw error
// //   }
// // }

// // Usage example
// (async () => {
//   await initializeWalletConnect()

//   // Connect wallet when needed
//   await connectWallet()

//   // Example transfer
//   // const receipt = await transferHbar(
//   //   '0.0.123456',
//   //   '0.0.123457',
//   //   1, // amount in HBAR
//   // )
//   // console.log('Transfer complete:', receipt)
// })()