from __init__ import db
import bcrypt # for encoding and decrypting passwords and other important credentials.
from datetime import datetime

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