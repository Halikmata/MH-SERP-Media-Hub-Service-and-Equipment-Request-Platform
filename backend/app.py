from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
# from pymongo.errors import ConnectionFailure

#security related libraries -- jwt currently has issues.
# import jwt
from functools import wraps
from faker import Faker

fake = Faker() # rechanges secret key every server restart

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://elsidpanolino:ELSID62mdb@cluster0.xzw6t37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# app.config['SECRET_KEY'] = fake.bothify(text='??????#####') # not used yet.

mongodb_client = MongoClient(app.config["MONGO_URI"], server_api=ServerApi('1'))
db = mongodb_client['mh-serp'] 

CORS(app)

# ------------------------ Tara Tekken 7

# security and login not yet implemented.
# Checks availability of token in the received header
"""def check_token(f):
    @wraps(f)
    def get_header_token(*args, **kwargs):
        token = request.headers.get('token-access')
      
        if not token:
            return jsonify({"message":"Authorization denied"}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY']) # refer to flask jwt documentation.
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message":"Expired session"}), 401
        
        except jwt.InvalidTokenError:
            return jsonify({"message":"Invalid session"}), 401

        return f(*args, **kwargs)

    return get_header_token"""

def print_collections():
    collections = db.list_collection_names()
    print(f'Collections from database: {collections}')
    
def verify_collection(x):
    collections = db.list_collection_names()
    if x not in collections:
        return False
    return True

# ------------------------
acc = {'teststatic420@gmail.com':{'password':'648221'}} # temporary, will be connected to accounts table.
"""@app.route("/login",methods=["POST"])
def login():
    
    data = request.get_json()
    
    if 'email' not in data or 'password' not in data:
        return jsonify("Missing Email or Password"), 400

    email = data['email']
    password = data['password']
    
    if acc.get(email, None) is not None and acc[email]['password'] == password:
        
        token = jwt.encode({'email': email}, app.config['SECRET_KEY'], algorithm='HS256')
        
        response = token.decode('UTF-8')
        
        return jsonify({"token":f"{response}"}), 200 # returns the token if account is in accounts collection.
    else:
        return jsonify({"message":"Wrong Credentials."}),401"""

@app.route('/<collection>', methods=['GET'])
def index(collection):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    # URL inputs.
    page = int(request.args.get('page', default=1))
    column = request.args.get('column',default=None)
    search = request.args.get('search',default=None)
    
    
    if(int(page) < 1): # avoids negatives.
        page = 1
    
    limit_rows = 2 # change total rows in a page here.
    offset = (page - 1) * limit_rows
    rows = collection.find().skip(offset).limit(limit_rows)
    
    if search != None and column != None:
        rows = collection.find({f"{column}": f"{search}"}).skip(offset).limit(limit_rows)
        
    elif search == None and column == None:
        rows = collection.find().skip(offset).limit(limit_rows)
        
    else:
        return jsonify({'message: May have given search value thrown but no column value, or vice versa.'}), 400 # must have both column and search values or both have none in value.
    
    rows_list = list(rows)
    
    for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
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
    app.run(debug=True,host="127.0.0.1")
