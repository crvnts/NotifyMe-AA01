from src import app
from flask import render_template, request, redirect, flash, url_for, Response, jsonify
from datetime import datetime
from bs4 import BeautifulSoup
import requests

Alert = {
    "route": str,
    "route_description": str
}

Alerts = {
    "num_alerts": int,
    "last_updated_time": str,
    "alerts": [Alert]
}

@app.route("/getAlerts", methods ={'GET'})
def getTTCAlerts():
    alerts_list=[]
    counter = 0
    url = 'https://alerts.ttc.ca/api/alerts/list'
    headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'}
    # Send a GET request to the URL
    try:
        response = requests.get(url, headers= headers).json()
    except Exception as e:
        return {
            "message": "Error connecting to TTC APIs",
            "error": "TTC API DOWN"
        }, 403
    
    try:
        for route in response['routes']:    
            # Iterate through alerts for the current route
            counter+=1
            alert_id = route['route']
            description = route['title']
            newAlert = {
                'route':alert_id,
                'description':description
            }
            alerts_list.append(newAlert)
    except Exception as e:
        return {
            "message":"Error parsing information",
            "error":"Internal error"
        },500
    
    try:
        for route in response['generalCustom']:
            counter+=1
            alert_id =route['routeType']
            description = route['description']
            newAlert = {
                'route':alert_id,
                'description':description
            }
            alerts_list.append(newAlert)
    except Exception as e:
        return {
            "message":"Error parsing information",
            "error":"Internal error"
        },500

    updatedAlerts = {
        'num_alerts':counter,
        'last_updated':response['lastUpdated'],
        'alerts':alerts_list
    }
    return {
        'data':updatedAlerts,
        'message':"Updated TTC Alerts"
    }, 200
