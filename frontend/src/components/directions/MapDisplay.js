import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported for proper map rendering

const MapDisplay = ({ path }) => {
  if (!path || path.length === 0) return null; // Don't render if path is empty or not provided

  const center = path[0]; // Center the map on the first point of the path

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={path} color="blue" /> {/* Render the path as a blue polyline */}
      <Marker position={path[0]} /> {/* Marker for the start of the path */}
      <Marker position={path[path.length - 1]} /> {/* Marker for the end of the path */}
    </MapContainer>
  );
};

export default MapDisplay;
