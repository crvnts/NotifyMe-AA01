import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, ConfigProvider, Col, Divider, Row, Avatar, Typography } from 'antd';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;
const userFirstName = 'John'
const userLastname = 'Doe'
const style = {
  fontFamily: 'Zen Maru Gothic',
  background: '#0092ff',
  padding: '8px 0',
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  const showUserInfoHandler = () => {
    setUserInfoVisible(true);
  }
  const [tripsCount, setTripsCount] = useState(0);
  
  const addTripHandler = () => {
    setTripsCount((prevState)=>prevState+1) // Increment the trips count
  };
  

  return (
    <Layout style={{height:"100vh"}}>
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
        
        <Button 
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {setCollapsed(!collapsed)}}
            style={{
              color:'white',
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <>
          {!collapsed ? <> <userTitle level={5} 
                        style={{color: 'white', fontFamily: 'Zen Maru Gothic', margin: '16px 0'}}>
                        {userFirstName} {userLastname}
                        </userTitle>
                        <dispUserTrips type="secondary"style={{color: 'white', fontFamily:'Zen Maru Gothic', marginLeft: '24px' }}>
                          Trips Made: {tripsCount}</dispUserTrips>
                        {/* Button to simulate adding a trip - you might replace this with your actual trip-adding logic */}
                        <Button onClick={addTripHandler} style={{fontFamily: 'Zen Maru Gothic', margin: '16px 24px' }}>
                          Add Trip</Button>
                        </>
          : false}
          </>
        <Menu
          theme='dark'
          mode="inline"
          style={{fontFamily: 'Zen Maru Gothic'}}
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'My Account',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'My Trips',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Plan a Trip',
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Feedback',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            
          }}
        >
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            //background: colorBgContainer,
            //borderRadius: borderRadiusLG,
          }}
        >
          <Divider style={{fontFamily: 'Zen Maru Gothic'}} orientation="left">
            Welcome back, {userFirstName}
          </Divider>
          <Row style={{fontFamily: 'Zen Maru Gothic'}}
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="center" align="top">
          <Col className="gutter-row" span={6}>
            <div style={style}>
            <Link to="/Login"><Button type="text" style={style}>
              Plan a Trip
              </Button>
            </Link>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Weather</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Uber Eatz Ad</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>Traffic Density</div>
          </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;