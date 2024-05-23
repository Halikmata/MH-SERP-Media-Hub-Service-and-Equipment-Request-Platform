
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
        "type": {
            "editable" : 1,
            "data_type": "foreign_xor",
            "label": "Type",
            "option": [
                {
                  "_id": "662172f13070cb86234d12a0",
                  "fk_idequipment_type": "1",
                  "name": "Camera"
                },
                {
                  "_id": "662172f13070cb86234d12aa",
                  "fk_idequipment_type": "11",
                  "name": "HDMI Cable"
                },
                {
                  "_id": "662172f13070cb86234d12a1",
                  "fk_idequipment_type": "2",
                  "name": "Microphone"
                },
                {
                  "_id": "662172f13070cb86234d12a9",
                  "fk_idequipment_type": "10",
                  "name": "XLR Cable"
                },
                {
                  "_id": "662172f13070cb86234d12ad",
                  "fk_idequipment_type": "14",
                  "name": "SD Card"
                },
                {
                  "_id": "662172f13070cb86234d12af",
                  "fk_idequipment_type": "16",
                  "name": "Battery"
                },
                {
                  "_id": "662172f13070cb86234d12b3",
                  "fk_idequipment_type": "20",
                  "name": "Backdrop"
                },
                {
                  "_id": "662172f13070cb86234d12ac",
                  "fk_idequipment_type": "13",
                  "name": "Audio Mixer"
                },
                {
                  "_id": "662172f13070cb86234d12b0",
                  "fk_idequipment_type": "17",
                  "name": "Tripod"
                },
                {
                  "_id": "662172f13070cb86234d12b8",
                  "fk_idequipment_type": "25",
                  "name": "Bag"
                },
                {
                  "_id": "662172f13070cb86234d12b9",
                  "fk_idequipment_type": "26",
                  "name": "Clap Board"
                },
                {
                  "_id": "662172f13070cb86234d12ba",
                  "fk_idequipment_type": "27",
                  "name": "Gear Stand"
                },
                {
                  "_id": "662172f13070cb86234d12bc",
                  "fk_idequipment_type": "29",
                  "name": "Light Stand"
                },
                {
                  "_id": "662172f13070cb86234d12a2",
                  "fk_idequipment_type": "3",
                  "name": "Speaker"
                },
                {
                  "_id": "662172f13070cb86234d12a8",
                  "fk_idequipment_type": "9",
                  "name": "Monitor"
                },
                {
                  "_id": "662172f13070cb86234d12a3",
                  "fk_idequipment_type": "4",
                  "name": "Headphones"
                },
                {
                  "_id": "662172f13070cb86234d12a4",
                  "fk_idequipment_type": "5",
                  "name": "Lights"
                },
                {
                  "_id": "662172f13070cb86234d12a5",
                  "fk_idequipment_type": "6",
                  "name": "Camera Jib"
                },
                {
                  "_id": "662172f13070cb86234d12a6",
                  "fk_idequipment_type": "7",
                  "name": "Boom Pole"
                },
                {
                  "_id": "662172f13070cb86234d12a7",
                  "fk_idequipment_type": "8",
                  "name": "Video Switcher"
                },
                {
                  "_id": "662172f13070cb86234d12ae",
                  "fk_idequipment_type": "15",
                  "name": "Extension"
                },
                {
                  "_id": "662172f13070cb86234d12b2",
                  "fk_idequipment_type": "19",
                  "name": "Audio Jack Adapter"
                },
                {
                  "_id": "662172f13070cb86234d12b6",
                  "fk_idequipment_type": "23",
                  "name": "Gimbal"
                },
                {
                  "_id": "662172f13070cb86234d12b7",
                  "fk_idequipment_type": "24",
                  "name": "Recorder"
                },
                {
                  "_id": "662172f13070cb86234d12bb",
                  "fk_idequipment_type": "28",
                  "name": "Other"
                },
                {
                  "_id": "662172f13070cb86234d12ab",
                  "fk_idequipment_type": "12",
                  "name": "Audio Interface"
                },
                {
                  "_id": "662172f13070cb86234d12b1",
                  "fk_idequipment_type": "18",
                  "name": "Camera Lens"
                },
                {
                  "_id": "662172f13070cb86234d12b4",
                  "fk_idequipment_type": "21",
                  "name": "Amplifier"
                },
                {
                  "_id": "662172f13070cb86234d12b5",
                  "fk_idequipment_type": "22",
                  "name": "Teleprompter"
                }
              ]
        },
        "equipment_location": {
            "editable" : 1,
            "data_type": "number",
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
        "type": {
            "editable" : 1,
            "data_type": "text",
            "label": "User Type"
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