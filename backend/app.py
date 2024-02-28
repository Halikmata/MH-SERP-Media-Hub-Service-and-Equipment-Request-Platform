from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
# from pymongo.errors import ConnectionFailure

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://elsidpanolino:ELSID62mdb@cluster0.xzw6t37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongodb_client = MongoClient(app.config["MONGO_URI"])
db = mongodb_client['mh-serp'] 

CORS(app)

def print_collections():
    collections = db.list_collection_names()
    print(f'Collections from database: {collections}')
    
def verify_collection(x):
    collections = db.list_collection_names()
    if x not in collections:
        return False
    return True

# security and login not yet implemented.

@app.route('/<collection>', methods=['GET'])
def index(collection):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    rows = collection.find()
    rows_list = list(rows)
    
    for x in rows_list:
        print(x)
    
    for x in rows_list:
        x['_id'] = str(x['_id'])
        
    return jsonify(rows_list), 200

@app.route('/<collection>/add', methods=["POST"])
def add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    json_input = request.get_json()
    result = collection.insert_one(json_input)
    return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    

@app.route('/<collection>/update/<id>', methods=['GET','POST'])
def update_row(collection, id):
    
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "POST":
        json_input = request.get_json()
        
        result = collection.update_one({'_id':ObjectId(id)}, {'$set': json_input})
          
        if result.modified_count >  0:
            return jsonify({"message": "Updated successfully", "id": id}), 201
        else:
            return jsonify({"message": "No row found with the given ID"}), 404
        
    elif request.method == "GET":

        result = collection.find_one({'_id': ObjectId(id)})
        
        for x in result:
            x['_id'] = str(x['_id'])
        return jsonify(result), 200
    
@app.route('/<collection>/delete/<id>', methods=['POST'])
def delete_row(collection, id):
    
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    result = collection.delete_one({'_id': ObjectId(id)})
    
    if result.deleted_count > 0:
        return jsonify({"message": "Deleted successfully", "id": id}), 201
    else:
        return jsonify({"message": "No row found with the given ID"}), 404

if __name__ == "__main__":
    print_collections() # debugger
    app.run(debug=True)
