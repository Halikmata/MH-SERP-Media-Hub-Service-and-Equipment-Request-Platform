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
    
    # for equipment type
    for x in rows_list: # change id number to string equal
        row = equipment_type.find({f"idequipment_type":x['equipment_type']})
        try:
            name = list(row)[0]["name"]
        except:
            name = None    
        x['equipment_type'] = name
    
    # for availability
    equipment_availability = db['equipment_availability']
    for x in rows_list: # change id number to string equal
        row = equipment_availability.find({f"ID":x['availability']})
        try:
            name = list(row)[0]["Status"]
        except:
            name = None
        x['availability'] = name
    
    for x in rows_list: # decimal128 -> str
        x['unit_cost'] = str(x['unit_cost'])
        
    return rows_list

def requests_foreign(rows_list):
    request_status = db['request_status']
    print(rows_list)
    # not working due to instances having different keys. Check Mongodb request collection for details
    """ for x in rows_list:
        row = request_status.find({f"statusID":x['request_status']})
        try:
            name = list(row)[0]["status"]
        except:
            name = None
        x['request_status'] = name      """ 
    
    equipment = db['equipment']
    for x in rows_list: # foreign key for equipment array containing equipment IDs. May change if same items have same custom ID.
        row = request_status.find()
        
        name_list = list()
        for y in x['equipment']:       
            element = equipment.find({'idequipment':y})
            try:
                name = list(element)[0]['description']
            except:
                name = None
            name_list.append(name)
        
        if not len(name_list) < 1:
            x['equipment'] = name_list
        
    return rows_list

def accounts_foreign(rows_list):
    user_status = db['user_status']
    
    # for user status
    for x in rows_list: # change id number to string equal
        row = user_status.find({f"user_statusid":x['status']})
        try:
            name = list(row)[0]["user_status"]
        except:
            name = None
        x['status'] = name
    
    # for college (e.g CS)
    college_office = db['college_office']
    for x in rows_list: # change id number to string equal
        row = college_office.find({f"idcollegeoffice":x['college']})
        try:
            name = list(row)[0]["name"]
        except:
            name = None
        x['college'] = name
    
    # for organization
    organization = db['organization']
    for x in rows_list: # change id number to string equal
        row = organization.find({f"org_id":x['organization']})
        try:
            name = list(row)[0]["name"]
        except:
            name = None
        x['organization'] = name
    
    return rows_list