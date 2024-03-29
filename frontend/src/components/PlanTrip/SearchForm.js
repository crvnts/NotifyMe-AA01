import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const SearchForm = ({ onFormSubmit, setStartAddress: updateStartAddress, setEndAddress: updateEndAddress }) => {
  const [localStartAddress, setLocalStartAddress] = useState('');
  const [localEndAddress, setLocalEndAddress] = useState('');
  const [mode, setMode] = useState('driving');

  const handleSelectStartAddress = address => {
    setLocalStartAddress(address);
    updateStartAddress(address); // Update parent component's state
  };

  const handleSelectEndAddress = address => {
    setLocalEndAddress(address);
    updateEndAddress(address); // Update parent component's state
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Call the onFormSubmit prop with the local state values
    onFormSubmit({ startAddress: localStartAddress, endAddress: localEndAddress, mode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="startAddress">Start Address:</label>
        <PlacesAutocomplete value={localStartAddress} onChange={setLocalStartAddress} onSelect={handleSelectStartAddress}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Start Address...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  return (
                    <div {...getSuggestionItemProps(suggestion, { className })}>
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <div>
        <label htmlFor="endAddress">End Address:</label>
        <PlacesAutocomplete value={localEndAddress} onChange={setLocalEndAddress} onSelect={handleSelectEndAddress}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search End Address...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  return (
                    <div {...getSuggestionItemProps(suggestion, { className })}>
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <div>
        <label htmlFor="mode">Mode of Transportation:</label>
        <select id="mode" value={mode} onChange={e => setMode(e.target.value)}>
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

export default SearchForm;
