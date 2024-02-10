from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()
uri = os.getenv("MongoDBDriver")



def mongo_connection():
    # Create a new client and connect to the server
    client = MongoClient(uri)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client['Backend']
    except Exception as e:
        print(e)
        
    
def insert_user(connection, user):
    collection_name = connection["users"]
    collection_name.insert_one(user)