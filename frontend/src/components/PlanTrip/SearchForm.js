import React, { useState, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { Form, Input, Radio, Button } from "antd";
import Cookies from "js-cookie";

const SearchForm = ({
  onFormSubmit,
  onAddTrip,
  setStartAddress: updateStartAddress,
  setEndAddress: updateEndAddress,
}) => {
  const [localStartAddress, setLocalStartAddress] = useState("");
  const [localEndAddress, setLocalEndAddress] = useState("");
  const [transportMode, setTransportMode] = useState("driving");
  const [totalDistance, setTotalDistance] = useState("");

  const handleSelectStartAddress = (address) => {
    setLocalStartAddress(address);
    updateStartAddress(address); // Update parent component's state
  };

  const handleSelectEndAddress = (address) => {
    setLocalEndAddress(address);
    updateEndAddress(address); // Update parent component's state
    //submitForm(); // Submit form right after user enters end address
  };

  //Has the total distance set here.
  const submitForm = async () => {
    const data = await onFormSubmit({
      startAddress: localStartAddress,
      endAddress: localEndAddress,
      mode: transportMode,
    });

    if (data && data["Total Distance"]) {
      setTotalDistance(data["Total Distance"]);
    }
  };

  //Ddont think we need this anymore. but we need the cookies get
  const addTrip = async () => {
    const authToken = Cookies.get("authToken");

    const tripData = {
      startAddress: localStartAddress,
      endAddress: localEndAddress,
      distance: totalDistance,
    };

    try {
      const response = await fetch(
        "https://notifyme-aa01-r4ro.onrender.com/api/addTrips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Including the authToken in the Authorization header
            Authorization: authToken,
          },
          body: JSON.stringify(tripData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add trip");
      }

      const responseData = await response.json();
      console.log("Trip added successfully:", responseData);
    } catch (error) {
      console.error("Error making POST request to add trip:", error);
    }
  };

  // useEffect to submit the form when transportMode changes
  useEffect(() => {
    if (localStartAddress && localEndAddress && transportMode) {
      submitForm();
    }
  }, [transportMode, localStartAddress, localEndAddress]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the onFormSubmit prop with the local state values
    submitForm();
  };

  // Handler for onChange event
  const handleChange = (e) => {
    const modeCH = e.target.value;
    setTransportMode(modeCH);
  };

  const [form] = Form.useForm();
  const formLayout = "horizontal";

  const formItemLayout =
    formLayout === "horizontal"
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
      layout={formLayout}
      form={form}
      initialValues={{
        layout: formLayout,
      }}
      onFinish={handleSubmit}
      style={{
        maxWidth: formLayout === "inline" ? "none" : 600,
      }}
    >
      <div>
        <label htmlFor="startAddress" style={{ fontFamily: "Zen Maru Gothic" }}>
          Start Address:
        </label>
        <PlacesAutocomplete
          value={localStartAddress}
          onChange={setLocalStartAddress}
          onSelect={handleSelectStartAddress}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: "Search Start Address...",
                  className: "location-search-input",
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: "#d7d7d9", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
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
        <label htmlFor="endAddress" style={{ fontFamily: "Zen Maru Gothic" }}>
          End Address:
        </label>
        <PlacesAutocomplete
          value={localEndAddress}
          onChange={setLocalEndAddress}
          onSelect={handleSelectEndAddress}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: "Search End Address...",
                  className: "location-search-input",
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: "#d7d7d9", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
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
      <div style={{ marginTop: "1%", marginBottom: "1%" }}>
        <label htmlFor="mode" style={{ fontFamily: "Zen Maru Gothic" }}>
          Mode of Transportation:
        </label>
        <Radio.Group
          id="mode"
          value={transportMode}
          optionType="button"
          buttonStyle="solid"
          onChange={handleChange}
        >
          <Radio value={"driving"}>Driving</Radio>
          <Radio value={"walking"}>Walking</Radio>
          <Radio value={"bicycling"}>Bicycling</Radio>
          <Radio value={"transit"}>Transit</Radio>
        </Radio.Group>
      </div>
      <Button type="primary" onClick={submitForm}>
        Get Directions
      </Button>
      <Button type="primary" onClick={onAddTrip} style={{ marginLeft: "1%" }}>
        Save Trip
      </Button>
    </Form>
  );
};

export default SearchForm;
