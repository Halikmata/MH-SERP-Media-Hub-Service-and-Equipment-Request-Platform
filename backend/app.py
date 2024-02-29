from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from utils import verify_collection

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://elsidpanolino:ELSID62mdb@cluster0.xzw6t37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongodb_client = MongoClient(app.config["MONGO_URI"])
db = mongodb_client['mediahubdb']

CORS(app)

# security and login not yet implemented.

"""def connect_to_mongodb():
    try:
        client = MongoClient("mongodb+srv://kenlorenz420:rUcyg9bQRMmsDisJ@testdb.fp6ebdj.mongodb.net/?retryWrites=true&w=majority&appName=testDB")
        client.admin.command('ismaster')
        return True
    except ConnectionFailure:
        return False

@app.route('/testdb')
def index():
    if connect_to_mongodb():
        return jsonify({"status": "Connected to MongoDB"})
    else:
        return jsonify({"status": "Failed to connect to MongoDB"})"""

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
        
    return render_template('.html', rows_list=rows_list)

@app.route('/<collection>/add', methods=["GET","POST"])
def add_row():   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "POST":
        json_input = request.get_json()
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)})
    elif request.method == "GET":
        return render_template('.html')
    
from bson.objectid import ObjectId
@app.route('/update/<id>', methods=['GET','POST'])
def update_row(id):
    
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "POST":
        json_input = request.get_json()
        
        result = collection.update_one({'_id':ObjectId(id)}, {'$set': json_input})
          
        if result.modified_count >  0:
            return jsonify({"message": "Updated successfully", "id": id})
        else:
            return jsonify({"message": "No row found with the given ID"}), 404
        
    elif request.method == "GET":
        # load specific instance and throw to a page.
        # load specific ID for update page.
        return render_template('.html')
    
    
@app.route('/delete/<id>', methods=['POST'])
def delete_row(id):
    
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    result = collection.delete_one({'_id': ObjectId(id)})
    
    if result.deleted_count > 0:
        return jsonify({"message": "Deleted successfully", "id": id})
    else:
        return jsonify({"message": "No row found with the given ID"}), 404
    # return render_template()

if __name__ == "__main__":
    print_collections() # debugger
    app.run(debug=True,host="127.0.0.1")
