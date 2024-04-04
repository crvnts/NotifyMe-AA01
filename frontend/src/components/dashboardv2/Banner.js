import { Card, Flex, Typography } from "antd";
import React from "react";

const Banner = () => {
  return (
    <Card>
      <Flex vertical align="flex">
        <Typography.Title level={2} strong>
          Let's get you to your destination.
        </Typography.Title>
        <Typography.Text type="secondary" strong>
          Where will you go today?
        </Typography.Text>
      </Flex>
    </Card>
  );
};

export default Banner;
