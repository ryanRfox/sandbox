from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.future.transaction import AssetConfigTxn
import json

algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token, algod_address)

def wait_for_confirmation(client, txid):
	"""
	Utility function to wait until the transaction is
	confirmed before proceeding.
	"""
	last_round = client.status().get('last-round')
	txinfo = client.pending_transaction_info(txid)
	while not (txinfo.get('confirmed-round') and txinfo.get('confirmed-round') > 0):
		print("Waiting for confirmation")
		last_round += 1
		client.status_after_block(last_round)
		txinfo = client.pending_transaction_info(txid)
	print("Transaction {} confirmed in round {}.".format(txid, txinfo.get('confirmed-round')))
	return txinfo

bob_address = "I4UWZDUDOG6IWKHH6KHLPUXF4C6AW5T4HJJN3OHSA54FZFDBCY5JRJV6DU"
bob_private_key = mnemonic.to_private_key("level laundry wire solve decorate accuse public affair box weekend blind victory course obtain cloud decline tunnel mad short pledge found ankle remove ability release")

# create asset transaction
# build
params = algod_client.suggested_params()
unsigned_txn = AssetConfigTxn(bob_address, params, None, 1000, None, "ASA", "myAsset", bob_address, None, None, None, None, None, None, None, None, 0, None)
# sign
signed_txn = unsigned_txn.sign(bob_private_key)
# send
txid = algod_client.send_transaction(signed_txn)
print("Sent Transaction : {}".format(txid))
wait_for_confirmation(algod_client, txid)
print("curl 'localhost:8980/v2/transactions/{}?pretty'".format(txid))
print("curl 'localhost:8980/v2/accounts/{}?pretty'".format(bob_address))

# accounts after asset transaction
print("STATE OF BOB'S ACCOUNT AFTER Asset Creation")
print(json.dumps(algod_client.account_info(bob_address), indent=4))
