const algosdk = require('algosdk');

const indexer_token = "";
const indexer_server = "http://localhost";
const indexer_port = 8980;

const indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);

(async () => {
    let response = await indexerClient.lookupApplications(4).do();
    console.log(JSON.stringify(response, undefined, 2));
    console.log(JSON.stringify(response["application"]["params"]["global-state"][0]["value"]["uint"]));
})().catch(e => {
    console.log(e.message);
    console.trace();
});
