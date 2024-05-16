from flask import jsonify, request, make_response
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime, timedelta
# from pymongo.errors import ConnectionFailure

import jwt
from __init__ import app, db
from utils import verify_collection

from foreign import apply_foreign

# doesn't have restrictions yet but login is partially prepared.

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)



@app.route('/signout',methods=['POST'])
def sign_out(): # sign out redirect to main page.
    
    response = make_response(jsonify({"message":"Logged out"}))
    response.set_cookie('access_token', '', expires=datetime.now() - timedelta(days=1)) # cookie remover.
    
    return response

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json() # register credentials
    
    # data['_id'] = str(data['_id']) # string id to object
    
    # credential conditions are tied in front end (e.g last name must have not have special characters) because back end will not check it. 
    
    # check if email exists already
    
    email = data['email']
    
    account = db['accounts'].find({"gmail":email})
    account = list(account)
    
    if len(account) == 0: # means that there is no account existing for that email yet.
        data = data.pop('_id', 'unknown_id') # doesn't include id, unknown if id not exist
        
        create_account = db['accounts'].insert_one(data)
        return jsonify({'message':'Account created!'}), 201
    else:
        return jsonify({'message':'Account already exists!!'}), 400 # 400 as status code?
    
    # hash the password. and dehash it, will implement soon.

@app.route("/login",methods=["POST"])
def login():
    data = request.get_json()

    username = data['username']
    password = data['password']
    session_const = data['session_const']
    
    accounts = db['accounts'].find({"username":username, "password":password})
    accounts = list(accounts)
    
    if len(accounts) <= 0:
        return jsonify({"msg": False}), 401
    elif len(accounts) > 0: # if account exists
        
        for x in accounts:
            x['_id'] = str(x['_id'])
            
        if len(accounts) > 1:
            print("debug: more than 1 rows received, data redundancy detected.")
        
        access_token = create_access_token(identity=accounts[0]['gmail'], account_detail=accounts[0])
        
        response = make_response(jsonify({"msg":True}), 200)
        
        if bool(session_const) == True:
            expire_session = datetime.now() + timedelta(days=7)
            
            # change configs in https deployment
            response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost', expires=expire_session) 
        else:
            response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost')
        
        return response # this shouldn't send any important credentials at all.

@app.route('/<collection>', methods=['GET'])
# @jwt_required()
def index(collection):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        col_name = collection
        collection = db[collection]
    
    # URL inputs.
    page = int(request.args.get('page', default=1))
    column = request.args.get('column',default=None)
    search = request.args.get('search',default=None)
    # sort = request.args.get('sort', default=None)
    id = request.args.get('id',default=None) # ID specification
    
    if id != None and len(id) != 0: # the objectid
        id = ObjectId(id)
        row = collection.find({'_id':id})
        row = list(row)
        if len(row) == 1:
            rows_list = list(row)
    
            for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
                x['_id'] = str(x['_id'])
            
            rows_list = apply_foreign(rows_list,col_name)

            return jsonify(rows_list), 200
        else:
            return jsonify({'message':'instance not found'}),400
    
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
        
    # rows_list = apply_foreign(rows_list,col_name)

    return jsonify(rows_list), 200

@app.route('/<collection>/add', methods=["GET","POST"])
#@jwt_required()
def add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        # json_input = json_input.pop('_id')
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        
        pass
        # will add GET request for acquiring choose-able options
        
@app.route('/admin/<collection>/add', methods=["GET","POST"])
#@jwt_required()
def admin_add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        # json_input = json_input.pop('_id')
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        
        pass
        # will add GET request for acquiring choose-able options

    

@app.route('/<collection>/update/<id>', methods=['GET','POST']) # not yet tested -------------------------------------------------------------------- 
#@jwt_required()
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
@jwt_required()
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


@app.route('/equipment/available', methods=['GET'])
# @jwt_required()
def get_available():
    try:
        equipment_collection = db['equipment']
        
        available_items_cursor = equipment_collection.find({'availability': '1'})
        
        available_items = []
        for item in available_items_cursor:
            item['_id'] = str(item['_id'])
            available_items.append(item)

        if not available_items:
            return jsonify({"message": "No available items found"}), 404

        return jsonify(available_items)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# admin APIs


