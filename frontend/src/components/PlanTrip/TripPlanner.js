import React, { useState, useEffect, useCallback } from "react";
import { Layout, Menu, Button, Avatar, Typography, Card } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ScheduleOutlined,
  UploadOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import "./TripPlanner.css";
import InitMap from "./GoogleMap";
import PlannedDisplay from "./PlannedDisplay";
import SearchForm from "./SearchForm";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const TripPlanner = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [tripsCount, setTripsCount] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [transportMode, setTransportMode] = useState(""); // Default mode
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    tripCount: 0,
  });

  const fetchUserDataFromCookies = () => {
    const userDataString = Cookies.get("userData");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      } catch (error) {
        console.error("Error parsing userData from cookies:", error);
        // Handle parsing error (e.g., corrupted cookie data)
      }
    }
  };

  let navigate = useNavigate();
  const navigateTo = ({ key }) => {
    switch (key) {
      case "1":
        navigate("/MyAccount");
        break;
      case "2":
        navigate("/TripPlanner");
        break;
      case "3":
        navigate("/Feedback");
        break;
      case "4":
        navigate("/dashboard");
        break;
      default:
        console.log("Unknown key: ", key);
        break;
    }
  };

  //For Directions
  const [directions, setDirections] = useState(null);
  const [directionsKey, setDirectionsKey] = useState(Date.now());

  const [totalDistance, setTotalDistance] = useState("");

  const handleFormSubmit = useCallback(
    async ({ startAddress, endAddress, mode }) => {
      setTransportMode(mode);
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://notifyme-aa01-r4ro.onrender.com/api/get_directions`,
          {
            params: { origin: startAddress, destination: endAddress, mode }, // mode is now used in the API call
          }
        );

        setDirections(response.data);
        setDirectionsKey(Date.now());

        setTotalDistance(response.data["Total Distance"]);
      } catch (error) {
        console.error("Failed to fetch directions:", error);
        setError("Failed to fetch directions. Please try again.");
        setDirections(null);
        setTotalDistance("");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //THis is the code to add trip
  const handleAddTrip = useCallback(async () => {
    const tripData = {
      startAddress,
      endAddress,
      distance: totalDistance, // Include total distance in the trip data
    };

    console.log("Saving trip data:", tripData);
  }, [startAddress, endAddress, totalDistance]);

  // useEffect hook to listen for changes in transportMode, startAddress, or endAddress
  useEffect(() => {
    fetchUserDataFromCookies();
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
            type="default"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
          />
          {!collapsed && (
            <div>
              <Typography.Title
                level={5}
                style={{ color: "white", margin: "16px 0" }}
              >
                {userData.username}
              </Typography.Title>
              <Typography.Text
                type="secondary"
                style={{ color: "white", marginLeft: "20px" }}
              >
                Trips Made: {userData.tripCount}
              </Typography.Text>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          onClick={navigateTo}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "My Account",
            },
            {
              key: "2",
              icon: <ScheduleOutlined />,
              label: "Plan a Trip",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Feedback",
            },
            {
              key: "4",
              icon: <RightSquareOutlined />,
              label: "Dashboard",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header>
          <Typography.Title style={{ color: "whitesmoke" }} level={2}>
            Welcome back, {userData.name}
          </Typography.Title>
        </Header>
        <Content>
          <Card className="search-card">
            <SearchForm
              onFormSubmit={handleFormSubmit}
              onAddTrip={handleAddTrip}
              setStartAddress={setStartAddress}
              setEndAddress={setEndAddress}
            />
          </Card>
          <div style={{ height: "90%", width: "90%" }}>
            <InitMap
              startAddress={startAddress}
              endAddress={endAddress}
              travelMode={transportMode}
            />
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
