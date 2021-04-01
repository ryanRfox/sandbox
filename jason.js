const algosdk = require('algosdk');

// sandbox
const server = 'http://localhost';
const port = '4001';
const token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// Instantiate the algod client
let algodclient = new algosdk.Algod(token, server, port);

// get node suggested parameters
let params = client.getTransactionParams().do();
params.fee = 1000;
params.flatFee = true;
let note = undefined;
// Asset creation specific parameters
// The following parameters are asset specific
// Throughout the example these will be re-used. 
// We will also change the manager later in the example
let addr = creatorAccount.addr;
// Whether user accounts will need to be unfrozen before transacting    
let defaultFrozen = false;
// integer number of decimals for asset unit calculation
let decimals = 0;
// total number of this asset available for circulation   
let totalIssuance = 100000;
// Used to display asset units to user    
let unitName = "STOK";
// Friendly name of the asset    
let assetName = "stok";
// Optional string pointing to a URL relating to the asset
let assetURL = "http://someurl";
// Optional hash commitment of some sort relating to the asset. 32 character length.
let assetMetadataHash = undefined;
// The following parameters are the only ones
// that can be changed, and they have to be changed
// by the current manager
// Specified address can change reserve, freeze, clawback, and manager
let manager = creatorAccount.addr;
// Specified address is considered the asset reserve
// (it has no special privileges, this is only informational)
let reserve = creatorAccount.addr;
// Specified address can freeze or unfreeze user asset holdings 
let freeze = creatorAccount.addr;
// Specified address can revoke user asset holdings and send 
// them to other addresses    
let clawback = creatorAccount.addr;
// signing and sending "txn" allows "addr" to create an asset
let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(addr, note,
        totalIssuance, decimals, defaultFrozen, manager, reserve, freeze,
    clawback, unitName, assetName, assetURL, assetMetadataHash, params);
let txId = txn.txID().toString();
    // Sign the transaction
let signedTxn = txn.signTxn(creatorAccount.sk);
console.log("Signed transaction with txID: %s", txId);
// Submit the transaction
await client.sendRawTransaction(signedTxn).do();
// Wait for confirmation
await waitForConfirmation(client, txId);