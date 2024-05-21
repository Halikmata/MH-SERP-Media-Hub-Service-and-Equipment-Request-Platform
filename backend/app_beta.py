from flask import jsonify, request, make_response
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128
from datetime import datetime, timedelta

import jwt
from __init__ import app, db
from utils import verify_collection, verify_date

from foreign import apply_foreign

from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity
)

from functools import wraps

""" def check_token(f): # custom-made @jwt_required specifically for verifying presence and validating session.
    @wraps(f)
    def get_header_token(*args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.replace("Bearer", "")
        print(token)
        if not token:
            return make_response(jsonify({"msg": "No Session Found"}), 200)
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            
        except jwt.ExpiredSignatureError:
            return make_response(jsonify({"msg": "Session expired"}), 200)
        
        except jwt.InvalidTokenError:
            return make_response(jsonify({"msg": "Invalid session"}), 200) # pops up every time, will fix.

        return f(*args, **kwargs)

    return get_header_token """
    
@app.route('/verify_presence')
@jwt_required()
def verify_presence():
    identity = get_jwt_identity()
    
    accounts = db['accounts'].find({"gmail": identity})
    accounts = list(accounts)

    if len(accounts) >= 1:
        if len(accounts) > 1:
            print("Redundancy Data detected.")
        return make_response(jsonify({"msg": True}), 200)
    

def verify_cookie():
    identity = get_jwt_identity()
    
    accounts = db['accounts'].find({"gmail": identity})
    accounts = list(accounts)

    if len(accounts) >= 1:
        if len(accounts) > 1:
            print("Redundancy Data detected.")
        return True
    else:
        return False  
    
@app.route('/logout',methods=['GET'])
def sign_out(): # sign out redirect to main page.
    
    response = make_response(jsonify({"msg":"Logged out"}))
    response.set_cookie('Authorization', '', expires=datetime.now() - timedelta(days=1)) # cookie remover.
    
    return response, 200

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
        return jsonify({'msg':'Account created!'}), 201
    else:
        return jsonify({'msg':'Account already exists!!'}), 401 # 400 as status code?
    
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
        
        access_token = create_access_token(identity=accounts[0]['gmail'])
        
        response = make_response(jsonify({"msg":True}), 200)
        
        if bool(session_const) == True:
            expire_session = datetime.now() + timedelta(days=7)
            
            # change configs in https deployment
            response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost', expires=expire_session) 
        else:
            response.set_cookie('presence', access_token, httponly=False, secure=False, samesite='None', domain='localhost')
        
        return response # this shouldn't send any important credentials at all.


@app.route('/', methods=['GET'])
def landing_page():
    return jsonify({'msg':'hello'}), 200 # output: related to "View Updates feature"

@app.route('/myrequests', methods=['GET']) # broad error catch fix --------------------------------------------------
@jwt_required()
def user_requests():
    verify = verify_cookie()
    if not verify:
        return make_response(jsonify({'msg':'Not Authorized'}), 401)
    
    collection = db['requests']
    
    page = int(request.args.get('page', default=1))
    if(int(page) < 1):
        page = 1
    # change total rows in a page here. \/
    limit_rows = 20
    offset = (page - 1) * limit_rows
    column = request.args.get('column',default=None)
    search = request.args.get('search',default=None)
    
    identity = get_jwt_identity()
    
    if search != None and column != None:
        query = {f"{column}": {"$regex":f"^{search}.*"}, "requester_email": identity}
        rows = collection.find(query).skip(offset).limit(limit_rows)
    else:
        query = {f"requester_email": identity}
        rows = collection.find(query).skip(offset).limit(limit_rows)
    
    rows_list = list(rows)
    for x in rows_list:
        x['_id'] = str(x['_id'])

    return make_response(jsonify(rows_list), 200)


@app.route('/request/activity', methods=["GET"]) # users can only create two requests per day ---- used in /request/add
@jwt_required()
def user_limit_requests():
    identity = get_jwt_identity()
    
    current_date = datetime.now().date()
    collection = db['requests']
    
    query = {f"requester_email": identity}
    rows = collection.find(query)
    pass # needs a new collection that traces user actions.
    
    

def verify_date(start_date, end_date): # used in /request/add
    
    current_date = datetime.now().date()
    
    # start_date must not be less than current date.
    
    # start_date must not be more than end_date.
    
    # days between start_date and end_date must be less than or equal to ?
    
    # max length between current date and start_date is ?
    
    pass

