from flask import Flask
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from faker import Faker
from flask_jwt_extended import JWTManager

fake = Faker() # rechanges secret key every server restart

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://elsidpanolino:ELSID62mdb@cluster0.xzw6t37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.config['SECRET_KEY'] = fake.bothify(text='??????#####')
jwt = JWTManager(app)

mongodb_client = MongoClient(app.config["MONGO_URI"], server_api=ServerApi('1'))
db = mongodb_client['mh-serp']

CORS(app)


