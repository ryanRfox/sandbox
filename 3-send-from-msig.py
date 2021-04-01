from algosdk.v2client import algod
from algosdk import account, mnemonic
from algosdk.future.transaction import PaymentTxn, Multisig, MultisigTransaction
import json

algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token, algod_address)

alice = "NH5QQKETOYQJVYGZX72IYNHOUSS6CA4HUP2I5ZXQMVMQSZDMVE5DDBED7M"
alice_private_key = mnemonic.to_private_key("float access put hill rescue decade today thing way ritual fresh half salad deposit flavor check ramp panel february type crew shift cushion abandon off")
bob = "VXO3FYN275V6RILVVT3XQNUQKGYG62MMTDDCULNRIQAQNF2XSQELTAJNXM"
bob_private_key = mnemonic.to_private_key("gossip pause catalog youth divide inspire actor nuclear case diet arm moon crop mimic prize useful combine blush during fence memory cat swallow absent brown")

# msig payment transaction 
# build
params = algod_client.suggested_params()
msig = Multisig(1, 2, [bob, alice])
unsigned_txn = PaymentTxn(msig.address(), params, alice, 1000)
mtx = MultisigTransaction(unsigned_txn, msig)

# sign
mtx1 = MultisigTransaction(unsigned_txn, msig)
mtx1.sign(alice_private_key)
mtx2 = MultisigTransaction(unsigned_txn, msig)
mtx2.sign(bob_private_key)
signed_txn = MultisigTransaction.merge([mtx1, mtx2])

# send
txid = algod_client.send_transaction(signed_txn)
print("Sent Transaction : {}".format(txid))
print("curl 'localhost:8980/v2/transactions/{}?pretty'".format(txid))
print("curl 'localhost:8980/v2/accounts/{}?pretty'".format(alice))