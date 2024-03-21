import React from 'react';

const DirectionsDisplay = ({ directions }) => {
  if (!directions || !directions.Steps || !directions["Start Address"] || !directions["End Address"] || !directions["Total Distance"] || !directions["Total Duration"]) {
    return <p>No directions available.</p>; // Display a message if directions are incomplete or not provided
  }

  return (
    <div>
      <h2>Directions</h2>
      <div>From: {directions["Start Address"]}</div>
      <div>To: {directions["End Address"]}</div>
      <div>Total Distance: {directions["Total Distance"]}</div>
      <div>Total Duration: {directions["Total Duration"]}</div>
      <ol>
        {directions.Steps.map((step, index) => (
          <li key={index}>{step}</li> // Assuming steps are plain text; for HTML content, consider sanitization as needed
        ))}
      </ol>
    </div>
  );
};

export default DirectionsDisplay;
