from flask import jsonify, request, make_response
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime, timezone, timedelta
# from pymongo.errors import ConnectionFailure
import re

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
    
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    required_fields = ['first_name', 'last_name', 'phone_number', 'email', 'status', 'incident_report', 'username', 'password', 'confirm_password', 'college', 'program', 'user_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    if data['password'] != data['confirm_password']:
        return jsonify({'message': 'Passwords do not match'}), 400
    
    # Check if account already exists
    existing_acc = db['accounts'].find_one({"email": data['email']})
    if existing_acc:
        return jsonify({'message': 'Account already exists'}), 400
    
    # Input validations
    if not re.match(r'^[A-Za-z\s]*$', data['first_name']):
        return jsonify({'message': 'First name should only contain letters and spaces'}), 400

    if not re.match(r'^[A-Za-z\s]*$', data['middle_name']):
        return jsonify({'message': 'Middle name should only contain letters and spaces'}), 400

    if not re.match(r'^[A-Za-z\s]*$', data['last_name']):
        return jsonify({'message': 'Last name should only contain letters and spaces'}), 400
    
    if not re.match(r'^(\+63|0)?\d{10}$', data['phone_number']):
        return jsonify({'message': 'Invalid phone number format'}), 400

    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data['email']):
         return jsonify({'message': 'Invalid email format'}), 400
     
    if not re.match(r'.+@psu\.palawan\.edu\.ph$', data['email']):
         return jsonify({'message': 'Corporate email is required in creating account'}), 400

    if not re.match(r'^[a-zA-Z0-9_]+$', data['username']):
        return jsonify({'message': 'Username must not contain special characters'}), 400
    
    if len(data['password']) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400
    
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
        
    del data['confirm_password']
        
    # Set the date_created field with current date
    data['date_created'] = datetime.now(timezone.utc)

    # Insert new account into the database
    db['accounts'].insert_one(data)
    
    return jsonify({'message': 'Account created successfully'}), 201

@app.route('/verify_presence') # crucial for login restrictions
@jwt_required()
def verify_presence():
    identity = get_jwt_identity()
    
    accounts = db['accounts'].find({"gmail": identity})
    accounts = list(accounts)

    if len(accounts) >= 1:
        if len(accounts) > 1:
            print("Redundancy Data detected.")
        return make_response(jsonify({"msg": True}), 200)
    
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data['username_email']
    password = data['password']
    session_const = data.get('session_const', False)
    
    accounts = list(db['accounts'].find({"$or": [{"username": username}, {"email": username}], "password": password}))    
    if len(accounts) == 0:
        return jsonify({"msg": False}), 401
    
    if len(accounts) > 1:
        print("debug: more than 1 rows received, data redundancy detected.")
    
    account = accounts[0]
    account['_id'] = str(account['_id'])

    # Create access token with additional claims
    additional_claims = {"account_detail": account}
    access_token = create_access_token(identity=account['email'])
    
    
    response_data = {
        "msg": True,
        "access_token": access_token,
        "user": account
    }
    
    response = make_response(jsonify(response_data), 200)
    
    if session_const:
        expire_session = datetime.now(timezone.utc) + timedelta(days=7)
        response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost', expires=expire_session)
    else:
        response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost')
    
    return response

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
    
    limit_rows = 50 # change total rows in a page here.
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


@app.route('/admin/<collection>/<id>', methods=["GET"])
def get_row(collection, id):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        try:
            obj_id = ObjectId(id)
            document = collection.find_one({"_id": obj_id})
            if document:
                document["_id"] = str(document["_id"])
                return jsonify(document), 200
            else:
                return jsonify({"message": "No row found with the given ID"}), 404
        except Exception as e:
            return jsonify({"message": "Invalid ID format"}), 400
        

@app.route('/<collection>/add', methods=["GET","POST"])
# @jwt_required()
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


# Update Request

@app.route('/admin/requests/update/<id>', methods=['GET', 'PUT'])
def admin_update_request(id):
    collection = "requests"
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "PUT":
        json_input = request.get_json()
        
        # Remove '_id' if present in the input
        json_input.pop('_id', None)
        
        try:
            # Update the request in the collection
            result = collection.update_one({'_id': ObjectId(id)}, {'$set': json_input})
            
            if result.modified_count > 0:
                # If status is "1", update the equipment availability to "0"
                if json_input.get('request_status') == "1":
                    if 'equipment' in json_input:
                        equipment_collection = db['equipment']
                        equipment_ids = json_input['equipment']
                        
                        # Update the availability of each equipment item
                        for eq_id in equipment_ids:
                            equipment_result = equipment_collection.update_one(
                                {'idequipment': eq_id},
                                {'$set': {'availability': '0'}}
                            )
                            if equipment_result.matched_count == 0:
                                return jsonify({"message": f"Equipment with ID {eq_id} not found"}), 404
                
                return jsonify({"message": "Updated successfully", "id": id}), 201
            else:
                return jsonify({"message": "No row found with the given ID"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        # Retrieve the request from the collection
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

@app.route('/requests/<email>', methods=['GET'])
def my_requests(email):
    try:
        requests_collection = db['requests']
        equipment_collection = db['equipment']
        services_collection = db['services']
        
        requests = requests_collection.find({'requester_email': email})
        
        requests_list = []
        for request in requests:
            request['_id'] = str(request['_id'])
            
            if 'equipment' in request:
                equipment_names = []
                for eq_id in request['equipment']:
                    equipment = equipment_collection.find_one({'idequipment': eq_id})
                    if equipment:
                        equipment_names.append(equipment['description'])
                    else:
                        equipment_names.append("Unknown Equipment")
                request['equipment'] = equipment_names

            if 'services' in request:
                service_names = []
                for service_id in request['services']:
                    service = services_collection.find_one({'fk_idservice': service_id})
                    if service:
                        service_names.append(service['name'])
                    else:
                        service_names.append("Unknown Service")
                request['services'] = service_names

            requests_list.append(request)
        
        if not requests_list:
            return jsonify({"message": "No requests found for the given email"}), 404
        
        return jsonify(requests_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/requests/add', methods=["GET", "POST"])
# @jwt_required()
def add_request(collection="requests"):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        
        try:
            event_start = datetime.fromisoformat(json_input['event_start'].replace("Z", "+00:00"))
            event_end = datetime.fromisoformat(json_input['event_end'].replace("Z", "+00:00"))
        except KeyError as e:
            return jsonify({"message": f"Missing key: {e.args[0]}"}), 400
        except ValueError as e:
            return jsonify({"message": "Invalid date format"}), 400
        
        json_input['event_start'] = event_start
        json_input['event_end'] = event_end
        json_input['request_datetime'] = datetime.now(timezone.utc)
        
        result = collection.insert_one(json_input)
        return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
    
    else:
        pass
        

@app.route('/get_data/<collection_name>')
def get_data(collection_name):
    conditions = request.args.to_dict()

    collection = db[collection_name]

    documents = collection.find(conditions)

    data = [{**doc, '_id': str(doc['_id'])} for doc in documents]

    return jsonify(data)


@app.route('/get_org/<college>')
def get_org(college):
    conditions = request.args.to_dict()

    query = {
        '$or': [
            {'idcollegeoffice': college},
            {'idcollegeoffice': {'$exists': False}},
            {'idcollegeoffice': ''}
        ]
    }

    combined_conditions = {**conditions, **query}

    collection = db['organization']
    documents = collection.find(combined_conditions)

    data = [{**doc, '_id': str(doc['_id'])} for doc in documents]

    return jsonify(data)


    
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

