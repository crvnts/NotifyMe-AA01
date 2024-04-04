import React, { useState } from "react";
import { Row, Col, Button, Divider, Flex, Carousel } from "antd";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Weather from "./Weather";
import "./Weather.css";
import TTCGraph from "./TTCGraph";
import StatusTab from "./StatusTab";
import AdCarousel from "./AdCarousel";

const MainContent = () => {
  const [planningTrip, setPlanningTrip] = useState(false);

  return (
    <div style={{ flex: 1, paddingTop: "2%" }}>
      {/* <div style={{ paddingBottom: "2%" }}>
        <Banner></Banner>
      </div> */}
      <Row
        className="widget-row"
        gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}
        justify="space-evenly"
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

        <Col span={6}>
          <div className="adwidget" align="center">
            <AdCarousel/>
          </div>
        </Col>
      </Row>
      <Row
        className="widget-row"
        gutter={{ xs: 6, sm: 12, md: 18, lg: 24 }}
        justify="space-evenly"
      >
        <Col className="gutter-row" span={14}>
          <div className="chartwidget" align="center">
            <TTCGraph></TTCGraph>
          </div>
        </Col>
        <Col className="gutter-row" span={8}>
          <div className="widget" align="center">
            <StatusTab></StatusTab>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MainContent;
