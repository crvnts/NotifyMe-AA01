from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['SECRET_KEY'] = "aaaaaaaaaaaaa"
app.config["MONGO_URI"] = "mongodb+srv://ryanj1534:Fe5uemCVwY8Rq1no@testaa01.2rnejhm.mongodb.net/Backend"
# mongodb database
mongo = PyMongo(app)
db = mongo.db

from src import mongodb, ttcService, jwtokenUtil