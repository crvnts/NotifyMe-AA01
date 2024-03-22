import React from "react";
import { Row, Col, Button, Divider, Flex } from "antd";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Weather from "./Weather";
import "./Weather.css";
import TTCGraph from "./TTCGraph";

const MainContent = () => {
  return (
    <div style={{ flex: 1 }}>
      <Flex vertical gap="2.3rem">
        <Banner></Banner>
      </Flex>

      <Row className="widget-row" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <div className="widget" align="center">
            <Link to="/Login">
              <Button type="text" className="widget-button">
                Plan a Trip
              </Button>
            </Link>
          </div>
        </Col>

        <Col span={6}>
          <Weather></Weather>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="widget" align="center">
            <Link to="/Login">
              <Button type="text" className="widget-button">
                Uber Eatz Ad
              </Button>
            </Link>
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="widget" align="center">
            <TTCGraph></TTCGraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainContent;
