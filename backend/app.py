from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)
CORS(app)

def connect_to_mongodb():
    try:
        client = MongoClient("mongodb+srv://psumhserp:loremipsum1234@cluster0.leaajze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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
