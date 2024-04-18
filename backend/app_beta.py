# this py file is an overhaul version that is yet to be finished due to discovering new concerns arising.

from flask import jsonify, request
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128

import jwt
from __init__ import app, db
from utils import verify_collection

from foreign import apply_foreign

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)

import bcrypt # for encoding and decrypting passwords and other important credentials.

# ---------- User approutes

@app.route("/register", methods=["POST"]) # beta version
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
        
        data['password']
        
        create_account = db['accounts'].insert_one(data)
        return jsonify({'message':'Account created!'}), 201
    else:
        return jsonify({'message':'Account already exists!!'}), 400 # 400 as status code?
    
    # hash the password. and dehash it, will implement soon.

@app.route("/login",methods=["POST"])  
def login():
    data = request.get_json() # contains login credentials (email and password keys)
    
    if 'email' not in data or 'password' not in data:
        return jsonify({"message":"Missing Email or Password"}), 401
    
    email = data['email']
    password = data['password']

    accounts = db['accounts'].find({"gmail":email, "password":password})
    accounts = list(accounts)
    
    if len(accounts) == 0:
        return jsonify({"message":"Wrong Email or Password"}), 401
    elif len(accounts) > 0:
        
        if len(accounts) > 1:
            print("more than 1 rows received, data redundancy detected.") # debugger for accounts collection row duplicates.
        
        access_token = create_access_token(identity=accounts[0]['username']) # so token differs from other people because it depends on the username.
        
        accounts[0]['Authorization'] = access_token
        
        for x in accounts: # turns ObjectID to str, to make it possible to jsonify.
            x['_id'] = str(x['_id'])
            
        return jsonify(accounts), 200
        
    else:

        access_token = create_access_token(identity=accounts[0]['username'])
        return jsonify(access_token=access_token), 200

# the token received in login() should be temporarily stored in the session.

@app.route('/', methods=['GET'])
def landing_page():
    return jsonify({'message':'hello'}), 200 # output: related to "View Updates feature"

# unavailable. There is no proper connection between accounts and request collection. request instances must have account's object id (new attribute for request collection).
"""@app.route('/requests', methods=['GET'])
@jwt_required()
def user_requests():
    data = request.get_json() # input: user's account object id
    
    if data == None:
        return jsonify({"message":"no user id found"}), 400
    id = data['_id']
    collection = db['requests']
    
    page = int(request.args.get('page', default=1))
    if(int(page) < 1):
        page = 1
    # change total rows in a page here. \/
    limit_rows = 20
    offset = (page - 1) * limit_rows
    column = request.args.get('column',default=None)
    search = request.args.get('search',default=None)
    
    if search != None and column != None:
        query = {f"{column}": {"$regex":f"^{search}.*"}, "{new attribute name}": ObjectId(id)}
        rows = collection.find(query).skip(offset).limit(limit_rows)
        
    elif search == None and column == None:
        rows = collection.find({"{new attribute name}": ObjectId(id)}).skip(offset).limit(limit_rows)
        
    else:
        return jsonify({'message': 'May have given search value thrown but no column value, or vice versa.'}), 400
    
    rows_list = list(rows)
    for x in rows_list:
        x['_id'] = str(x['_id'])
    rows_list = apply_foreign(rows_list, "requests")
    
    return jsonify(rows_list), 200 # output: user's current requests"""


@app.route('/requests/add', methods=["GET","POST"])
# @jwt_required()
def user_add_requests(): # twice a day only.
    
    data = request.get_json() # input: request collection attribute (including a new attribute that acts as foreign key <-- primary key from account's objectid)
    
    if data == None:
        return jsonify({"message":"no form data found"}), 400
    
    collection = db['requests']
    
    if request.method == "POST":
        
        json_input = request.get_json() # form request
        
        json_input = json_input.pop('_id')
        result = collection.insert_one(json_input)
        
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        
        pass
        #return jsonify({'message':'hello'}), 200
        # will add GET request for acquiring choose-able options
    
    # on-progress
        
    return jsonify({'message':'hello'}), 200

# unavailable. There is no proper connection between accounts and request collection. request instances must have account's object id (new attribute for request collection).
"""@app.route('/requests/delete', methods=['POST'])
# @jwt_required() # needs login because its an approute specifically for a user.
def user_delete_requests():
    
    data = request.get_json() # input: user's account object id and request's objectid
    collection = db['requests']
    
    
    if data == None:
        return jsonify({"message":"no form data found"}), 400
    
 
    collection = db['requests']
    
    query = {'_id': ObjectId(id), "{new attribute name}": "{new attribute name}"} # _id = specific request it
    result = collection.delete_one(query)
    
    return jsonify({'message':'hello'}), 200"""


@app.route('/equipments', methods=['GET'])
def equipments():
    collection = db['equipment']
    
    page = int(request.args.get('page', default=1))
    
    
    
    
    
    return jsonify(rows_list), 200



@app.route('/services', methods=['GET'])
def services():
    
    return jsonify({'message':'hello'}), 200



@app.route('/volunteer', methods={'POST'}) # apply volunteer
# @jwt_required() # needs login because its an approute specifically for a user.
def apply_volunteer():
    
    
    return jsonify({'message':'hello'}), 200

# ---------- User approutes



# on progress ------------

@app.route('/admin')
def admin_index():
    
    collections = db.list_collection_names() # lists down all collection (this is for sidebar)

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
    
    #rows_list = apply_foreign(rows_list,"requests")
    
    return jsonify(rows_list), 200
    

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




# new approutes

# unit_cost is decimal128 need fix. in equipments

@app.route('/admin/register', methods=['POST'])
def admin_register(): # needs other admin accounts' approval.
    return jsonify({'message':'hello'}), 200

@app.route('/admin/login', methods=['POST'])
def admin_login():
    return jsonify({'message':'hello'}), 200


@app.route('/admin/<collection>', methods=['GET'])
# @jwt_required()
def admin_main_page(collection):
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
            return jsonify({'message':'instance not found'}), 400
    
    if(int(page) < 1): # avoids negatives.
        page = 1
    
    limit_rows = 20 # change total rows in a page here.
    offset = (page - 1) * limit_rows
    
    if search != None and column != None:
        rows = collection.find({f"{column}": {"$regex":f"^{search}.*"}}).skip(offset).limit(limit_rows)
        
    elif search == None and column == None:
        rows = collection.find().skip(offset).limit(limit_rows)
        
    else:
        return jsonify({'message': 'May have given search value thrown but no column value, or vice versa.'}), 400 # must have both column and search values or both have none in value.
    
    rows_list = list(rows)
    
    for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
        x['_id'] = str(x['_id'])
        
    rows_list = apply_foreign(rows_list,col_name)
    return jsonify(rows_list), 200

@app.route('/admin/<collection>/add', methods=["GET","POST"])
# @jwt_required()
def admin_add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        json_input = json_input.pop('_id')
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        
        pass
        # will add GET request for acquiring choose-able options
    

@app.route('/admin/<collection>/update/<id>', methods=['GET','POST']) # not yet tested -------------------------------------------------------------------- 
# @jwt_required()
def admin_update_row(collection, id):
    
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
    
@app.route('/admin/<collection>/delete/<id>', methods=['POST'])
# @jwt_required()
def admin_delete_row(collection, id):
    
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