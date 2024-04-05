import React, { useState, useEffect, useCallback } from "react";
import { Flex, Layout, Menu, Button, Avatar, Typography, Card, Spin } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ScheduleOutlined,
  UploadOutlined,
  RightSquareOutlined,
  LogoutOutlined,
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
  const [cvLoading, setCVLoading] = useState(false);

  const fetchUserDataFromCookies = () => {
    const userDataString = Cookies.get("userData");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        setTripsCount(userData.tripCount);
      } catch (error) {
        console.error("Error parsing userData from cookies:", error);
        // Handle parsing error (e.g., corrupted cookie data)
      }
    }
  };

  const logoutHandler = () => {
    Cookies.remove("authToken"); // Remove the authToken cookie
    setUserData({ name: "", username: "", tripCount: 0 }); // Reset user data state
    navigate("/login"); // Redirect to the login page
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

  const [matchedHighways, setMatchedHighways] = useState([]);
  const [highwayCongestionData, setHighwayCongestionData] = useState({});

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

        const distance = parseFloat(response.data["Total Distance"]);
        setTotalDistance(distance.toFixed(1));
        setTotalDistance(distance);

        setMatchedHighways(response.data["Matched Highways"] || []);

      } catch (error) {
        console.error("Failed to fetch directions:", error);
        setError("Failed to fetch directions. Please try again.");
        setDirections(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // useEffect hook to listen for changes in transportMode, startAddress, or endAddress
  useEffect(() => {
    fetchUserDataFromCookies();
    if (startAddress && endAddress && transportMode) {
      handleFormSubmit({ startAddress, endAddress, mode: transportMode });
    }

    const fetchUserData = async () => {
      const authToken = Cookies.get("authToken");
      try {
        const response = await fetch(
          "https://notifyme-aa01-r4ro.onrender.com/api/getUser",
          {
            method: "GET",
            headers: {
              Authorization: authToken, // Assuming the token is a Bearer token
            },
          }
        );

        if (response.ok) {
          const jsonResponse = await response.json();
          setUserData(jsonResponse.data); // Store the user data in state
          setTripsCount(jsonResponse.data.tripCount); // Update the trip count state

          // Serialize userData to a string and store in a cookie
          Cookies.set("userData", JSON.stringify(jsonResponse.data), {
            expires: 7,
          }); // Expires in 7 days
        } else {
          // Handle errors or unauthorized access here
        }
      } catch (error) {
        console.error("Fetching user data failed:", error);
        // Handle error here
      }
    };

    fetchUserData();
  }, [transportMode, startAddress, endAddress, handleFormSubmit]);

  useEffect(() => {
    const fetchCongestionData = async () => {
      const congestionData = {};

      for (const highway of matchedHighways) {
        try {
          const response = await fetch(
            "http://humpback-smart-gently.ngrok-free.app/getHighwayCongestion",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ highway }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            congestionData[highway] = data;
          } else {
            throw new Error("Network response was not ok.");
          }
        } catch (error) {
          console.error(
            `Failed to fetch congestion data for highway ${highway}:`,
            error
          );
          congestionData[highway] = { error: "Failed to fetch data" };
        }
      }

      setHighwayCongestionData(congestionData);
    };

    if (matchedHighways.length > 0) {
      fetchCongestionData();
    }
  }, [matchedHighways]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minHeight: "100vh" }}
      >
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
          <Flex align="center" justify="space-between">
            <Typography.Title style={{ color: "whitesmoke" }} level={2}>
              Welcome back, {userData.name}
            </Typography.Title>
            <Flex align="center" gap="3rem">
              <Flex align="center" gap="8px">
                <Button
                  onClick={logoutHandler}
                  type="primary"
                  icon={<LogoutOutlined />}
                  className="logout-button"
                >
                  Log out
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Header>
        <Content className="trip-container">
          <Card className="search-card">
            <SearchForm
              onFormSubmit={handleFormSubmit}
              setStartAddress={setStartAddress}
              setEndAddress={setEndAddress}
              totalDistance={totalDistance}
            />
          </Card>
          <div style={{ height: "90%", width: "90%", flexShrink: "0" }}>
            <InitMap
              startAddress={startAddress}
              endAddress={endAddress}
              travelMode={transportMode}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card title="Directions" bordered>
            {isLoading ? (
              <Spin/>
            ) : (
              <PlannedDisplay key={directionsKey} directions={directions} />
            )}
            </Card>
            {matchedHighways.length > 0 && (
              <div>
                <Card title="Traffic Information" loading={cvLoading}>
                  {Object.entries(highwayCongestionData).map(([highway, data]) => {

                    const congestionPercentage = data.data && data.data[0] ? data.data[0].toFixed(2) : "0";
                    const confidence = data.data && data.data[1] ? (data.data[1] * 100).toFixed(2) : data.message;

                    return (
                      <div key={highway} style={{ marginBottom: "15px" }}>
                        <p>
                          <b>Highway: {highway}</b>
                        </p>
                        <p>Average Congestion: {congestionPercentage}%</p>
                        <p>Confidence: {confidence}</p>
                        <p>
                          General Delay:{" "}
                          {data && data.data && data.data[0] !== undefined
                            ? data.data[0] > 45
                              ? "Significant delays (~15min)"
                              : data.data[0] >= 30
                              ? "Expect some delays (~5 min)"
                              : "No Delays"
                            : "Not available"}
                        </p>
                      </div>
                    );
                  })}
                </Card>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TripPlanner;
