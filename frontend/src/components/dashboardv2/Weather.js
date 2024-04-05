import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
import "./Weather.css";

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({});
  const [wicon, setWicon] = useState(cloud_icon);

  const toTitleCase = (str) =>
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case "01d":
        return clear_icon;
      case "01n":
        return clear_icon;
      case "02d":
        return cloud_icon;
      case "02n":
        return cloud_icon;
      case "03d":
        return drizzle_icon;
      case "03n":
        return drizzle_icon;
      case "04d":
        return drizzle_icon;
      case "04n":
        return drizzle_icon;
      case "09d":
        return rain_icon;
      case "09n":
        return rain_icon;
      case "10d":
        return rain_icon;
      case "10n":
        return rain_icon;
      case "13d":
        return snow_icon;
      case "13n":
        return snow_icon;
      default:
        return clear_icon;
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const api_key = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData({
          humidity: data.main.humidity + "%",
          wind: Math.floor(data.wind.speed) + " m/s",
          temp: Math.floor(data.main.temp) + " °C",
          location: data.name,
          description: toTitleCase(data.weather[0].description),
        });
        setWicon(getWeatherIcon(data.weather[0].icon));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <Spin spinning={loading} tip="Loading...">
      <div className="container">
        {!loading && (
          <>
            <div className="top-bar">
              <input type="text" className="cityInput" placeholder="Search"></input>
              <div
                className="search-icon"
                onClick={() => {
                  // Implement search functionality here
                }}
              >
                <img src={search_icon} alt=""></img>
              </div>
            </div>
            <div className="weather-info">
              <div className="weather-image">
                <img src={wicon} alt=""></img>
              </div>
              <div className="weather-info2">
                <div className="weather-desc">{weatherData.description}</div>
                <div className="weather-temp">{weatherData.temp}</div>
              </div>
            </div>

            <div className="weather-location">{weatherData.location}</div>
            <div className="data-container">
              <div className="element">
                <img
                  style={{ height: "4vh", width: "4vh" }}
                  src={humidity_icon}
                  alt=""
                  className="icon"
                ></img>
                <div className="data">
                  <div className="humidity-percent">{weatherData.humidity}</div>
                  <div className="text">Humidity</div>
                </div>
              </div>
              <div className="element">
                <img
                  style={{ height: "4vh", width: "4vh" }}
                  src={wind_icon}
                  alt=""
                  className="icon"
                ></img>
                <div className="data">
                  <div className="wind-rate">{weatherData.wind}</div>
                  <div className="text">Wind</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Spin>
  );
};

export default Weather;
