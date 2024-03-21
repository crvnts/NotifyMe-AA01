import { Card, Flex, Typography } from 'antd'
import React from 'react'


const Banner = () => {
  return (
    <Card>
        <Flex vertical gap='30px'>
            <Flex vertical align='flex-start'>
                <Typography.Title level={2} strong>
                    Let's get you to your destination.
                </Typography.Title>
                <Typography.Text type='secondary' strong>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                </Typography.Text>
            </Flex>
        </Flex>
    </Card> 
  )
}

export default Banner;