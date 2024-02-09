import requests

def geocode_address(address, api_key):
    """Geocode an address using the Google Maps Geocoding API and return a simplified result."""
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": api_key}
    
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            # Assuming the first result is the most relevant one
            result = data["results"][0]
            formatted_address = result["formatted_address"]
            latitude = result["geometry"]["location"]["lat"]
            longitude = result["geometry"]["location"]["lng"]
            
            # Creating a simplified output
            simplified_output = {
                "Formatted Address": formatted_address,
                "Latitude": latitude,
                "Longitude": longitude
            }
            return simplified_output
        else:
            return {"Error": "No results found for the given address."}
    else:
        return {"Error": f"Failed to connect to the API, status code: {response.status_code}"}

if __name__ == "__main__":
    api_key = "AIzaSyDmEuVaPGPqgPpn0cttgHZXe2WTbKDTnxM"  # Replace with your actual API key
    address = "350 Victoria St, Toronto, ON M5B 2K3"
    result = geocode_address(address, api_key)
    
    if "Error" not in result:
        print("Geocoding Result:")
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print(result["Error"])
