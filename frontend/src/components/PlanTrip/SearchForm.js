import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, Input, Radio, Button } from 'antd';


const SearchForm = ({ onFormSubmit, setStartAddress: updateStartAddress, setEndAddress: updateEndAddress }) => {
  const [localStartAddress, setLocalStartAddress] = useState('');
  const [localEndAddress, setLocalEndAddress] = useState('');
  const [transportMode, setTransportMode] = useState('');

  const handleSelectStartAddress = address => {
    setLocalStartAddress(address);
    updateStartAddress(address); // Update parent component's state
  };

  const handleSelectEndAddress = address => {
    setLocalEndAddress(address);
    updateEndAddress(address); // Update parent component's state
    //submitForm(); // Submit form right after user enters end address
  };

  const submitForm = () => {
    onFormSubmit({ startAddress: localStartAddress, endAddress: localEndAddress, transportMode });
  }

  const handleSubmit = event => {
    event.preventDefault();
    // Call the onFormSubmit prop with the local state values
    submitForm();
  };

  // Handler for onChange event
  const handleChange = e => {
    // Set the mode to the value of the selected radio button
    setTransportMode(e.target.value);
    submitForm();
  };

  const [form] = Form.useForm();
  const formLayout = useState('horizontal');

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;
  return (
    <Form 
      {...formItemLayout}
      layout = {formLayout}
      form = {form}
      initialValues={{
        layout: formLayout
      }}
      onFinish={handleSubmit}
      style={{
        maxWidth: formLayout === 'inline' ? 'none': 600,
      }}>
      <div>
        <label htmlFor="startAddress" style={{fontFamily: 'Zen Maru Gothic'}}>Start Address:</label>
        <PlacesAutocomplete value={localStartAddress} onChange={setLocalStartAddress} onSelect={handleSelectStartAddress}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: 'Search Start Address...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const style = suggestion.active 
                  ? {backgroundColor: "#d7d7d9", cursor: "pointer"}
                  : {backgroundColor: "#ffffff", cursor: "pointer"}; 
                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <div>
        <label htmlFor="endAddress" style={{fontFamily: 'Zen Maru Gothic'}}>End Address:</label>
        <PlacesAutocomplete value={localEndAddress} onChange={setLocalEndAddress} onSelect={handleSelectEndAddress}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: 'Search End Address...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const style = suggestion.active 
                  ? {backgroundColor: "#d7d7d9", cursor: "pointer"}
                  : {backgroundColor: "#ffffff", cursor: "pointer"}; 
                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <div>
        <label htmlFor="mode" style={{fontFamily: 'Zen Maru Gothic'}}>Mode of Transportation:</label>
        <Radio.Group 
          //id="mode" 
          value={transportMode} 
          optionType='button' 
          buttonStyle='solid' 
          onChange={handleChange}>
          <Radio value={"DRIVING"}>Driving</Radio>
          <Radio value={"WALKING"}>Walking</Radio>
          <Radio value={"BICYCLING"}>Bicycling</Radio>
          <Radio value={"TRANSIT"}>Transit</Radio>
        </Radio.Group>
      </div>
    </Form>
  );
};

export default SearchForm;
