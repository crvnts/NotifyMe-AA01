import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col } from "antd";

const StatusTab = () => {
  const [latestAlert, setLatestAlert] = useState({
    description: "Loading...",
    route: "",
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/getAlerts");
        const alertsData = response.data.data.alerts;
        if (alertsData && alertsData.length > 0) {
          // Use the alert with the most recent 'last_updated' time
          const mostRecentAlert = alertsData.reduce((prev, current) =>
            prev.last_updated > current.last_updated ? prev : current
          );
          setLatestAlert(mostRecentAlert);
        } else {
          setLatestAlert({ description: "No current delays.", route: "" });
        }
      } catch (error) {
        console.error("Error fetching the alerts data:", error);
        setLatestAlert({ description: "Failed to load data.", route: "" });
      }
    };

    fetchAlerts();
  }, []);

  // The content of the return statement stays the same
  return (
    <Col className="gutter-row" span={24}>
      <Card title="TTC Status" bordered={false}>
        <p>
          <strong>TTC:</strong> {latestAlert.description}
        </p>
        {/* You can add more lines like the one above for additional routes or information */}
      </Card>
    </Col>
  );
};

export default StatusTab;
