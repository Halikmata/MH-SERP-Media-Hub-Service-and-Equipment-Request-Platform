from flask import Flask

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from faker import Faker
from flask_jwt_extended import JWTManager
from flask_cors import CORS
fake = Faker() # rechanges secret key every server restart

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://elsidpanolino:ELSID62mdb@cluster0.xzw6t37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.config['JWT_SECRET_KEY'] = fake.bothify(text='??????#####')
app.config['SECURE_COOKIE_SECURE'] = False # allows cookie only in https, set to true upon declaration
jwt = JWTManager(app)

mongodb_client = MongoClient(app.config["MONGO_URI"], server_api=ServerApi('1'))
db = mongodb_client['mh-serp']


CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True}}) # must specify origins later on.
#CORS(app)
# CORS config is yet to be fully secured due to nature of HTTP. Config must be adjusted later on upon deployement (HTTPS)


