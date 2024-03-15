import React, { useState } from 'react';
import AddressForm from './AddressForm'; // Ensure this path is correct
import DirectionsDisplay from './DirectionsDisplay'; // Ensure this path is correct
import MapDisplay from './MapDisplay'; // Ensure this path is correct
import axios from 'axios';

const DirectionsApp = () => {
  const [directions, setDirections] = useState(null);
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async ({ startAddress, endAddress, mode }) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/get_directions`, {
        params: { origin: startAddress, destination: endAddress, mode }
      });
      
      console.log(response.data)
      setDirections(response.data);

      const steps = response.data.Steps;
      const extractedPath = steps.flatMap(step => {
        const match = step.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
        return match ? [[parseFloat(match[1]), parseFloat(match[2])]] : [];
      });
      
      setPath(extractedPath);
    } catch (error) {
        console.error('Failed to fetch directions:', error);
        setError('Failed to fetch directions. Please try again.');
        // Clear directions and path state on error to avoid displaying outdated information
        setDirections(null);
        setPath([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AddressForm onFormSubmit={handleFormSubmit} />
      {isLoading && <div>Loading directions...</div>}
      {error && <div className="error-message">{error}</div>}
      <DirectionsDisplay directions={directions} />
      <MapDisplay path={path} />
    </div>
  );
};

export default DirectionsApp;
