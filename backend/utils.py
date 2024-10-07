from __init__ import db
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

def verify_date():
    pass

# bcrypt functions | package for hashing / not encrypting/decrypting.
import bcrypt

# this is to be stored in the password attribute in accounts.
def encrypt(password):
    byte_pass = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(byte_pass, bcrypt.gensalt())
    return hashed_password

# Assuming that the e-mail is used to track down a specific hashed password (one result query)
# * hashed_password value is from the database.
def verify_password(hashed_password, input_password):
    bytes_input = input_password.encode('utf-8')
    
    try:
        return bcrypt.checkpw(bytes_input, hashed_password) # returns true | false
    except:
        print("non-hashed password detected!")
        return False