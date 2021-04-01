from algosdk.v2client import algod
from algosdk import mnemonic
import json

algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token, algod_address)

alice = "NH5QQKETOYQJVYGZX72IYNHOUSS6CA4HUP2I5ZXQMVMQSZDMVE5DDBED7M"
alice_private_key = mnemonic.to_private_key("float access put hill rescue decade today thing way ritual fresh half salad deposit flavor check ramp panel february type crew shift cushion abandon off")
bob = "VXO3FYN275V6RILVVT3XQNUQKGYG62MMTDDCULNRIQAQNF2XSQELTAJNXM"
bob_private_key = mnemonic.to_private_key("gossip pause catalog youth divide inspire actor nuclear case diet arm moon crop mimic prize useful combine blush during fence memory cat swallow absent brown")

# account prior to rekey transaction
print(json.dumps(algod_client.account_info(alice), indent=4))
print(json.dumps(algod_client.account_info(bob), indent=4))

