from src import app
from flask import render_template, request, redirect, flash, url_for, Response
from bson import ObjectId, json_util
import json

from src import db
from datetime import datetime

        
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
        "password": password,
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
    
    