# on progress ------------

@app.route('/admin')
def admin_index():
    
    collections = db.list_collection_names()

    return jsonify({'collections':collections}), 200

""" @app.route('/admin/requests/conclude', methods=['POST']) # this assumes that admins are the ones that declare requests as finished.
def admin_request_conclude():
    json_input = request.get_json()
    id = int(request.args.get('id', default=None))

    if id == None:
        return jsonify({'message':'Bad request, no ID found!'}), 400

    collection = db['requests']
    rows = collection.update_one({'_id':ObjectId(id)}, {'$set': '':json_input[]})
    
    
    return jsonify({'message':'Request instance conluded'}), 201 """

from datetime import datetime
@app.route('/admin/report', methods=['GET'])
def admin_report():
    
    collection = db['requests']
    
    # get all available years in the collection
    #years = collection.find({},{"request_start":1})
    #years = collection.
    #print(f"\n\n\n\n{list(years)}\n\n\n\n")
    month = dict()
    for y in range(0,12+1): # requests per month
        rows = collection.aggregate(
            [{
                "$match":{
                    "request_start":{
                        "$regex":f"{y}.*", # incomplete
                        "$options": "i"
                    }
                }
            },
            {
                "$count": "request_per_month"
            }]
        )
        #request_per_month = list(rows)[0]['request_per_month']
        #month[f'{x}'] = request_per_month
    #print(rows[0][''])
    rows_list = list(rows)
    
    """ for x in rows_list:
        x['_id'] = str(x['_id']) """
    
    # rows_list = apply_foreign(rows_list,"requests")
    
    return jsonify(rows_list), 200


@app.route('/admin/<collection>/update/<id>', methods=['GET', 'PUT'])
def admin_update_row(collection, id):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "PUT":
            json_input = request.get_json()
            
            json_input.pop('_id', None)
            
            result = collection.update_one({'_id': ObjectId(id)}, {'$set': json_input})
            
            if result.modified_count > 0:
                return jsonify({"message": "Updated successfully", "id": id}), 201
            else:
                return jsonify({"message": "No row found with the given ID"}), 404
            
    else:
        result = collection.find_one({'_id': ObjectId(id)})
        
        if result:
            result['_id'] = str(result['_id'])  # Convert ObjectId to string
            return jsonify(result), 200
        else:
            return jsonify({"message": "No row found with the given ID"}), 404



@app.route('/admin/<collection>/delete/<id>', methods=['DELETE'])
# @jwt_required()
def admin_delete_row(collection, id):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    
    collection = db[collection]
    
    result = collection.delete_one({'_id': ObjectId(id)})
    
    if result.deleted_count > 0:
        return jsonify({"message": "Deleted successfully", "id": id}), 201
    else:
        return jsonify({"message": "No row found with the given ID"}), 404

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    required_fields = ['first_name', 'middle_name', 'last_name', 'phone_number', 'email', 'status', 'incident_report', 'username', 'password', 'confirm_password', 'user_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    if data['password'] != data['confirm_password']:
        return jsonify({'message': 'Passwords do not match'}), 400
    
    # Check if account already exists
    existing_acc = db['accounts'].find_one({"email": data['email']})
    if existing_acc:
        return jsonify({'message': 'Account already exists'}), 400
    
    # Additional fields based on user type
    user_type = data['user_type']
    if user_type == 'student':
        required_fields.extend(['college', 'program'])
    else:
        required_fields.extend(['office', 'position'])
    
    # Validate additional fields
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Insert new account into the database
    db['accounts'].insert_one(data)
    
    return jsonify({'message': 'Account created successfully'}), 201
    
# add account profile to request GET and request ADD

# separate app route for login/register --

# login for admin
# admin dashboard
# reports

# sort --
# by 

# login app route include profile

# admin declares request to finish (?)

# Visualization
# equipment request & service per month
# most borrowed equipment
# user with highest request quantities
# organization, (refer to collection)

# token must be from headers of request

# vite

# foreign key for request add

# add privilege checker for each app routes.

