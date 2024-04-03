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

const position = { lat: 43.656866955079, lng: -79.3764393609781 };

const InitMap = ({ startAddress, endAddress, travelMode }) => {
  const [open, setOpen] = useState(false);
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
              <p>Let's go</p>
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
