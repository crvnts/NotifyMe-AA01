from src import app, jwtokenUtil
from flask import render_template, request, redirect, flash, url_for, Response, jsonify
from bson import ObjectId, json_util
import json, jwt
import bcrypt
from src import db
from datetime import datetime

def get_hashed_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())

def check_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))   

@app.route("/register", methods ={'POST'})
def insert_user():
    request_data = request.get_json()
    if request.method == "POST":
        try:
            name = request_data['name']
            email = request_data['email']
            username = request_data['username']
            password = request_data['password']
            street = request_data['street']
            city = request_data['city']
            province = request_data['province']
            postal = request_data['postal']
        except Exception as e:
            return {
                "error": "Missing field data",
                "message": str(e)
            }, 500     
    newUser ={
        "name": name,       
        "email": email,
        "username": username,
        "password": get_hashed_password(password).decode('utf-8'),
        "address": {
            "street":street,
            "city":city,
            "province":province,
            "postal":postal
        },
        "tripCount": 0
    }
    if db.users.find_one({"username":username}):
        return {
            "error":"Username is already taken"
        }, 400
    if db.users.find_one({"email":email}):
        return {
            "error":"Email is already used"
        }, 400
    try: 
        db.users.insert_one(newUser)
        return Response("User added successfully", status = 201)
    except Exception as e:
        return {
            "error": "Something went wrong",
            "message": str(e)
        }, 500
    
@app.route("/login",methods = {'POST'})
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
            }, 500
    
    try:
        user = db.users.find_one({"username":username})
    except Exception as e:
        return {
            "error": "Unable to find user",
            "message": str(e)
        }, 500
    
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
            }
        except Exception as e:
            return {
                "error": "Error fetching auth token",
                "message": str(e)
            }, 500
        
    return {
        "message": "Error fetching auth token!, invalid email or password",
        "data": None,
        "error": "Unauthorized"
    }, 404

@app.route("/authTest",methods = {'POST'})
@jwtokenUtil.token_required
def authTest(current_user):
    return jsonify(current_user['username'])

@app.route("/userAddress",methods ={'GET'})
@jwtokenUtil.token_required
def userAddress(current_user):
    return jsonify(current_user['address'])

@app.route("/addTripCounter",methods ={'POST'})
@jwtokenUtil.token_required
def addTripCounter(current_user):
    newCounter = current_user['tripCount']+1
    try:
        user = db.users.update_one({"username":current_user['username']},{"$set":{"tripCount":newCounter}})
        return {
            "message": "Updated user trip count",
            "data": newCounter,
        }
    except Exception as e:
        return {
            "error": "Unable to update trip count",
            "message": str(e)
        }, 500
    