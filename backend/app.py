from flask import jsonify, request
from bson.objectid import ObjectId
# from pymongo.errors import ConnectionFailure
from jwt_utils import check_token
import jwt
from __init__ import app, db
from utils import verify_collection

from foreign import apply_foreign

# doesn't have restrictions yet but login is partially prepared.

# untested route but replicated from previous project.
@app.route("/login",methods=["POST"]) 
def login(): # will add gmail api, email sent verification, and jwt encode for password support soon.
    data = request.get_json() # contains login credentials (email and password)
    
    if 'email' not in data or 'password' not in data:
        return jsonify({"message":"Missing Email or Password"}), 401
    
    email = data['email']
    password = data['password']
    
    accounts = db['accounts'].find({"gmail":email, "password":password})
    
    if accounts.count == 0:
        return jsonify({"message":"Wrong Email or Password"}), 401
    
    elif accounts.count == 1:
        token = jwt.encode({'email': email}, app.config['SECRET_KEY'], algorithm='HS256') # encodes to check integrity
        response = token.decode('UTF-8') # and then decodes it..
        
        return jsonify({"message":f"{response}"}), 200
    else:
        token = jwt.encode({'email': email}, app.config['SECRET_KEY'], algorithm='HS256')
        response = token.decode('UTF-8')
        
        print("more than 1 rows received, data redundancy detected.") # debugger for accounts collection row duplicates.
        return jsonify({"message":f"{response}"}), 200

# the token received in login() should be temporarily stored in the session.

@app.route('/<collection>', methods=['GET'])
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
        
    rows_list = apply_foreign(rows_list,col_name)

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
        return jsonify({"message": "No row found with the given ID"}), 404


@app.route('/equipment/available', methods=['GET'])
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
    
""" if __name__ == "__main__":
    #print_collections()
    app.run(debug=True,host="127.0.0.1") """
