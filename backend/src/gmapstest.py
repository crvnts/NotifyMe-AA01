import requests

def geocode_address(address, api_key):
    """Geocode an address using the Google Maps Geocoding API."""
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": api_key}
    
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()  # Returns the JSON response from the API
    else:
        return None

if __name__ == "__main__":
    api_key = "AIzaSyDmEuVaPGPqgPpn0cttgHZXe2WTbKDTnxM"  # Replace with your actual API key
    address = "350 Victoria St, Toronto, ON M5B 2K3"
    result = geocode_address(address, api_key)
    
    if result:
        print(result)  # Print the geocoding result
    else:
        print("Failed to geocode address")
