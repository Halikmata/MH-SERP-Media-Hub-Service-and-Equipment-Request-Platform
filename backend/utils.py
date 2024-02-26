from backend import db
def verify_collection(x):
    collections = db.list_collection_names()
    if x not in collections:
        return False
    return True