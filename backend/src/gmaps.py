from flask import Flask, request, jsonify
from src import app
import os
import requests

from flask_cors import CORS


@app.route('/geocode_address', methods=['GET'])
def geocode_address():
    print("get_directions endpoint was called")

    address = request.args.get('address')
    api_key = os.environ.get('REACT_APP_GOOGLE_MAPS_API_KEY')  # Consider a more secure way to handle the API key
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": api_key}
    response = requests.get(geocode_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            result = data["results"][0]
            simplified_output = {
                "Formatted Address": result["formatted_address"],
                "Location": f'{result["geometry"]["location"]["lat"]},{result["geometry"]["location"]["lng"]}'
            }
            return jsonify(simplified_output)
        else:
            return jsonify({"Error": "No results found for the given address."}), 404
    else:
        return jsonify({"Error": f"Failed to connect to the API, status code: {response.status_code}"}), response.status_code

@app.route('/api/get_directions', methods=['GET'])
def get_directions():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    mode = request.args.get('mode', 'driving')
    api_key = os.environ.get('REACT_APP_GOOGLE_MAPS_API_KEY')  # Consider a more secure way to handle the API key
    directions_url = "https://maps.googleapis.com/maps/api/directions/json"

    print(f"Origin: {origin}, Destination: {destination}, Mode: {mode}")  # Debug print

    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": api_key
    }
    response = requests.get(directions_url, params=params)
    print(f"API Response: {response.text}")  # Debug print
    
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            route = data["routes"][0]
            leg = route["legs"][0]
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

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test endpoint reached"})

if __name__ == '__main__':
    app.run(debug=True)
