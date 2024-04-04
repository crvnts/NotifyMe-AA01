import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  CarOutlined,
  MessageOutlined,
  NotificationOutlined,
  ScheduleOutlined
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
import "../dashboardv2/Dashboard.css";
import Search from "antd/es/input/Search";
import Account from "./Account";

const { Header, Sider, Content } = Layout;
const userFirstName = "John";
const userLastname = "Doe";

const MyAccount = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [tripsCount, setTripsCount] = useState(0);

  const addTripHandler = () => {
    setTripsCount((prevState) => prevState + 1); // Increment the trips count
  };

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
      default:
        console.log('Unknown key: ', key);
        break;
    }
  };

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
            <Account></Account>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MyAccount;
