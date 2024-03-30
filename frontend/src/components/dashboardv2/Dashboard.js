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
} from "antd";
import "./Dashboard.css";
import Search from "antd/es/input/Search";
import MainContent from "./MainContent";

const { Header, Sider, Content } = Layout;
const userFirstName = "John";
const userLastname = "Doe";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [tripsCount, setTripsCount] = useState(0);

  const addTripHandler = () => {
    setTripsCount((prevState) => prevState + 1); // Increment the trips count
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minHeight: "100%", overflowY: "auto" }}
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
          <Flex className="main-flex-container">
            <MainContent></MainContent>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
