import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { Spin } from "antd";

const position = { lat: 43.656866955079, lng: -79.3764393609781 };

const InitMap = ({ startAddress, endAddress, travelMode }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  travelMode = travelMode.toUpperCase(); //forces uppercase for map visualization

  // Fetch user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false); // Set loading false once position obtained
        },
        (error) => {
          console.error("Error fetching geolocation: ", error);
          setLoading(false);
          // Handle error or set a fallback position
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Set a fallback position if needed
    }
  }, []);

  if (loading || !position) { // Check for !position to ensure we have a position before rendering the map
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} />;
  }

  return (
    <APIProvider
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} // Ensure you're using the correct environment variable syntax
      libraries={["marker", "routes"]}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          defaultZoom={12}
          defaultCenter={position}
          mapId={process.env.REACT_APP_NEXT_PUBLIC_MAP_ID} // Ensure you're using the correct environment variable syntax
          fullscreenControl={false}
        >
          <Directions startAddress={startAddress} endAddress={endAddress} travelMode={travelMode} />

          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin background={"red"} borderColor={"blue"} glyphColor={"purple"} />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
              <p>You are here</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

function Directions({ startAddress, endAddress, travelMode }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  useEffect(() => {
    if (!routesLibrary || !map || !startAddress || !endAddress || !travelMode) return;

    const directionsService = new routesLibrary.DirectionsService();
    const directionsRenderer = new routesLibrary.DirectionsRenderer({ map });

    directionsService.route({
      origin: startAddress,
      destination: endAddress,
      travelMode: travelMode, // Use the provided travelMode
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        console.error(`Failed to fetch directions: ${status}`);
      }
    });

    return () => directionsRenderer.setMap(null); // Cleanup
  }, [startAddress, endAddress, travelMode, map, routesLibrary]); // React to changes in travelMode
}

export default InitMap;