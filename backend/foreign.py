from __init__ import db

def apply_foreign(rows_list, col_name):
    match col_name:
        case "equipment":
            return equipment_foreign(rows_list)
        case "requests":
            return requests_foreign(rows_list)
        case "accounts":
            return accounts_foreign(rows_list)
        case _:
            return rows_list # returns collections with no foreign keys
        
def equipment_foreign(rows_list):
    equipment_type = db['equipment_type']
    
    for x in rows_list: # change id number to string equal
        row = equipment_type.find({f"idequipment_type":x['equipment_type']})
        try:
            name = list(row)[0]["name"]
        except:
            name = None    
        x['equipment_type'] = name       
    return rows_list

def requests_foreign(rows_list):
    request_status = db['request_status']
    
    for x in rows_list:
        row = request_status.find({f"statusID":x['request_status']})
        try:
            name = list(row)[0]["status"]
        except:
            name = None
        x['request_status'] = name      
         
    return rows_list

def accounts_foreign(rows_list):
    user_status = db['user_status']
    
    for x in rows_list: # change id number to string equal
        row = user_status.find({f"user_statusid":x['status']})
        try:
            name = list(row)[0]["user_status"]
        except:
            name = None    
        x['status'] = name
    return rows_list