from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)
CORS(app)

def connect_to_mongodb():
    try:
        client = MongoClient("mongodb+srv://mediahubserp:loremipsum1234@cluster0.horknch.mongodb.net/?retryWrites=true&w=majority")
        client.admin.command('ismaster')
        return True
    except ConnectionFailure:
        return False

@app.route('/')
def index():
    if connect_to_mongodb():
        return jsonify({"status": "Connected to MongoDB"})
    else:
        return jsonify({"status": "Failed to connect to MongoDB"})

if __name__ == "__main__":
    app.run(debug=True)
