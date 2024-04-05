import pymongo
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Access environment variables
uri = os.getenv("MongoDBDriver")

client = pymongo.MongoClient(uri)
database = client["Backend"]

# Define JSON Schema for validation
trip_schema = {
     "$jsonSchema": {
         "bsonType": "object",
        "required": ["tripuser_id","date", "start_address", "dest_address","distance"],
        "properties": {
            "tripuser_id": {
                "bsonType": "objectId",
                "description": "must be a objectId and is required"
            },
            "date": {
                "bsonType": "date",
                "description": "must be a date and is required"
            },
            "start_address": {
                "bsonType": "string",
                "description":"must be a string and is required"
            },
            "dest_address": {
                "bsonType": "string",
                "description":"must be a string and is required"
            },
            "distance": {
                "bsonType": "string",
                "description": "must be a string and is requried"
            }
        }
    }
}

# Create collection with schema validation
collection = database.create_collection("trips")
database.command("collMod", "trips", validator=trip_schema)
# Add unique index on the email field