@app.route('/requests/add', methods=["GET","POST"])
@jwt_required()
def user_add_requests(): # account only can make request twice a day only. check if there's existing new request to date.
    
    if request.method == "POST":
        
        data = request.get_json() # input: request collection attribute (including a new attribute that acts as foreign key <-- primary key from account's objectid)
    
        if data == None:
            return jsonify({"msg":"no form data found"}), 400
        
        collection = db['requests']
        
        identity = get_jwt_identity()
        json_input = request.get_json()
        
        accounts = db['accounts']
        
        query = {"gmail": identity}
        acc_details = accounts.find(query)
        
        if len(acc_details['middle_name']) < 1:
            json_input['requester_full_name'] = f"{acc_details['first_name']} {acc_details['last_name']}"
        else:    
            json_input['requester_full_name'] = f"{acc_details['first_name']} {acc_details['middle_name']} {acc_details['last_name']}"
        
        json_input['requester_phone_number'] = acc_details['phone_number']
        json_input['requester_gmail'] = identity
        json_input['requester_status'] = "3" # user
        json_input['requester_affiliation'] = acc_details
        
        result = collection.insert_one(json_input)
        
        if result:
            return jsonify({"msg": "Instance added successfully"}), 201
        else:
            return jsonify({"msg": "Instance failed to add"}), 400
    else:
        
        foreign_dict = {}
        
        services = db['services']
        
        rows = services.find()
        rows = list(rows)
        
        foreign_dict['services'] = rows
        
        equipments = db['equipment']
        
        rows = equipments.find({"availability":"1"})
        rows = list(rows)
        
        foreign_dict['equipment'] = rows
        
        for x in foreign_dict['services']:
            x.pop("_id", None)
            
        for x in foreign_dict['equipment']:
            x.pop("_id", None)
              
        print(f"test: {foreign_dict}")
        return make_response(jsonify(foreign_dict), 200) # returns services and equipment. dictionary in a dictionary.


""" @app.route('/requests/delete', methods=['POST'])
# @jwt_required() # needs login because its an approute specifically for a user.
def user_delete_requests():
    
    data = request.get_json() # input: user's account object id and request's objectid
    collection = db['requests']
    
    if data == None:
        return jsonify({"msg":"no form data found"}), 400
    
 
    collection = db['requests']
    
    query = {'_id': ObjectId(id), "{new attribute name}": "{new attribute name}"} # _id = specific request it
    result = collection.delete_one(query)
    
    return jsonify({'msg':'hello'}), 200 """


@app.route('/equipments', methods=['GET'])
def equipments():
    collection = db['equipment']
    
    page = int(request.args.get('page', default=1))
    if(int(page) < 1):
        page = 1
    # change total rows in a page here. \/
    limit_rows = 20
    offset = (page - 1) * limit_rows
    column = request.args.get('column',default=None)
    search = request.args.get('search',default=None)
    
    if search != None and column != None:
        query = {f"{column}": {"$regex":f"^{search}.*"}}
        rows = collection.find(query).skip(offset).limit(limit_rows)
        
    else:
        rows = collection.find().skip(offset).limit(limit_rows)
    
    rows_list = list(rows)
    for x in rows_list:
        x['_id'] = str(x['_id'])
    # rows_list = apply_foreign(rows_list, "requests")
    
    return rows_list



@app.route('/services', methods=['GET'])
def services():
    
    return jsonify({'msg':'hello'}), 200



@app.route('/volunteer', methods={'POST'}) # apply volunteer
# @jwt_required() # needs login because its an approute specifically for a user.
def apply_volunteer():
    
    
    return jsonify({'msg':'hello'}), 200

# ---------- User approutes



# on progress ------------

