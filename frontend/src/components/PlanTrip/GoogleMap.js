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
      apiKey={process.env.api_key} // Ensure you're using the correct environment variable syntax
      libraries={["marker", "routes"]}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          defaultZoom={12}
          defaultCenter={position}
          mapId={process.env.map_id} // Ensure you're using the correct environment variable syntax
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

function Directions({ startAddress, endAddress, transportMode }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  useEffect(() => {
    if (!routesLibrary || !map || !startAddress || !endAddress || !transportMode) return;

    const directionsService = new routesLibrary.DirectionsService();
    const directionsRenderer = new routesLibrary.DirectionsRenderer({ map });

    directionsService.route({
      origin: startAddress,
      destination: endAddress,
      travelMode: "DRIVING", //transportMode not sure why this isn't working, could be the way im sending transportMode from SearchForm
      provideRouteAlternatives: true,
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        console.error(`Failed to fetch directions: ${status}`);
      }
    });

    // Cleanup function
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [startAddress, endAddress, transportMode, map, routesLibrary]); // React to changes in addresses or map library

  return null; // You might not need to return anything from this component
}

export default InitMap;
