from flask import jsonify, request
from bson.objectid import ObjectId
# from pymongo.errors import ConnectionFailure
from jwt import check_token
from __init__ import app, db
from utils import verify_collection

from foreign import apply_foreign

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

@app.route('/<collection>', methods=['GET']) # do something about foreign keys!
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
    
    limit_rows = 20 # change total rows in a page here.
    offset = (page - 1) * limit_rows
    rows = collection.find().skip(offset).limit(limit_rows) # ඞ
    
    if search != None and column != None:
        rows = collection.find({f"{column}": {"$regex":f"^{search}.*"}}).skip(offset).limit(limit_rows)
        
    elif search == None and column == None:
        rows = collection.find().skip(offset).limit(limit_rows)
        
    else:
        return jsonify({'message': 'May have given search value thrown but no column value, or vice versa.'}), 400 # must have both column and search values or both have none in value.
    
    rows_list = list(rows)
    
    for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
        x['_id'] = str(x['_id'])
        
    # update foreign keys, test
    rows_list = apply_foreign(rows_list,collection)

    return jsonify(rows_list), 200

@app.route('/<collection>/add', methods=["GET","POST"])
#@check_token
def add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        pass
        # will add GET request for acquiring choose-able options
    

@app.route('/<collection>/update/<id>', methods=['GET','POST'])
#@check_token
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
        
    else:

        result = collection.find_one({'_id': ObjectId(id)})
        
        for x in result:
            x['_id'] = str(x['_id'])
        return jsonify(result), 200
    
@app.route('/<collection>/delete/<id>', methods=['POST'])
#@check_token
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
