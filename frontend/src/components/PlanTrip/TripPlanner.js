import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  ConfigProvider,
  Col,
  Divider,
  Row,
  Avatar,
  Typography,
  Flex,
  Card,
} from "antd";

import Search from "antd/es/input/Search";
import "./TripPlanner.css";
import Title from "antd/es/typography/Title";

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import InitMap from "./GoogleMap";
import PlannedDisplay from "./PlannedDisplay";
import AddressForm from "../directions/AddressForm";

import axios from 'axios';

const { Header, Sider, Content } = Layout;
const userFirstName = "John";
const userLastname = "Doe";

const TripPlanner = () => {
  const [searchAdd, setSearchAdd] = useState("");

  const [collapsed, setCollapsed] = useState(true);

  const [tripsCount, setTripsCount] = useState(0);

  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [directions, setDirections] = useState(null);


  const addTripHandler = () => {
    setTripsCount((prevState) => prevState + 1); // Increment the trips count
  };

  const [address, setAddress] = useState("");

  const handleChange = (value) => {
    setAddress(value);
  };

  const handleSelect = (value) => {
    setAddress(value);
  };

  const onSearch = (value) => {
    setSearchAdd(value);
    fetchDirections();
  };

  const fetchDirections = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get_directions`, {
        params: { origin: startAddress, destination: endAddress, mode: 'driving' }
      });
      setDirections(response.data);
    } catch (error) {
      console.error('Failed to fetch directions', error);
    }
  };

  const posiiton = { lat: 43.656866955079, lng: -79.3764393609781 };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Avatar
          size={{
            xs: 24,
            sm: 32,
            md: 40,
            lg: 64,
            xl: 70,
            xxl: 80,
          }}
          icon={<UserOutlined />}
        />
        <div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="collapse-button"
          />

          {!collapsed ? (
            <div>
              {" "}
              <userTitle
                level={5}
                style={{
                  color: "white",
                  fontFamily: "Zen Maru Gothic",
                  margin: "16px 0",
                }}
              >
                {userFirstName} {userLastname}
              </userTitle>
              <dispUserTrips
                type="secondary"
                style={{
                  color: "white",
                  fontFamily: "Zen Maru Gothic",
                  marginLeft: "20px",
                }}
              >
                Trips Made: {tripsCount}
              </dispUserTrips>
              {/* Button to simulate adding a trip - you might replace this with your actual trip-adding logic */}
              <Button
                onClick={addTripHandler}
                style={{ fontFamily: "Zen Maru Gothic", margin: "16px 24px" }}
              >
                Add Trip
              </Button>
            </div>
          ) : (
            false
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ fontFamily: "Zen Maru Gothic" }}
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "My Account",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "My Trips",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Plan a Trip",
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: "Feedback",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header>
          <Flex align="center" justify="space-between">
            <Typography.Title
              style={{
                color: "whitesmoke",
                fontFamily: "Zen Maru Gothic",
              }}
              level={2}
            >
              Welcome back, {userFirstName}
            </Typography.Title>

            <Flex align="center" gap="3rem">
              <Search placeholder="Search Dashboard" allowClear></Search>

              <Flex align="center" gap="8px">
                <MessageOutlined className="header-icon"></MessageOutlined>
                <NotificationOutlined className="header-icon"></NotificationOutlined>
              </Flex>
            </Flex>
          </Flex>
        </Header>
        <Content>
          <Flex className="flex-container">
            <Card className="search-card">
              <Title>Where are you headed?</Title>
              <div>
                <PlacesAutocomplete
                  value={address}
                  onChange={handleChange}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      {/* Obtain search address and plan a route to that address. 
                      Display user's current position, and add option to change starting point. */}
                      <Search
                        allowClear
                        className="location-search-input-box"
                        {...getInputProps({
                          placeholder: "Search places...",
                          className: "location-search-input",
                        })}
                        onSearch={onSearch}
                      />
                      <div>
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const style = suggestion.active
                            ? { backgroundColor: "#d7d7d9", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };

                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, { style })}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </Card>
            {/* Add map here probably */}
            <div style={{ height: "90%", width: "90%" }}>
              <InitMap></InitMap>
            </div>
            <div>
              {/* Add search form, or implement where we get the search into here */}
              <PlannedDisplay directions = {directions} />
            </div>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
export default TripPlanner;