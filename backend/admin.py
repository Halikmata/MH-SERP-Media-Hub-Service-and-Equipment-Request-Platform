from flask import Blueprint, jsonify, request, make_response
from bson.objectid import ObjectId
from bson.decimal128 import Decimal128
from bson.binary import Binary
from datetime import datetime, timezone, timedelta
import re

import jwt
from __init__ import app, db
from utils import verify_collection
import utils

from foreign import apply_foreign

# doesn't have restrictions yet but login is partially prepared.

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)


admin_routes = Blueprint('admin_routes', __name__)

# -------------------ROUTES----------------------------

@app.route('/admin/<collection>', methods=['GET'])
def admin(collection):
    if not verify_collection(collection):
        return jsonify({"message": "Unknown URL"}), 404
    else:
        collection = db[collection]

    search = request.args.get('search')
    sort = request.args.getlist('sort')  # Multiple fields for sorting
    order = request.args.getlist('order')  # Corresponding order for each field
    page = int(request.args.get('page', 1))  # Default to page 1 if not specified

    # Handle limit (if 'limit' is passed as 0 or 'none', there's no limit)
    limit_param = request.args.get('limit', '10')
    if limit_param.lower() == 'none':
        limit = 0  # No limit
    else:
        try:
            limit = int(limit_param)
        except ValueError:
            limit = 10  # Default limit if parsing fails

    exclude = request.args.getlist('exclude')

    # Build filters dynamically from query parameters
    filters = {}
    for key, value in request.args.items():
        if key.startswith('filter_'):  # Only consider filter keys with 'filter_' prefix
            field = key[7:]  # Remove 'filter_' prefix to get the actual field name
            if field not in filters:
                filters[field] = []
            # Convert filter value to integer if it's a number (for fields like `request_status`)
            try:
                filters[field].append(int(value))  # Attempt to convert to integer
            except ValueError:
                filters[field].append(value)  # If not a number, leave as string
        # Handle custom filter formats like '0=filter_request_status=0'
        elif '=' in key and 'filter' in key:
            field_value = key.split('=')  # Split by equal sign
            if len(field_value) == 2:
                field, value = field_value
                if field not in filters:
                    filters[field] = []
                # Convert filter value to integer if it's a number
                try:
                    filters[field].append(int(value))  # Attempt to convert to integer
                except ValueError:
                    filters[field].append(value)  # If not a number, leave as string

    # Convert list of values into $in query for multiple values in filters
    for field, values in filters.items():
        filters[field] = {"$in": values}  # Use $in for matching any of the values

    # Start query with filters, if no search or filter is provided, it will be empty
    query = filters
    if search:
        query["$text"] = {"$search": search}  # Add full-text search if a search term is provided

    # Handle sorting logic (sort by fields in 'sort' with order specified in 'order')
    sort_criteria = []
    if sort and order:
        for field, direction in zip(sort, order):
            sort_criteria.append((field, 1 if direction.lower() == "asc" else -1))

    skip = (page - 1) * limit if limit > 0 else 0  # Calculate how many records to skip for pagination

    # Handle excluding fields (exclude fields will not be returned in the result)
    projection = {}
    if exclude:
        projection = {field: 0 for field in exclude}

    # Perform the query with sorting and pagination
    cursor = collection.find(query, projection)

    if sort_criteria:
        cursor = cursor.sort(sort_criteria)  # Apply sorting first

    if limit > 0:
        cursor = cursor.skip(skip).limit(limit)  # Apply pagination after sorting
    else:
        cursor = cursor.skip(skip)  # Skip without applying a limit

    results = list(cursor)

    # Convert _id to string for each item for consistent JSON output
    for item in results:
        item['_id'] = str(item['_id'])

    # Get the total count for pagination (this does not count the skip/limit)
    total_count = collection.count_documents(query)

    return jsonify({
        "total": total_count,
        "page": page,
        "limit": limit if limit > 0 else "none",  # Return "none" if no limit is set
        "data": results
    })



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


@app.route('/admin/news', methods=['GET',"POST"]) # news management to show on end-user home page -- prototype version
# @jwt_required()
# check if account has privilege
def news_management():
    if request.method == "GET": # list of posts
        collection = db["news"]
        
        page = int(request.args.get('page', default=1)) # possibly deprecated
        column = request.args.get('column',default=None)
        search = request.args.get('search',default=None)
        sort = request.args.get('sort', default=None) # 1 = asc, -1 = desc
        limit_rows = int(request.args.get('limit_rows',default=50)) # possibly deprecated
        
        # stuff here
        
        rows = collection.find()
        
        rows_list = list(rows)
    
        for x in rows_list: # turns ObjectID to str, to make it possible to jsonify.
            x['_id'] = str(x['_id'])
            
        return jsonify(rows_list), 200
    
    elif request.method == "POST": # actions for posts, create, edit, delete
        collection = db["news"]
        action = request.args.get('action',default=None)
        json_input = request.get_json()
        match action:
            case "add":
                result = collection.insert_one(json_input)
                
                # management for pictures if exists
                
                return jsonify({"message": "Row added successfully", "id": str(result.inserted_id)}), 201
            case "edit":
                json_input = request.get_json()
                
                result = collection.update_one({'_id':ObjectId(json_input["id"])}, {'$set': json_input})
                
                if result.modified_count >  0:
                    return jsonify({"message": "Updated successfully", "id": id}), 201
                else:
                    return jsonify({"message": "No row found with the given ID"}), 404
                
            case "delete":
                result = collection.delete_one({'_id': ObjectId(json_input["id"])})
    
                if result.deleted_count > 0:
                    return jsonify({"message": "Deleted successfully", "id": id}), 201
                else:
                    return jsonify({"message": "No row found with the given ID"}), 404
            case _:
                return jsonify({"message": "Unidentified Action!"}), 404


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
        result = collection.find_one({'_id': ObjectId(id)})
        
        if result:
            result['_id'] = str(result['_id'])
            return jsonify(result), 200
        else:
            return jsonify({"message": "No row found with the given ID"}), 404
        
        
        

