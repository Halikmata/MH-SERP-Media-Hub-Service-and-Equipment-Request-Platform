from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# Purpose: Generate a key, and to use it for encryption/decryption
# Each result is different, so it cannot be declared in server files, hence we have key_gen.py

key = get_random_bytes(16)
print(key)

