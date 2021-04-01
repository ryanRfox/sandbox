## What is MyAlgo Connect?

[MyAlgo Connect](https://github.com/randlabs/myalgo-connect) is an SDK for DApp developers. It allows WebApp users to review and sign Algorand transactions using accounts secured within their [MyAlgo Wallet](https://wallet.myalgo.com/). This enables Algorand applications to use MyAlgo Wallet to interact with the Algorand blockchain and users to access the applications in a private and secure manner.

The integration with MyAlgo Wallet allows users secure access to Algorand DApps. Users only need to share their public addresses with the WebApp and this in turn allows them to review and sign all types of transactions without exposing their private keys. The main novelty of MyAlgo Connect lies in the fact that all the process is managed in the user’s browser without the need for any backend service nor downloads, extensions or browser plugins. Unlike wallets like Metamask or AlgoSigner that require downloading extensions to work, the MyAlgo Connect works with any browser (including Safari) and device giving developers an extremely intuitive solution that works in all scenarios.

MyAlgo Connect supports all Algorand transaction types, including atomic transaction groups. It also supports Ledger hardware wallets and is fully compatible with [AlgoSDK](https://github.com/algorand/js-algorand-sdk). Developers can easily construct transactions in MyAlgo Connect in the same way they use the AlgoSDK.

## How it works?

A new mechanism on top of the browser API was developed called Communication-Bridge. This Communication-Bridge component is a JavaScript middleware that exchanges messages between browser windows, tabs, or iFrames. Wallet-MyAlgo.js is a simple Javascript library that leverages MyAlgo Wallet UI and capabilities to allow the secure signing of transactions through wallet.myalgo.com.

A simple call to Wallet-MyAlgo-js from Client application triggers a popup in a new browser tab requesting the user to unlock its wallet and subsequently grant access to myAlgo features, by returning wallet accounts:

```js
const accounts = await myAlgoWallet.connect();
```

![EditorImages/2021/03/04 18:44/image_7.png](https://algorand-devloper-portal-app.s3.amazonaws.com/static/EditorImages/2021/03/04%2018%3A44/image_7.png) 
Code from myalgo.com runs in the popup, enabling the user to verify what is being signed and requesting a password to sign the transaction of the Client application. Ledger hardware wallet is fully supported and multisig capabilities will be coming soon too.

## Getting Started

To get started, developers need to integrate the library by installing it with npm. MyAlgo Connect [readme](https://github.com/randlabs/wallet-myalgo-js) covers all the details about this package including a tutorial. Additionally, a [test application](https://github.com/randlabs/wallet-myalgo-js-example) is provided that uses MyAlgo Connect which developers can review.

### Install

```sh
    npm install @randlabs/wallet-myalgo-js
```

### Connect

First of all, before constructing any transactions, you must ask the user to allow and share the accounts.
`connect()` method must be called inside a function that has been triggered by a click event. A new browser window will open asking for the user's permission to share his data to the website as well as selecting which accounts wished to be connected to the Client application. If the user accepts, it will return an account array, if not, `connect()` will throw an error.

```js
const { MyAlgoWallet } = require('@randlabs/wallet-myalgo-js');

const myAlgoWallet = new MyAlgoWallet();

myAlgoWallet.connect()
.then((accounts) => {
    // Accounts is an array that has all public addresses shared by the user
})
.catch((err) => {
    // Error
});
```

### Sign transaction

Making a transaction in MyAlgo Connect is just as easy as making one in Algosdk.

```js
let txn = {
    fee: 1000,
    type: 'pay',
    from: accounts[0].address,
    to:  '4SZTEUQIURTRT37FCI3TRMHSYT5IKLUPXUI7GWC5DZFXN2DGTATFJY5ABY',
    amount: 1000000, // 1 algo
    firstRound: 12449335,
    lastRound: 12450335,
    genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
    genesisID: "testnet-v1.0"
};

myAlgoWallet.signTransaction(txn)
.then((signedTxn) => {
    console.log(signedTxn);
    /*
        {
            txID: "IMXOKHFRXGJUBDNOHYB5H6HASYACQ3PE5R6VFWLW4QHARFWLTVTQ",
            blob: Uint8Array(247) [130, 163, 115, 105, 103, 196, 64, 73, 156, 137, 76, 48, 112, 237, ... ]
        }
    */
})
.catch((err) => {
    // Error
});
```

Once the transaction is signed, it can be sent to the network.

```js
const algosdk = require('algosdk');

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

algodClient.sendRawTransaction(signedTxn.blob).do()
.then((txn) => {
    console.log(txn);
    // { txId: "IMXOKHFRXGJUBDNOHYB5H6HASYACQ3PE5R6VFWLW4QHARFWLTVTQ" }
})
```

More examples can be found in MyAlgo Connect [readme](https://github.com/randlabs/wallet-myalgo-js).

## Conclusion

MyAlgo Connect is an intuitive service that Algorand applications can connect to for users to securely sign transactions. By not requiring the installation of any browser extensions, it can be instantly accessible from any browser or device making it more intuitive for unsophisticated users. Lastly, it provides enhanced security given that extension-based wallets maintain unlocked accounts in the background.
