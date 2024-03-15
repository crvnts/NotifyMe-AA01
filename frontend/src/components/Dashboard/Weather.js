import React, { useState } from 'react'
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import hunidity_icon from '../Assets/humidity.png'


const Weather = () => {
    // The regular expression \w\S* matches every word in the string, allowing the 
    // replace function to capitalize the first letter of each word and convert the rest to lower case.
    const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    let api_key = 'f2f88788f29296c8a7cee8708dfa213d';

    const [wicon,setWicon] = useState(cloud_icon);

    const search = async () => {
        const element = document.getElementsByClassName("cityInput")
        if(element[0].value == '') {
            return 0;
        }
        // Backtick not regular tick (apostrophe) for template literals
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
        
        let response = await fetch(url);
        let data = await response.json();

        const humidity = document.getElementsByClassName('humidity-percent');
        const wind = document.getElementsByClassName('wind-rate');
        const temperature = document.getElementsByClassName('weather-temp');
        const location = document.getElementsByClassName('weather-location');
        const description = document.getElementsByClassName('weather-desc');

        humidity[0].innerHTML = data.main.humidity + "%";
        wind[0].innerHTML = Math.floor(data.wind.speed) + " m/s";
        temperature[0].innerHTML = Math.floor(data.main.temp) + " °C";
        location[0].innerHTML = data.name;
        description[0].innerHTML = toTitleCase(data.weather[0].description);

        if(data.weather[0].icon==="01d" || data.weather[0].icon==="01n") {
            setWicon(clear_icon);
        }
        else if (data.weather[0].icon==="02d" || data.weather[0].icon==="02n") {
            setWicon(cloud_icon);
        }
        else if (data.weather[0].icon==="03d" || data.weather[0].icon==="03n") {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon==="04d" || data.weather[0].icon==="04n") {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon==="09d" || data.weather[0].icon==="09n") {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon==="10d" || data.weather[0].icon==="10n") {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon==="13d" || data.weather[0].icon==="13n") {
            setWicon(snow_icon);
        }
        else {
            setWicon(clear_icon);
        }
    }

  return (
    <div className='container'>
        <div className='top-bar'>
            <input type='text' className='cityInput' placeholder='Search'></input>
            <div className='search-icon' onClick={()=>{search()}}>
                <img src={search_icon} alt=''></img>
            </div>
        </div>
        <div className='weather-image'>
            <img style={{height: '20vh', width: '20vh'}} src={wicon} alt=''></img>
        </div>
        <div className='weather-desc'>Cloudy</div>
        <div className='weather-temp'>12°c</div>
        <div className='weather-location'>Toronto</div>
        <div className='data-container'>
            <div className='element'>
                <img style={{height: '4vh', width: '4vh'}} src={hunidity_icon} alt='' className='icon'></img>
                <div className='data'>
                    <div class="humidity-percent">40%</div>
                    <div class="text">Humidity</div>
                </div>
            </div>
            <div className='element'>
                <img style={{height: '4vh', width: '4vh'}} src={wind_icon} alt='' className='icon'></img>
                <div className='data'>
                    <div class="wind-rate">20 m/s</div>
                    <div class="text">Wind Speed</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Weather;