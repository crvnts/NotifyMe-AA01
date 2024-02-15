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
        name = request_data['name']
        email = request_data['email']
        username = request_data['username']
        password = request_data['password']
        street = request_data['street']
        city = request_data['city']
        province = request_data['province']
        postal = request_data['postal']
    
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
        }
}    
    try: 
        db.users.insert_one(newUser)
        return Response("User added successfully", status = 201)
    except Exception as e:
        print("An exception has occurred ::",e)
        return False
    
@app.route("/login",methods = {'POST'})
def login():
    request_data = request.get_json()
    if request.method == "POST":
        username = request_data['username']
        password = request_data['password']
    try:
        user = db.users.find_one({"username":username})
    except Exception as e:
        print("error", e)
    
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
                "error": "Something went wrong",
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
    