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
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password

# Assuming that the e-mail is used to track down a specific hashed password (one result query)
# * hashed_password value is from the database.
def verify_password(hashed_password, input_password):
    return bcrypt.checkpw(hashed_password.encode('utf-8'), hashed_password) # returns true | false