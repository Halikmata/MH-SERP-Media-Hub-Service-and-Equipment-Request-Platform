from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import json, base64
# Purpose: Generate a key, and to use it for encryption/decryption
# Each result is different, so it cannot be declared in server files, hence we have key_gen.py
# DO NOT CHANGE THE KEY NOW. decryption will no longer work on previously encrypted ones used with old key

key = get_random_bytes(16)
dict_key = {"key": base64.b64encode(key).decode()}

""" with open("key.json", "w") as key_file:
    json.dump(dict_key, key_file, indent=4) """

