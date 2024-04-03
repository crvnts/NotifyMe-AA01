// AdCarousel.js
import React, { useState, useEffect } from "react";
import "./AdCarousel.css";

const AdCarousel = () => {
  const ads = [
    <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
      <img src="/adImages/ad_google_icon.png" alt="Google" />
    </a>,
    <a href="https://www.ubereats.com/" target="_blank" rel="noopener noreferrer">
    <img src="/adImages/ad_ue_icon.png" alt="Uber Eats" />
  </a>,
    "Ad 3 Content",
    "Ad 4 Content",
  ];
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
    }, 5000); // Change ads every 3 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  return (
    <div className="carousel-container">
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`carousel-slide${currentAd === index ? " active" : ""}`}
        >
          <h3>{ad}</h3>
        </div>
      ))}
    </div>
  );
};

export default AdCarousel;
