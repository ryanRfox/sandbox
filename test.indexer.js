const algosdk = require('algosdk');
const indexer_server = "localhost:4001";
const indexer_port = "";
const indexer_token = "";

// Instantiate the indexer client wrapper
let indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);
let nexttoken = "";
let numtx = 1;
// loop until there are no more transactions in the response
// for the limit(max limit is 1000  per request)    
(async () => {
    let min_amount = 500000000000;
    let limit = 4;
    let max_round = 10000
    while (numtx > 0) {
        // execute code as long as condition is true
        let next_page = nexttoken;
        let response = await indexerClient.searchForTransactions()
//            .limit(limit)
//            .currencyGreaterThan(min_amount)
//            .maxRound(max_round)
//            .minRound(max_round)
//            .nextToken(next_page)
        .do();
//        let transactions = response['transactions'];
//        numtx = transactions.length;
        if (numtx > 0)
        {
            nexttoken = response['next-token']; 
            console.log("Transaction Information: " + JSON.stringify(response, undefined, 2));           
        }
    }
})().catch(e => {
    console.log(e);
    console.trace();
});