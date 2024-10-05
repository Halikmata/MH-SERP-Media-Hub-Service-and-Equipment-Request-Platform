from __init__ import db
import bcrypt # for encoding and decrypting passwords and other important credentials.
from datetime import datetime
import json

def print_collections():
    collections = db.list_collection_names()
    print(f'Collections from database: {collections}')
    
def verify_collection(x):
    collections = db.list_collection_names()
    if x not in collections:
        return False
    return True

def decrypt():
    pass

def encrypt():
    pass

def verify_date():
    pass

def load_key():
    try:
        # Open the file and read its contents
        with open("key.json", "r") as file:
            # Parse the JSON content
            data = json.load(file)
        
        # Access the 'key' value
        return data.get('key')
    
    except FileNotFoundError:
        print("Error: key.json file not found.")
        return None
    
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in key.json.")
        return None
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

from Crypto.Cipher import AES
import base64
def load_encryption():
    key = base64.b64decode(load_key())
    cipher = AES.new(key, AES.MODE_EAX)
    
    return cipher