from src import app
from flask import render_template, request, redirect, flash, url_for, Response
from bson import ObjectId, json_util
import json
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
        #return Response(json.loads(json_util.dumps(user)),status=201)
    except Exception as e:
        print("error", e)
    
    if (check_password(password, user['password'])):
        return Response("Logged into " + user['username'], status =201 )
    