def admin_jwt_required(f): # custom-made @jwt_required specifically for verifying presence and validating session.
    @wraps(f)
    def get_header_token(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return make_response(jsonify({"msg": "No Session Found"}), 401) 
        else:
            token = token[7:]
            
        try:
            # data = jwt.decode(token, app.config['SECRET_KEY'])
            identity = get_jwt_identity()
            
            accounts = db['accounts']
            
            query = {'email':identity}
            result = accounts.find(query)
            
            result = list(result)
            
            if len(result) > 1:
                print('debug: multiple instance detected! [in admin_jwt_required]')
            
            acc_status = result[0]['status']
            
            if acc_status not in ["1","2"]: # if not admin or developer
                return make_response(jsonify({"msg": "Unauthorized Account"}), 401)
            
        except jwt.ExpiredSignatureError:
            return make_response(jsonify({"msg": "Session expired"}), 401)
        
        except jwt.InvalidTokenError:
            return make_response(jsonify({"msg": "Invalid session"}), 401) # issue?

        return f(*args, **kwargs)

    return get_header_token


def get_top_5_requesters(): # top 5 requesters with highest request quantity
    accounts = db['accounts']
    requests = db['requests']
    query = {
        {"$group":{
            "name": "$requester_email", # email will be replaced with name in loop
            "total_requests":{"$sum": 1}
        }},
        {"$sort":{"total_requests": -1}},
        {"$limit":5}
    }
    count_requests = requests.aggregate(query)
    count_requests = list(count_requests)
    
    for x in count_requests:
        query = {'email': x['name']}
        result = accounts.find(query)
        acc = list(result)[0]
        
        name = f"{acc['fname']} {acc['mname']} {acc['lname']}"
        x['name'] = name
        
    return count_requests

def get_top_5_equipments(): # most borrowed equipment per month of current year --
    equipment = db['equipment']
    request = db['requests']
    
    query = {}
    
    results = request.aggregate()
    
    return
    

@app.route('/admin')
@admin_jwt_required
def admin_index():
    
    equipment = db['equipment']
    services = db['services']
    accounts = db['accounts']
    #organization = db['organization']
    info = {}
    
    acc_results = accounts.find() # list of accounts
    acc_results = list(acc_results)
    
    info['top_5'] = get_top_5_requesters()
    
    info['frequent_equipments'] = get_top_5_equipments() # incomplete
    
    
    
    
    
    
    
    
    return make_response(jsonify(info), 200)

    

""" @app.route('/admin/requests/conclude', methods=['POST']) # this assumes that admins are the ones that declare requests as finished.
def admin_request_conclude():
    json_input = request.get_json()
    id = int(request.args.get('id', default=None))

    if id == None:
        return jsonify({'msg':'Bad request, no ID found!'}), 400

    collection = db['requests']
    rows = collection.update_one({'_id':ObjectId(id)}, {'$set': '':json_input[]})
    
    
    return jsonify({'msg':'Request instance conluded'}), 201 """


    
@app.route('/admin/report', methods=['GET'])
@admin_jwt_required
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
    return jsonify({'msg':'hello'}), 200

@app.route('/admin/login', methods=['POST'])
def admin_login():
    return jsonify({'msg':'hello'}), 200


@app.route('/<collection>', methods=['GET'])
# @jwt_required()
def admin_main_page(collection):
    if not verify_collection(collection):
        return jsonify({"msg": "Unknown URL"}), 404
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
            return jsonify({'msg':'instance not found'}), 400
    
    if(int(page) < 1): # avoids negatives.
        page = 1
    
    limit_rows = 20 # change total rows in a page here.
    offset = (page - 1) * limit_rows
    
    if search != None and column != None:
        rows = collection.find({f"{column}": {"$regex":f"^{search}.*"}}).skip(offset).limit(limit_rows)
        
    elif search == None and column == None:
        rows = collection.find().skip(offset).limit(limit_rows)
        
    else:
        return jsonify({'msg': 'May have given search value thrown but no column value, or vice versa.'}), 400 # must have both column and search values or both have none in value.
    
    rows_list = list(rows)
    
    for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
        x['_id'] = str(x['_id'])
        
    #rows_list = apply_foreign(rows_list,col_name)
    return jsonify(rows_list), 200

@app.route('/admin/<collection>/add', methods=["GET","POST"])
# @jwt_required()
def admin_add_row(collection):   
    if not verify_collection(collection):
        return jsonify({"msg": "Unknown URL"}), 404
    else:
        collection = db[collection]
    
    if request.method == "POST":
        json_input = request.get_json()
        json_input = json_input.pop('_id')
        result = collection.insert_one(json_input)
        return jsonify({"msg": "Row added successfully", "id": str(result.inserted_id)}), 201
    else:
        
        pass
        # will add GET request for acquiring choose-able options
    

@app.route('/admin/<collection>/update/<id>', methods=['GET','POST']) # not yet tested -------------------------------------------------------------------- 
# @jwt_required()
def admin_update_row(collection, id):
    
    if not verify_collection(collection):
        return jsonify({"msg": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    if request.method == "POST":
        json_input = request.get_json()
        
        result = collection.update_one({'_id':ObjectId(id)}, {'$set': json_input})
          
        if result.modified_count >  0:
            return jsonify({"msg": "Updated successfully", "id": id}), 201
        else:
            return jsonify({"msg": "No row found with the given ID"}), 404
        
    else:

        result = collection.find_one({'_id': ObjectId(id)})
        
        for x in result:
            x['_id'] = str(x['_id'])
        return jsonify(result), 200
    
@app.route('/admin/<collection>/delete/<id>', methods=['POST'])
# @jwt_required()
def admin_delete_row(collection, id):
    
    if not verify_collection(collection):
        return jsonify({"msg": "Unknown URL"}), 404
    else:
        collection = db[collection]
        
    result = collection.delete_one({'_id': ObjectId(id)})
    
    if result.deleted_count > 0:
        return jsonify({"msg": "Deleted successfully", "id": id}), 201
    else:
        return jsonify({"msg": "No row found with the given ID"}), 404


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
            return jsonify({"msg": "No available items found"}), 404

        return jsonify(available_items)

    except Exception as e:
        return jsonify({"error": str(e)}), 500