from src import app
from flask import render_template, request, redirect, flash, url_for, Response, jsonify
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
import pandas as pd
import pytz

Alert = {
    "route": str,
    "route_description": str
}

Alerts = {
    "num_alerts": int,
    "last_updated_time": str,
    "alerts": [Alert]
}

def filter_df_by_current_hour(df):
    est = pytz.timezone('America/New_York')
    current_datetime = datetime.now(est)
    current_hour =current_datetime.hour # Get current hour

    start_hour = current_hour - 6
    end_hour = current_hour + 6

    filtered_data = []
    # Extract data for current day
    current_day = current_datetime.strftime("%A")
    
    df_current_day = df[current_day]
    if start_hour < 0:
        # Adjust start hour to account for previous day
        start_hour += 24

        # Get the name of the previous day
        previous_day = (current_datetime - timedelta(days=1)).strftime("%A")
        df_prev_day = df[previous_day]
        for i in range(start_hour, 24):
            filtered_data.append([df_prev_day.name,i,df_prev_day[i]])  
        for i in range(0,end_hour+1):
            filtered_data.append([df_current_day.name,i,df_current_day[i]])  
        return filtered_data

    
    for i in range(max(0, start_hour), min(24, end_hour + 1)):
        filtered_data.append([df_current_day.name,i,df_current_day[i]])  
    if end_hour > 23:
        next_day = (current_datetime + timedelta(days=1)).strftime("%A")
        df_next_day = df[next_day]
        for i in range((0),max(1,end_hour%23)):
            filtered_data.append([df_next_day.name,i,df_next_day[i]])  

    return filtered_data

def modify_values(filtered_data):
    # Calculate the total for each column
    total = sum(item[2] for item in filtered_data)
    
    # Modify the values in the filtered data list
    for item in filtered_data:
        item[2] /= (total/100)
    
    return filtered_data

@app.route("/api/getTTCAlerts", methods ={'GET'})
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
            if not description == "WEBSITE":
                alerts_list.append(newAlert)
    except Exception as e:
        return {
            "message":"Error parsing information",
            "error":"Internal error"
        },500
    try:
        for route in response['siteWideCustom']:    
            # Iterate through alerts for the current route
            counter+=1
            alert_id = route['route']
            soup = BeautifulSoup(route['description'], 'html.parser')
            cleaned_text = soup.get_text()
            index = cleaned_text.find("See ")
            if index != -1:
                description = cleaned_text[:index]
            else: 
                description = cleaned_text
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
            soup = BeautifulSoup(route['description'], 'html.parser')
            cleaned_text = soup.get_text()
            index = cleaned_text.find("See ")
            if index != -1:
                description = cleaned_text[:index]
            else: 
                description = cleaned_text
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

@app.route("/api/getGoAlerts", methods ={'GET'})
def getGoAlerts():
    alerts_list = []
    url = "http://api.openmetrolinx.com/OpenDataAPI/api/V1/ServiceUpdate/ServiceAlert/All?key="+app.config['GO_KEY']
    try:
        response = requests.get(url).json()
    except Exception as e:
        return {
            "message": "Error connecting to TTC APIs",
            "error": "TTC API DOWN"
        }, 403
    counter = 0
    try:
        for route in response['Messages']["Message"]:    
            # Iterate through alerts for the current route
            if route['Category'] != 'Amenity': 
                alert_id = route['Lines']
                description = route['BodyEnglish']
                words = ["Click ", "Check ", "Note: ", "Ways ", "We will ", "Before you " ]
                for word in words:
                    index = description.find(word)
                    if index != -1:
                        description = description[:index]
                if len(description) < 250:
                    newAlert = {
                        'route':alert_id,
                        'description':description
                    }
                    counter+=1
                    alerts_list.append(newAlert)
    except Exception as e:
        return {
            "message":"Error parsing information",
            "error":"Internal error"
        },500
    
    updatedAlerts = {
        'num_alerts':counter,
        'last_updated':response['Metadata']['TimeStamp'],
        'alerts':alerts_list
    }
    return {
        'data':updatedAlerts,
        'message':"Updated Go Alerts"
    }, 200

@app.route("/api/getBusDelayData", methods ={'GET'})
def getBusDelay():
    try:
        average_delays=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/average_delays_bus.csv')
        average_delays=filter_df_by_current_hour(average_delays)
    except Exception as e: 
        return {
            "message":"Error getting data",
            "error": e
        }, 500

    return {
        'average delays': average_delays,
    }, 200

@app.route("/api/getSubwayDelayData", methods ={'GET'})
def getSubwayDelay():
    try:
        average_delays=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/average_delays_subway.csv')
        average_delays=filter_df_by_current_hour(average_delays)
    except Exception as e: 
        return {
            "message":"Error getting data",
            "error": e
        }, 500

    return {
        'average delays': average_delays,
    }, 200