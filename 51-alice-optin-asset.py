from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.future.transaction import AssetTransferTxn
import json

algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token, algod_address)

alice = "NH5QQKETOYQJVYGZX72IYNHOUSS6CA4HUP2I5ZXQMVMQSZDMVE5DDBED7M"
alice_private_key = mnemonic.to_private_key("float access put hill rescue decade today thing way ritual fresh half salad deposit flavor check ramp panel february type crew shift cushion abandon off")

# account prior to rekey transaction
print(json.dumps(algod_client.account_info(alice), indent=4))

# optin transaction
# build
params = algod_client.suggested_params()
unsigned_txn = AssetTransferTxn(alice, params, alice, 0, 57)
# sign
signed_txn = unsigned_txn.sign(alice_private_key)
# send
txid = algod_client.send_transaction(signed_txn)
print("Sent Transaction : {}".format(txid))
print("curl 'localhost:8980/v2/transactions/{}?pretty'".format(txid))
print("curl 'localhost:8980/v2/accounts/{}?pretty'".format(alice))