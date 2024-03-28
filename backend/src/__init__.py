from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
from os import environ

app = Flask(__name__)

CORS(app)
load_dotenv('.env')
app.config['SECRET_KEY'] = "aaaaaaaaaaaaa"
app.config["MONGO_URI"] = environ.get('MongoDBDriver')
app.config['GO_KEY'] = environ.get('GoAPI')

# mongodb database
mongo = PyMongo(app)
db = mongo.db

from src import mongodb, ttcService, jwtokenUtil