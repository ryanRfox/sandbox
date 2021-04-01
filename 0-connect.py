from algosdk.v2client import algod
import json

# sandbox
algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token, algod_address)

# instantiate the client
status = algod_client.status()

# get status
print(json.dumps(status, indent=4))