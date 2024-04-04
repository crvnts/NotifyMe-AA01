import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col } from 'antd';

const StatusTab = () => {
  const [latestTTCAert, setLatestTTCAert] = useState({
    description: 'Loading...',
    route: '',
  });

  const [latestGOAlert, setLatestGOAlert] = useState({
    description: 'Loading...',
    route: '',
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Fetch TTC Alerts
        const ttcResponse = await axios.get("https://notifyme-aa01-r4ro.onrender.com/api/getTTCAlerts");
        const ttcAlertsData = ttcResponse.data.data.alerts;
        if (ttcAlertsData && ttcAlertsData.length > 0) {
          const mostRecentTTCAert = ttcAlertsData.reduce((prev, current) =>
            prev.last_updated > current.last_updated ? prev : current,
          );
          setLatestTTCAert(mostRecentTTCAert);
        } else {
          setLatestTTCAert({ description: 'No current delays.', route: '' });
        }

        // Fetch GO Alerts
        const goResponse = await axios.get("https://notifyme-aa01-r4ro.onrender.com/api/getGoAlerts"); // Use the correct endpoint for GO alerts
        const goAlertsData = goResponse.data.data.alerts;
        if (goAlertsData && goAlertsData.length > 0) {
          const mostRecentGOAlert = goAlertsData.reduce((prev, current) =>
            prev.last_updated > current.last_updated ? prev : current,
          );
          setLatestGOAlert(mostRecentGOAlert);
        } else {
          setLatestGOAlert({ description: 'No current delays.', route: '' });
        }
      } catch (error) {
        console.error('Error fetching the alerts data:', error);
        setLatestTTCAert({ description: 'Failed to load data.', route: '' });
        setLatestGOAlert({ description: 'Failed to load data.', route: '' });
      }
    };

    fetchAlerts();
  }, []);

  return (
    
    <Col className="gutter-row" span={24}>
      <div className="status-container">
      <Card title="Regional Transit Status" bordered={false}>
        <p>
          <strong>TTC:</strong> {latestTTCAert.description}
        </p>
        <p>
          <strong>GO:</strong> {latestGOAlert.description}
        </p>
        {/* You can add more lines like the one above for additional routes or information */}
      </Card>
      </div>
    </Col>
    
  );
};

export default StatusTab;
