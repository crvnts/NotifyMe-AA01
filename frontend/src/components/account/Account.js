import React, { useState, useEffect } from "react";
import { Avatar, Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Account = () => {
  const [users, setUsers] = useState([]);
  const [rawData, setRawData] = useState(''); // State to hold the raw JSON data

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("https://notifyme-aa01-r4ro.onrender.com/api/getUser", {
          method: "GET",
          headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RkYXRhMSJ9.AGx6fEOweG2kPaA9kwgDzt6-FQO0C9l6gvcnUmDlqNM',
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : [data]); // Update this line based on the expected response format
        setRawData(JSON.stringify(data, null, 2)); // Save the raw JSON for debugging
      } catch (error) {
        console.error("Fetching user info failed:", error);
        setRawData(`Error fetching data: ${error}`); // Display error
      }
    };

    getUserInfo();
  }, []); // This effect runs once after the initial render

  return (
    <Card
      title="Your Account Info"
      bordered={true}
      style={{
        width: "100%",
        height: "auto",
      }}
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
        <Text>User info:</Text>
        {/* Your existing rendering logic for users */}
      </div>
      {/* Debugging section to display raw JSON */}
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        <Text strong>Debug JSON:</Text>
        <pre>{rawData}</pre>
      </div>
    </Card>
  );
};

export default Account;
