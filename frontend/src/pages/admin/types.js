
export const types = {
    "equipment": {
        "idequipment": {
            "editable" : 1,
            "data_type": "text",
            "label": "ID"
        },
        "brand": {
            "editable" : 1,
            "data_type": "text",
            "label": "Brand"
        },
        "model": {
            "editable" : 1,
            "data_type": "text",
            "label": "Model"
        },
        "description": {
            "editable" : 1,
            "data_type": "text",
            "label": "Description"
        },
        "unit_cost": {
            "editable" : 1,
            "data_type": "number",
            "label": "Cost"
        },
        "equipment_type": {
            "editable" : 1,
            "data_type": "foreign_xor",
            "label": "Type",
            "collection_option": "equipment_type",
            "identifier":"fk_idequipment_type"
        },
        "equipment_location": {
            "editable" : 1,
            "data_type": "text",
            "label": "Location"
        },
    },
    "services": {
        "fk_idservice": {
            "data_type": "text",
            "label": "ID"
        },
        "name": {
            "editable" : 1,
            "data_type": "text",
            "label": "Name"
        }
    },
    "requests": {
        "event_name": {
            "data_type": "text",
            "label": "Event"
        },
        "requester_full_name": {
            "data_type": "text",
            "label": "Requester's Fullname"
        },
        "event_affiliation": {
            "data_type": "text",
            "label": "Event Affifliation"
        },
        "event_location": {
            "data_type": "text",
            "label": "Location"
        },
        "request_status": {
            "editable" : 1,
            "data_type": "xor",
            "option": ["pending", "approved", "declined", "done"],
            "label": "Status"
        }
    },
    "accounts": {
        "fk_IDaccount": {
            "data_type": "text",
            "label": "Account number"
        },
        "email": {
            "data_type": "text",
            "label": "Email"
        },
        "first_name": {
            "data_type": "text",
            "label": "First name"
        },
        "last_name": {
            "data_type": "text",
            "label": "Last name"
        },
        "middle_name": {
            "data_type": "text",
            "label": "Middle name"
        },
        "phone_number": {
            "data_type": "text",
            "label": "Phone number"
        },
        "username": {
            "data_type": "text",
            "label": "User Name"
        },
        "user_type": {
            "data_type": "text",
            "label": "User Type"
        },
        "college": {
            "data_type": "text",
            "label": "College"
        },
        "organization": {
            "data_type": "text",
            "label": "Organization"
        },
        "status": {
            "editable" : 1,
            "data_type": "xor",
            "option":["No IR","Has IR"],
            "label": "Status"
        }
    },
    "organization": {
        "fk_org_id": {
            "data_type": "text",
            "label": "Organization ID"
        },
        "idcollegeoffice": {
            "editable" : 1,
            "data_type": "number",
            "label": "College ID"
        },
        "name": {
            "editable" : 1,
            "data_type": "text",
            "label": "Name"
        },
        "acronym": {
            "editable" : 1,
            "data_type": "text",
            "label": "Accronym"
        },
        "program": {
            "editable" : 1,
            "data_type": "text",
            "label": "Program"
        }
    },

    "college_office": {
        "fk_idcollegeoffice": {
            "data_type": "number",
            "label": "ID"
        },
        "name": {
            "editable" : 1,
            "data_type": "text",
            "label": "Name"
        },
        "acronym": {
            "editable" : 1,
            "data_type": "text",
            "label": "Accronym"
        },
        "type": {
            "editable" : 1,
            "data_type": "text",
            "label": "Type"
        },
    }
}