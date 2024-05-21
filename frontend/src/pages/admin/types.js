export const types = {
    "equipment": {
        "brand": {
            "data_type": "text",
            "label": "Brand"
        },
        "model": {
            "data_type": "text",
            "label": "Model"
        },
        "type": {
            "data_type": "foreign_xor",
            "label": "Model",
            "option": [
                {
                    "_id": {
                        "$oid": "65e0677bb7506a0d8fcc11b5"
                    },
                    "fk_id": "1",
                    "name": "Camera"
                },
                {
                    "_id": {
                        "$oid": "65e0677bb7506a0d8fcc11b6"
                    },
                    "fk_id": "2",
                    "name": "Microphone"
                },
            ]
        }
    },
    "services": {
        "idservice": {
            "data_type": "text",
            "label": "ID"
        },
        "name": {
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
            "option": ["pending", "approved", "declined"],
            "label": "Status"
        }
    },
    "accounts": {
        "status": {
            "data_type": "text",
            "label": "Status"
        }
    },
    "organization": {
        "org_id": {
            "data_type": "text",
            "label": "Organization ID"
        },
        "idcollegeoffice": {
            "data_type": "text",
            "label": "College ID"
        },
        "name": {
            "data_type": "text",
            "label": "Name"
        },
        "acronym": {
            "data_type": "text",
            "label": "Accronym"
        }
    },

    "college_office": {
        "name": {
            "data_type": "text",
            "label": "Name"
        }
    }
}