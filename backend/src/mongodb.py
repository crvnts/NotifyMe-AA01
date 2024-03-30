from src import app, jwtokenUtil
from flask import render_template, request, redirect, flash, url_for, Response, jsonify
from bson import ObjectId, json_util
import json
import jwt
import bcrypt
from src import db
from datetime import datetime
import re 


def get_hashed_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())


def check_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def is_valid_username(username):
    # Username can contain letters (both uppercase and lowercase), numbers, underscores, and dots
    # It should be between 5 and 20 characters long
    return re.match("^[a-zA-Z0-9_.]{5,20}$", username) is not None

def is_valid_password(password):
    # Password must be at least 8 characters long
    return len(password) >= 8

def is_valid_email(email):
    # Regular expression for basic email validation
    return re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email) is not None

@app.route("/register", methods={'POST'})

def insert_user():
    request_data = request.get_json()
    if request.method == "POST":
        try:
            name = request_data['name']
            if (is_valid_email(request_data['email'])):
                email = request_data['email']
            else:
                return {
                    "message":"Invalid email input",
                    "error":"Invalid email"
                }, 400
            if (is_valid_username(request_data['username'])):
                username = request_data['username']
            else:
                return {
                    "message":"Invalid username input",
                    "error":"Invalid username"
                }, 400
            if (is_valid_password(request_data['password'])):
                password = request_data['password']
            else:
                return {
                    "message":"Invalid password input",
                    "error":"Invalid password"
                }, 400
            street = request_data['street']
            city = request_data['city']
            province = request_data['province']
            postal = request_data['postal']
        except Exception as e:
            return {
                "error": "Missing field data",
                "message": str(e)
            }, 400     
    trips = []
    newUser ={
        "name": name,       
        "email": email,
        "username": username,
        "password": get_hashed_password(password).decode('utf-8'),
        "address": {
            "street": street,
            "city": city,
            "province": province,
            "postal": postal
        },
        "tripCount": len(trips),
        "trips": trips
    }
    if db.users.find_one({"username": username}):
        return {
            "error":"Username is already taken"
        }, 409
    if db.users.find_one({"email":email}):
        return {
            "error":"Email is already used"
        }, 409
    try: 
        db.users.insert_one(newUser)
        return Response("User added successfully", status=201)
    except Exception as e:
        return {
            "error": "Something went wrong",
            "message": str(e)
        }, 500


@app.route("/login", methods={'POST'})
def login():
    request_data = request.get_json()
    if request.method == "POST":
        try:
            username = request_data['username']
            password = request_data['password']
        except Exception as e:
            return {
                "error": "Missing field data",
                "message": str(e)
            }, 400 
    try:
        user = db.users.find_one({"username": username})
    except Exception as e:
        return {
            "error": "Wrong username or password",
            "message": str(e)
        }, 400  

    if (check_password(password, user['password'])):
        try:
            # token should expire after 24 hrs
            user["token"] = jwt.encode(
                {"username": user["username"]},
                app.config["SECRET_KEY"],
                algorithm="HS256"
            )
            return {
                "message": "Successfully fetched auth token",
                "data": user["token"]
            }, 200
        except Exception as e:
            return {
                "error": "Error fetching auth token",
                "message": str(e)
            }, 500

    return {
        "message": "Error fetching auth token!, invalid email or password",
        "data": None,
        "error": "Unauthorized"
    }, 500


@app.route("/authTest", methods={'POST'})
@jwtokenUtil.token_required
def authTest(current_user):
    return jsonify(current_user['username'])

@app.route("/addTrips", methods ={'POST'})
@jwtokenUtil.token_required
def addTrips(current_user):
    request_data = request.get_json()
    newCounter = current_user['tripCount']+1
    newTrip = {
        'tripuser_id': current_user['_id'],
        'date': datetime.now(),
        'start_address':request_data['start_address'],
        'dest_address': request_data['dest_address'],
        'distance': request_data['distance'],
    }
    try: 
        db.trips.insert_one(newTrip)
    except Exception as e:
        return {
            "error": "Something went wrong adding trip information",
            "message": str(e)
        }, 500
    newTrips = []
    try:
        trips = db.trips.find({"tripuser_id": current_user['_id']})
        for trip in trips:
            newTrips.append(trip['_id'])

        user = db.users.update_one({"username": current_user['username']}, {
            "$set": {"tripCount": newCounter, "trips":newTrips}})
        return {
            "message": "Updated user trip count",
            "data": newCounter,
        }, 200
    except Exception as e:
        return {
            "error": "Unable to update trip count",
            "message": str(e)
        }, 500
    
@app.route("/getTrips", methods ={'GET'})
@jwtokenUtil.token_required
def getPastTrips(current_user):
    gotTrips = []
    try:
        trips = current_user['trips']
        for trip in trips:
            received = db.trips.find_one({"_id": trip})
            gotTrips.append({
                'date': received['date'],
                'start_address': received['start_address'],
                'dest_address': received['dest_address'],
                'distance': received['distance']
                })
        return {
            "message": "All of user's trips",
            "data": gotTrips,
        }, 200
    except Exception as e:
        return {
            "error": "Unable to get trips",
            "message": "help"
        }, 500

@app.route("/userAddress", methods={'GET'})
@jwtokenUtil.token_required
def userAddress(current_user):
    return jsonify(current_user['address'])

@app.route("/getUser", methods={'GET'})
@jwtokenUtil.token_required
def getUserInfo(current_user):
    newUser = {
        "name": current_user['name'],
        "email": current_user['email'],
        "username": current_user['username'],
        "address": current_user['address'],
        "tripCount": current_user['tripCount'],
    }
    return {
        "data": newUser,
        "message": "Retrieved user"
    }, 200