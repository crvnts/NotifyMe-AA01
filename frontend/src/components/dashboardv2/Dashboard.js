import React, { useState, useEffect } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  CarOutlined,
  MessageOutlined,
  NotificationOutlined,
  ScheduleOutlined,
  RightSquareOutlined,
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
} from "antd";
import Cookies from "js-cookie";
import "./Dashboard.css";
import Search from "antd/es/input/Search";
import MainContent from "./MainContent";

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
    const fetchUserData = async () => {
      const authToken = Cookies.get("authToken");
      try {
        const response = await fetch(
          "https://notifyme-aa01-r4ro.onrender.com/api/getUser",
          {
            method: "GET",
            headers: {
              Authorization: authToken // Assuming the token is a Bearer token
            },
          }
        );

        if (response.ok) {
          const jsonResponse = await response.json();
          setUserData(jsonResponse.data); // Store the user data in state
          setTripsCount(jsonResponse.data.tripCount); // Update the trip count state
        } else {
          // Handle errors or unauthorized access here
        }
      } catch (error) {
        console.error("Fetching user data failed:", error);
        // Handle error here
      }
    };

    fetchUserData();
  }, []);

  let navigate = useNavigate();
  const navigateTo = ({key}) => {
    switch(key) {
      case "1":
        navigate('/MyAccount');
        break;
      case "2":
        navigate('/MyTrips');
        break;
      case "3":
        navigate('/TripPlanner');
        break;
      case "4":
        navigate('/Feedback');
        break;
      case "5":
        navigate('/dashboard');
        break;
      default:
        console.log('Unknown key: ', key);
        break;
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minHeight: "100%", overflowY: "auto"}}
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
          //defaultSelectedKeys={["1"]}
          onClick={navigateTo}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "My Account",
            },
            {
              key: "2",
              icon: <CarOutlined />,
              label: "My Trips",
            },
            {
              key: "3",
              icon: <ScheduleOutlined />,
              label: "Plan a Trip",
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: "Feedback",
            },
            {
              key: "5",
              icon: <RightSquareOutlined />,
              label: "Dashboard",
            }
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
              <Search placeholder="Search Dashboard" allowClear></Search>

              <Flex align="center" gap="8px">
                <MessageOutlined className="header-icon"></MessageOutlined>
                <NotificationOutlined className="header-icon"></NotificationOutlined>
              </Flex>
            </Flex>
          </Flex>
        </Header>
        <Content>
          <Flex className="main-flex-container">
            <MainContent></MainContent>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
