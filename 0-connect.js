const algosdk = require('algosdk');

// sandbox
const server = 'http://localhost';
const port = '4001';
const token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// Instantiate the algod client
let algodclient = new algosdk.Algod(token, server, port);

var account = algosdk.generateAccount();
var passphrase = algosdk.secretKeyToMnemonic(account.sk);
console.log( "My address: " + account.addr );
console.log( "My passphrase: " + passphrase );

