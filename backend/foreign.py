from __init__ import db

def apply_foreign(rows_list, col_name):
    match col_name:
        case "equipment":
            return equipment_foreign(rows_list)
        case "requests":
            return request_foreign(rows_list)
        case _:
            return rows_list # returns collections with no foreign keys
        

def equipment_foreign(rows_list):
    # get info in equipment_type.
    equipment_type = db['equipment_type']
    # equipment_rows_list = list(equipment_type)
    
    for x in rows_list: # change id number to string equal
        row = equipment_type.find({f"idequipment_type":x['equipment_type']})
        try:
            name = list(row)[0]["name"]
        except:
            name = None    
        x['equipment_type'] = name       
    return rows_list

def request_foreign(rows_list):
    pass