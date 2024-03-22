import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const InitMap = () => {
  const position = { lat: 43.656866955079, lng: -79.3764393609781 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider
      apiKey={"process.env.GOOGLE_MAPS_API_KEY"}
      libraries={["marker"]}
    >
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          defaultZoom={12}
          defaultCenter={position}
          mapId={"process.env.NEXT_PUBLIC_MAP_ID"}
        >
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin
              background={"red"}
              borderColor={"blue"}
              glyphColor={"purple"}
            />
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

export default InitMap;
