const algosdk = require('algosdk');
const fs = require('fs');
/*const baseServer = "https://testnet-algorand.api.purestake.io/ps1"
const port = "";

// Create client for transaction POST
const postToken = {
    'X-API-key': 'B3SU4KcVKi94Jap2VXkK83xx38bsv95K5UZm2lab',
    'Content-Type': 'application/x-binary'
}*/
const token = "f1dee49e36a82face92fdb21cd3d340a1b369925cd12f3ee7371378f1665b9b1";
const server = "http://127.0.0.1";
const port = 8080;

const algodToken = "241aa58eedb0c1dacff2199372798ddcb5bb968cfd56f6cc486b8e29bb14c3c6";
const algodServer = "http://localhost";
const algodPort = 6001;


//const postAlgodclient = new algosdk.Algod(token, server, port); // Binary content type

//Create client for GET of Transaction parameters 
//const token = {
///    'X-API-key': 'B3SU4KcVKi94Jap2VXkK83xx38bsv95K5UZm2lab',
//}

// const algodclient = new algosdk.Algod(token, server, port);
const algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


var mnemonic = "code thrive mouse code badge example pride stereo sell viable adjust planet text close erupt embrace nature upon february weekend humble surprise shrug absorb faint";
var recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
console.log(recoveredAccount.addr);
//submit the transaction
(async() => {
    //Get the relevant params from the algod
    let params = await algodclient.getTransactionParams();
    console.log("here" + params);
    let endRound = params.lastRound + parseInt(1000);
//    let fee = await algodclient.suggestedFee();

    // create LogicSig object and sign with our secret key
    //let program = Uint8Array.from([1, 32, 1, 0, 34]);  // int 0 => never transfer money
    //let program = new Uint8Array(Buffer.from("ASABey0XIhI=", "base64"));
    let program = new Uint8Array(Buffer.from("AiABey0XIhI=", "base64"));
    // makeLogicSig method takes the program and parameters
    // in this example we have no parameters
    // If we did have parameters you would add them like
    //var big = BigInt("123");
    //let args = [
    //    getInt64Bytes(123)
    //     BigUint64Array.from(big)
    //];
    let args = [];
    let lsig = algosdk.makeLogicSig(program, args);


    console.log("Teal address" + lsig.address());

    // At this point you can save the lsig off and share
    // as your delegated signature.
    // The LogicSig class supports serialization and
    // provides the lsig.toByte and fromByte methods
    // to easily convert for file saving and 
    // reconstituting and LogicSig object

    //create a transaction
    let txn = {
        "from": lsig.address(),
        "to": recoveredAccount.addr,
        "amount": 200000,
        "closeRemainderTo": recoveredAccount.addr,
    };

    let txn = algosdk.makePaymentTxnWithSuggestedParams(recoveredAccount.addr, lsig.address(), 200000, undefined, undefined, params);        

    // create logic signed transaction.
    // Had this been an escrow the lsig would not contain the
    // signature but would be submitted the same way
    let rawSignedTxn = algosdk.signLogicSigTransaction(txn, lsig);

    fs.writeFileSync("inttest.stx", rawSignedTxn.blob);
    //Submit the lsig signed transaction
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn.blob));
    console.log("Transaction : " + tx.txId);



})().catch(e => {

    console.log(e);
});