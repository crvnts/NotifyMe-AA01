import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Typography, Card } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import "./TripPlanner.css";
import InitMap from "./GoogleMap";
import PlannedDisplay from "./PlannedDisplay";
import SearchForm from "./SearchForm";
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const userFirstName = "John";
const userLastname = "Doe";

const TripPlanner = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [tripsCount, setTripsCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startAddress, setStartAddress] = useState(""); 
  const [endAddress, setEndAddress] = useState(""); 
  const [transportMode, setTransportMode] = useState("DRIVING"); // Default mode


  //For Directions
  const [directions, setDirections] = useState(null);
  const [directionsKey, setDirectionsKey] = useState(Date.now());
  

  const addTripHandler = () => {
    setTripsCount(prevState => prevState + 1); // Increment the trips count
  };

  const handleFormSubmit = async ({ startAddress, endAddress, mode }) => {
    setTransportMode(mode);
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/get_directions`, {
        params: { origin: startAddress, destination: endAddress, mode } // mode is now used in the API call
      });
  
      setDirections(response.data);
      setDirectionsKey(Date.now());
    } catch (error) {
      console.error('Failed to fetch directions:', error);
      setError('Failed to fetch directions. Please try again.');
      setDirections(null);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to listen for changes in transportMode, startAddress, or endAddress
  useEffect(() => {
    if (startAddress && endAddress && transportMode) {
      handleFormSubmit({ startAddress, endAddress, mode: transportMode });
    }
  }, [transportMode, startAddress, endAddress]);

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
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
          {!collapsed && (
            <div>
              <Typography.Title level={5} style={{ color: "white", margin: "16px 0" }}>
                {userFirstName} {userLastname}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ color: "white", marginLeft: "20px" }}>
                Trips Made: {tripsCount}
              </Typography.Text>
              <Button onClick={addTripHandler} style={{ margin: "16px 24px" }}>Add Trip</Button>
            </div>
          )}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={[
            { key: "1", icon: <UserOutlined />, label: "My Account" },
            { key: "2", icon: <UserOutlined />, label: "My Trips" },
            { key: "3", icon: <UserOutlined />, label: "Plan a Trip" },
            { key: "4", icon: <UserOutlined />, label: "Feedback" },
          ]} 
        />
      </Sider>
      <Layout>
        <Header>
          <Typography.Title style={{ color: "whitesmoke" }} level={2}>
            Welcome back, {userFirstName}
          </Typography.Title>
        </Header>
        <Content>
          <Card className="search-card">
          <SearchForm
            onFormSubmit={handleFormSubmit}
            setStartAddress={setStartAddress}
            setEndAddress={setEndAddress}
          />
          </Card>
          <div style={{ height: "90%", width: "90%" }}>
            <InitMap startAddress={startAddress} endAddress={endAddress} travelMode={transportMode} />
          </div>
          {isLoading ? (
            <p>Loading directions...</p>
          ) : (
            <PlannedDisplay key={directionsKey} directions={directions} />
          )}
          
        </Content>
      </Layout>
    </Layout>
  );
};

export default TripPlanner;