import React from 'react';
import { Timeline } from 'antd';

const DirectionItem = ({ direction }) => {
  // Use a regular expression to replace <b> tags with <strong> and remove any <wbr/> or <div> tags
  const cleanedDirection = direction
    .replace(/<b>/g, '<strong>')
    .replace(/<\/b>/g, '</strong>')
    .replace(/<wbr\/?>/g, '')
    .replace(/<div.*?>.*?<\/div>/g, '');

  // Render the cleaned direction using dangerouslySetInnerHTML
  return <span dangerouslySetInnerHTML={{ __html: cleanedDirection }} />;
};

const PlannedDisplay = ({ directions }) => {
  if (!directions || !directions.Steps || !directions["Start Address"] || !directions["End Address"] || !directions["Total Distance"] || !directions["Total Duration"] || !directions["Mode of Transportation"]) {
    return <p>No directions available.</p>; // Display a message if directions are incomplete or not provided
  }

  return (
    <div>
      <h2>Directions</h2>
      <div>From: {directions["Start Address"]}</div>
      <div>To: {directions["End Address"]}</div>
      <div>Mode of Transportation: {directions["Mode of Transportation"]}</div>
      <div>Total Distance: {directions["Total Distance"]}</div>
      <div>Total Duration: {directions["Total Duration"]}</div>
      {/* Use Ant Design's Timeline component to display steps */}
      <Timeline>
        {directions.Steps.map((step, index) => (
          <Timeline.Item key={index}>
            <DirectionItem direction={step} />
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default PlannedDisplay;
