import React, { useState } from "react";
import { Row, Col, Button, Divider, Flex } from "antd";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Weather from "./Weather";
import "./Weather.css";
import TTCGraph from "./TTCGraph";
import StatusTab from "./StatusTab";

const MainContent = () => {
  const [planningTrip, setPlanningTrip] = useState(false);

  return (
    <div style={{ flex: 1 }}>
      <Banner></Banner>

      <Row
        className="widget-row"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ marginBottom: "1%" }}
      >
        <Col className="gutter-row" span={6}>
          <div className="widget" align="center">
            <Link to="/TripPlanner">
              <div>
                <Button
                  type="text"
                  className="widget-button"
                  onClick={() => {
                    setPlanningTrip(planningTrip);
                  }}
                >
                  Plan a Trip
                </Button>
              </div>
            </Link>
          </div>
        </Col>

        <Col span={6}>
        <div className="widget" align="center">
          <Weather></Weather>
        </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="widget" align="center">
            <Link to="/">
              <Button type="text" className="widget-button">
                Uber Eatz Ad
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="widget-row" gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}>
        <Col className="gutter-row" span={12}>
          <div className="widget" align="center">
            <TTCGraph></TTCGraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainContent;
