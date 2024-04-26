import React, { useState, useEffect } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  CarOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Typography, Flex, Card } from "antd";
import Cookies from "js-cookie";
import "../dashboardv2/Dashboard.css";
import "./Feedback.css";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [tripsCount, setTripsCount] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    tripCount: 0,
  });


  useEffect(() => {
    const fetchUserDataFromCookies = () => {
      const userDataString = Cookies.get("userData");
  
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUserData(userData);
          setTripsCount(userData.tripCount)
        } catch (error) {
          console.error("Error parsing userData from cookies:", error);
          // Handle parsing error (e.g., corrupted cookie data)
        }
      }
    };
    // const fetchUserData = async () => {
    //   const authToken = Cookies.get("authToken");
    //   try {
    //     const response = await fetch(
    //       "https://notifyme-aa01-r4ro.onrender.com/api/getUser",
    //       {
    //         method: "GET",
    //         headers: {
    //           Authorization: authToken, // Assuming the token is a Bearer token
    //         },
    //       }
    //     );

    //     if (response.ok) {
    //       const jsonResponse = await response.json();
    //       setUserData(jsonResponse.data); // Store the user data in state
    //       setTripsCount(jsonResponse.data.tripCount); // Update the trip count state

    //       // Serialize userData to a string and store in a cookie
    //       Cookies.set("userData", JSON.stringify(jsonResponse.data), {
    //         expires: 7,
    //       }); // Expires in 7 days
    //     } else {
    //       // Handle errors or unauthorized access here
    //     }
    //   } catch (error) {
    //     console.error("Fetching user data failed:", error);
    //     // Handle error here
    //   }
    // };

    // fetchUserData();
    fetchUserDataFromCookies();
  }, []);

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

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minHeight: "100vh", overflowY: "auto" }}
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
                {userData.username}
              </userTitle>
              <dispUserTrips
                type="secondary"
                style={{
                  color: "white",
                  fontFamily: "Zen Maru Gothic",
                  marginLeft: "20px",
                }}
              >
                Trips Made: {userData.tripCount}
              </dispUserTrips>
              {/* Button to simulate adding a trip - you might replace this with your actual trip-adding logic */}
            </div>
          ) : (
            false
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ fontFamily: "Zen Maru Gothic" }}
          defaultSelectedKeys={["3"]}
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
            <Typography.Title
              style={{
                color: "whitesmoke",
                fontFamily: "Zen Maru Gothic",
              }}
              level={2}
            >
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
        <Content>
          <Flex className="feedback-container">
            <Card className="feedback-card" title="Contact Us">
              <div>
                Notice an issue? We're open to any and all feedback. Contact us via e-mail <a href="mailto:notifymecap@gmail.com" target="_blank"> here</a>
              </div>
            </Card>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
