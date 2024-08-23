import React, {useState, useEffect,useRef } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import './Weather.css';

const Weather = () => {
  const [weatherData, setweatherData] = useState(false)
  const inputref = useRef()
  const allicon = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }
  const search = async (city) => {
    if(city===""){
      alert("Enter City Name");
    }
    else{
         
      try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        alert(data.message);
        return;
      }

      // console.log(data);
      const icon = allicon[data.weather[0].icon] || clear_icon;
      setweatherData({
        humidity:data.main.humidity,
        windSpeed :data.wind.speed,
        temprature : Math.floor(data.main.temp),
        location:data.name,
        icon:icon
      })

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }}
  };

  useEffect(() => {
    search('London');
  }, []);

  return (
    <div className='background'>
      <div className='weather'>
        <div className='search_bar'>
          <input ref={inputref} type='text' placeholder='Search' />
          <img src={search_icon} alt='Search Icon' onClick={()=>search(inputref.current.value)} />
        </div>
        <div className='weather_det'>
          <img src={weatherData.icon} alt='Clear Icon' className='clear_icon' />
          <p className='temperature'>{weatherData.temprature}°C</p>
          <p className='location'>{weatherData.location}</p>
        </div>
        <div className='weather_data'>
          <img src={humidity_icon} alt='Humidity Icon' />
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
          <img src={wind_icon} alt='Wind Icon' />
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