@app.route('/admin/foreign/<collection>', methods=['GET'])
def get_foreign_data(collection):
    # Get the query parameters
    ids = request.args.get('ids')  # A comma-separated string of IDs
    id_field = request.args.get('id_field')  # The custom ID field (e.g., 'equipment_id')

    if not ids or not id_field:
        return jsonify({"message": "Missing parameters: 'ids' or 'id_field'"}), 400

    # Convert the 'ids' parameter into a list
    ids_list = ids.split(',')

    # Fetch the collection
    collection = db[collection]

    # Query the collection based on the custom ID field
    query = {id_field: {"$in": ids_list}}

    # Retrieve the documents
    documents = collection.find(query)

    # Prepare the response data
    data = [{**doc, '_id': str(doc['_id'])} for doc in documents]

    return jsonify(data)

'''

@app.route('/admin/requests/', methods=['GET'])
def admin_requests():
    try:
        # Collections
        requests_collection = db['requests']
        equipment_collection = db['equipment']
        services_collection = db['services']

        # Query parameters
        search = request.args.get('search', '').strip()
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        order = request.args.get('order', 'asc')

        # Base query
        query = {}
        if search:
            query["$or"] = [
                {"requester_full_name": {"$regex": search, "$options": "i"}},
                {"event_name": {"$regex": search, "$options": "i"}},
                {"event_location": {"$regex": search, "$options": "i"}},
                {"requester_email": {"$regex": search, "$options": "i"}}
            ]

        # Sort order
        sort_order = -1 if order == 'desc' else 1

        # Fetch data sorted by status and timestamp
        requests_cursor = (
            requests_collection.find(query)
            .sort([("request_status", sort_order), ("request_datetime", sort_order)])
            .skip((page - 1) * per_page)
            .limit(per_page)
        )

        # Process requests
        requests_list = []
        for req in requests_cursor:
            req['_id'] = str(req['_id'])
            req['equipment'] = [
                f"{equipment['brand']} {equipment['model']}"
                if (equipment := equipment_collection.find_one({'idequipment': eq_id}))
                else "Unknown Equipment"
                for eq_id in req.get('equipment', [])
            ]
            req['services'] = [
                service['name']
                if (service := services_collection.find_one({'fk_idservice': service_id}))
                else "Unknown Service"
                for service_id in req.get('services', [])
            ]
            requests_list.append({
                "_id": req["_id"],
                "event_affiliation": req.get("event_affiliation"),
                "event_name": req.get("event_name"),
                "event_location": req.get("event_location"),
                "event_details": req.get("event_details"),
                "event_start": req.get("event_start"),
                "event_end": req.get("event_end"),
                "requester_full_name": req.get("requester_full_name"),
                "requester_email": req.get("requester_email"),
                "requester_phone_number": req.get("requester_phone_number"),
                "requester_status": req.get("requester_status"),
                "request_status": req.get("request_status"),
                "equipment": req.get("equipment"),
                "services": req.get("services"),
                "request_datetime": req.get("request_datetime")
            })

        # Return flat list of requests
        return jsonify(requests_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


'''


# ------------------ANALYTICS----------------------------
def get_month_requesters(): # top 5 requesters with highest request quantity per month
    requests = db['requests']
    
    current_date = datetime.now().replace(day=1)
    query = [
        {
            "$match":{
                "event_start": {
                    "$gte": current_date
                }
            }
        },
        {
            "$group":{
            "_id": "$requester_full_name",
            "total_requests":{"$sum": 1}
            }
        },
        {
            "$sort":
                {
                    "total_requests": -1
                }
        },
        {
            "$limit":5
        }
    ]
    count_requests = requests.aggregate(query)
    count_requests = list(count_requests)
        
    return count_requests

def get_month_services():
    services = db['services']
    request = db['requests']
    
    current_date = datetime.now().replace(day=1)
    query = [
        {
            "$match":{
                "event_start": {
                    "$gte": current_date
                }
            }
        },
        {
            "$unwind": "$services"
        },
        {
            "$group": {
                "_id": "$services",
                "count":{"$sum": 1}
            }
        },
        {
            "$sort":
            {
                "count": -1
            }
        },
        {
            "$limit": 5
        }
    ]
    
    results = request.aggregate(query)
    results = list(results)
    
    for x in results:
        
        row = services.find({"fk_idservice": x['_id']})
        row = list(row)[0]
        x['_id'] = row['name']
    
    return results

def get_month_equipments():
    requests = db['requests']
    equipment = db['equipment']
    
    current_date = datetime.now().replace(day=1)
    query = [
        {
            "$match":{
                "event_start": {
                    "$gte": current_date
                }
            }
        },
        {
            "$unwind": "$equipment"
        },
        {
            "$group": {
            "_id": "$equipment",
            "count":{"$sum": 1}
            }
        },
        {
            "$sort":
            {
                "count": -1
            }
        }
    ]
    
    results = requests.aggregate(query)
    results = list(results)
    
    for x in results:
        
        row = equipment.find({"idequipment":x['_id']})
        
        row = list(row)[0]
        
        x['_id'] = row['brand'] +" "+ row['model']
    
    return results

@app.route('/admin')
# jwt required
def admin_index():
    
    info = {}
    
    info['top_5_requesters'] = get_month_requesters()
    
    info['top_5_services'] = get_month_services()
    
    info['equipments_month'] = get_month_equipments()
    
    return make_response(jsonify(info), 200)