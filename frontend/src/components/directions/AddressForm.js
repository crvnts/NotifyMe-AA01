import React, { useState } from 'react';


const AddressForm = ({ onFormSubmit }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [mode, setMode] = useState('driving');

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit({ startAddress, endAddress, mode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="startAddress">Start Address:</label>
        <input
          type="text"
          id="startAddress"
          value={startAddress}
          onChange={(e) => setStartAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="endAddress">End Address:</label>
        <input
          type="text"
          id="endAddress"
          value={endAddress}
          onChange={(e) => setEndAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="mode">Mode of Transportation:</label>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="driving">Driving</option>
          <option value="walking">Walking</option>
          <option value="bicycling">Bicycling</option>
          <option value="transit">Transit</option>
        </select>
      </div>
      <button type="submit">Get Directions</button>
    </form>
  );
};

export default AddressForm;
