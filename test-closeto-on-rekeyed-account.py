from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.future.transaction import PaymentTxn
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

# generate new accounts
# alice_private_key, alice_address = account.generate_account()
# print("Alice's address: {}".format(alice_address))
# print("Alice's passphrase: {}".format(mnemonic.from_private_key(alice_private_key)))
alice_address = "AQCTALTJEJPMIKUWLWYI2LY6BVEC4MKYN4NW63TRY22ANUMFPRMGHTSATY"
alice_private_key = mnemonic.to_private_key("lecture circle peace reveal crater immune fluid admit common absorb taste position hamster detect glance apart inspire hockey noodle arrive blouse network silk absent include")

#bob_private_key, bob_address = account.generate_account()
#print("Bob's address: {}".format(bob_address))
#print("Bob's passphrase: {}".format(mnemonic.from_private_key(bob_private_key)))
bob_address = "I4UWZDUDOG6IWKHH6KHLPUXF4C6AW5T4HJJN3OHSA54FZFDBCY5JRJV6DU"
bob_private_key = mnemonic.to_private_key("level laundry wire solve decorate accuse public affair box weekend blind victory course obtain cloud decline tunnel mad short pledge found ankle remove ability release")

# fund Alice's account to proceed (she will fund Bob 101000 during rekey)

# account prior to rekey transaction
print("ORIGINAL STATE OF ALICE'S ACCOUNT. NOTE: LACK OF AUTH-ADDR")
print(json.dumps(algod_client.account_info(alice_address), indent=4))

# rekey alice to bob transaction
# build
params = algod_client.suggested_params()
unsigned_txn = PaymentTxn(alice_address, params, alice_address, 101000, None, None, None, bob_address)
# sign
signed_txn = unsigned_txn.sign(alice_private_key)
# send
txid = algod_client.send_transaction(signed_txn)
print("Sent Transaction : {}".format(txid))
wait_for_confirmation(algod_client, txid)
print("curl 'localhost:8980/v2/transactions/{}?pretty'".format(txid))
print("curl 'localhost:8980/v2/accounts/{}?pretty'".format(alice_address))

# accounts after rekey transaction
print("STATE OF ALICE'S ACCOUNT AFTER REKEY. NOTE: AUTH-ADDR SET TO BOB")
print(json.dumps(algod_client.account_info(alice_address), indent=4))

# close to alice to bob (signed bob)
unsigned_txn = PaymentTxn(alice_address, params, alice_address, 0, bob_address, None, None, None)
# sign
signed_txn = unsigned_txn.sign(bob_private_key)
# send
txid = algod_client.send_transaction(signed_txn)
print("Sent Transaction : {}".format(txid))
wait_for_confirmation(algod_client, txid)
print("curl 'localhost:8980/v2/transactions/{}?pretty'".format(txid))
print("curl 'localhost:8980/v2/accounts/{}?pretty'".format(alice_address))

# accounts after close to transaction
print("STATE OF ALICE'S ACCOUNT AFTER CLOSE-TO. NOTE: AUTH-ADDR REMOVED")
print(json.dumps(algod_client.account_info(alice_address), indent=4))
