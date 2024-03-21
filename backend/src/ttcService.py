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
            soup = BeautifulSoup(route['description'], 'html.parser')
            cleaned_text = soup.get_text()
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

def filter_df_by_current_hour(df):
    est = pytz.timezone('America/New_York')
    current_datetime = datetime.now(est)
    current_hour = current_datetime.hour  # Get current hour

    start_hour = current_hour - 5
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
        for i in range(0,end_hour):
            filtered_data.append([df_current_day.name,i,df_current_day[i]])  
        return filtered_data

    
    for i in range(max(0, start_hour), min(24, end_hour + 1)):
        filtered_data.append([df_current_day.name,i,df_current_day[i]])  

    return filtered_data

@app.route("/getBusDelayData", methods ={'GET'})
def getBusDelay():
    try:
        average_delays=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/average_delays_bus.csv')
        frequency=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/frequency_data_bus.csv')
        average_delays=filter_df_by_current_hour(average_delays)
        frequency=filter_df_by_current_hour(frequency)
    except Exception as e: 
        return {
            "message":"Error getting data",
            "error": e
        }, 500

    return {
        'average delays': average_delays,
        'frequency': frequency
    }, 200

@app.route("/getSubwayDelayData", methods ={'GET'})
def getSubwayDelay():
    try:
        average_delays=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/average_delays_subway.csv')
        frequency=pd.read_csv('https://raw.githubusercontent.com/rjeong1530/TTC-Data-analysis/main/src/frequency_data_subway.csv')
        average_delays=filter_df_by_current_hour(average_delays)
        frequency=filter_df_by_current_hour(frequency)
    except Exception as e: 
        return {
            "message":"Error getting data",
            "error": e
        }, 500

    return {
        'average delays': average_delays,
        'frequency': frequency
    }, 200