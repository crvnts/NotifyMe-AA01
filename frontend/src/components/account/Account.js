import React, { useState, useEffect } from "react";
import { Avatar, Card, Space, Typography, Timeline } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import "./Account.css";
import skyline from "../Assets/torontoskyline.jpg";

const { Text, Title } = Typography;

const Account = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    tripCount: 0,
  });

  const [userTrips, setUserTrips] = useState({
    tripList: [],
  });

  useEffect(() => {
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
          //setTripsCount(jsonResponse.data.tripCount); // Update the trip count state
        } else {
          // Handle errors or unauthorized access here
        }
      } catch (error) {
        console.error("Fetching user data failed:", error);
        // Handle error here
      }
    };

    const fetchUserTrips = async () => {
      const authToken = Cookies.get("authToken");
      try {
        const response = await fetch(
          "https://notifyme-aa01-r4ro.onrender.com/api/getTrips",
          {
            method: "GET",
            headers: {
              Authorization: authToken,
            },
          }
        );
        if (response.ok) {
          const jsonResponse = await response.json();
          setUserTrips({ tripList: jsonResponse.data });
        } else {
          throw new Error("Failed to retrieve trip data");
        }
      } catch (error) {
        console.error("Error retrieving user trips:", error);
      }
    };
    const fetchData = async () => {
      await fetchUserData();
      await fetchUserTrips();
    };
    fetchData();
  }, []);

  return (
    <Card
      cover={<img alt="" src={skyline} />}
      className="account-card"
      title="Your Account Info"
      bordered={true}
    >
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
        {/*<Text className="text">User info:</Text>*/}
        {/* Your existing rendering logic for users */}
      </div>
      {/* Debugging section to display raw JSON */}
      <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
        <Space direction="vertical">
          <Text className="data-text">Name: {userData.name}</Text>
          <Text className="data-text">Username: {userData.username}</Text>
          <Text className="data-text">Trips Count: {userData.tripCount}</Text>
          <Text className="data-text">Trip List:</Text>
          <Timeline>
          {userTrips.tripList.map((trip, index) => (
            <Timeline.Item key={index}>
              <p className="trip-text">Date: {trip.date}</p>
              <p className="trip-text">Distance: {trip.distance} km</p>
              <p className="trip-text">Start Address: {`${trip.start_address.street}, ${trip.start_address.city}`}</p>
              <p className="trip-text">Destination Address: {`${trip.dest_address.street}, ${trip.dest_address.city}`}</p>
            </Timeline.Item>
          ))}
        </Timeline>
        </Space>
      </div>
    </Card>
  );
};

export default Account;
