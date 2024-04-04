from flask import Flask, request, jsonify
from src import app
import os
import requests
import re

from flask_cors import CORS

#Highway data for cv trigger
highway_data = {
    "401": r"\b401\b",
    "403": r"\b403\b",
    "404": r"\b404\b",
    "405": r"\b405\b",
    "410": r"\b410\b",
    "427": r"\b427\b",
    "QEW": r"\bQEW\b",
    "DVP": r"\bDVP\b",
    # Combine patterns for 'GEW' to match 'GEW', 'Gardiner Expressway', or 'Gardiner Expy E'
    "GEW": r"\bGEW\b|Gardiner Expressway|Gardiner Expy E"
}


@app.route('/api/get_directions', methods=['GET'])
def get_directions():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    mode = request.args.get('mode')
    api_key = os.environ.get('REACT_APP_GOOGLE_MAPS_API_KEY')  # Change this API key method later
    directions_url = "https://maps.googleapis.com/maps/api/directions/json"

    print(f"Origin: {origin}, Destination: {destination}, Mode: {mode}")  # Debug print

    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": api_key
    }
    response = requests.get(directions_url, params=params)
    
    matched_highways = set()
    
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            route = data["routes"][0]
            leg = route["legs"][0]
            
            for step in leg["steps"]:
                instruction = step["html_instructions"]
                for code, pattern in highway_data.items():
                    # Use re.search to find the pattern in the instruction
                    if re.search(pattern, instruction, re.IGNORECASE):
                        matched_highways.add(code)
                        
            # Print matched highways for now
            if matched_highways:
                print(f"Matched Highways: {list(matched_highways)}")
            
            
            directions_summary = {
                "Mode of Transportation": mode.capitalize(),
                "Start Address": leg["start_address"],
                "End Address": leg["end_address"],
                "Total Distance": leg["distance"]["text"],
                "Total Duration": leg["duration"]["text"],
                "Steps": [step["html_instructions"] for step in leg["steps"]]
            }
            return jsonify(directions_summary)
        else:
            print(f"API returned status {data['status']}: {data}")
            return jsonify({"Error": "No directions found for the given locations and mode of transport."}), 404
    else:
        return jsonify({"Error": f"Failed to connect to the API, status code: {response.status_code}"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
