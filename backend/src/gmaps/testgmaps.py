import requests

def geocode_address(address, api_key):
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
            return simplified_output
        else:
            return {"Error": "No results found for the given address."}
    else:
        return {"Error": f"Failed to connect to the API, status code: {response.status_code}"}

def get_directions(origin, destination, api_key, mode='driving'):
    directions_url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": api_key
    }
    response = requests.get(directions_url, params=params)
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
            return directions_summary
        else:
            return {"Error": "No directions found for the given locations and mode of transport."}
    else:
        return {"Error": f"Failed to connect to the API, status code: {response.status_code}"}

if __name__ == "__main__":
    api_key = "AIzaSyDmEuVaPGPqgPpn0cttgHZXe2WTbKDTnxM"  # Replace with your actual API key
    origin = "60 Kensington Ave Units 6-14, Toronto, ON M5T 2K1"  # Replace with your current location
    destination = "350 Victoria St, Toronto, ON M5B 2K3"  # Replace with your destination

    # Ask the user for their preferred mode of transportation
    print("Please choose your mode of transportation from the following options: driving, walking, bicycling, transit")
    mode_of_transport = input("Enter mode of transportation: ").lower()

    if mode_of_transport not in ["driving", "walking", "bicycling", "transit"]:
        print("Invalid mode of transportation. Defaulting to driving.")
        mode_of_transport = "driving"

    # Getting directions based on the user's choice
    directions = get_directions(origin, destination, api_key, mode=mode_of_transport)

    # Print the directions
    if "Error" not in directions:
        print("\nDirections Summary:")
        print(f"Mode: {directions['Mode of Transportation']}")
        print(f"From: {directions['Start Address']}")
        print(f"To: {directions['End Address']}")
        print(f"Total Distance: {directions['Total Distance']}")
        print(f"Total Duration: {directions['Total Duration']}")
        print("\nStep-by-Step Directions:")
        for i, step in enumerate(directions["Steps"], 1):
            print(f"Step {i}: {step}")
    else:
        print(directions["Error"])
