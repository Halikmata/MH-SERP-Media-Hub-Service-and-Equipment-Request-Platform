from __init__ import db

def apply_foreign(rows_list, collection):
    match collection:        
        case "equipment":
            return equipment_foreign()
        case "":
            pass
        case _:
            return None # collection is already verified in this scenario, but if somehow lands here...
        

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

