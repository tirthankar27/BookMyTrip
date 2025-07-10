import React, { useState, useEffect } from 'react';
import './CSS/weather.css';

const Weather = (props) => {
  const [weather, setWeather] = useState({
    city: '',
    temp: '',
    humidity: '',
    wind: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (props.loadingRef.current) props.loadingRef.current.continuousStart();
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              
              const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${props.apiKey}&q=${lat},${lon}&aqi=no`
              );
              
              if (!response.ok) {
                throw new Error('City not found');
              }
              
              const data = await response.json();
              
              setWeather({
                city: data.location.name,
                temp: Math.round(data.current.temp_c),
                humidity: data.current.humidity,
                wind: Math.round(data.current.wind_kph)
              });
            })
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        if (props.loadingRef.current) props.loadingRef.current.complete();
      }
    };

    fetchWeatherData();
  }, [props.apiKey, props.loadingRef]);

  if (loading) {
    return <div className="weather-card globe-themed">Loading weather data...</div>;
  }

  if (error) {
    return <div className="weather-card globe-themed">Error: {error}</div>;
  }

  return (
    <div className="weather-card globe-themed">
      <div className="weather-header">
        <h2>Travel Weather</h2>
        <div className="globe-connection"></div>
      </div>
      
      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-temp">
            {weather.temp}°C
            <div className="weather-desc">{weather.description}</div>
          </div>
        </div>

        <div className="weather-row">
          <span className="weather-label">Location:</span>
          <span className="weather-value">{weather.city}</span>
        </div>
        <div className="weather-row">
          <span className="weather-label">Humidity:</span>
          <span className="weather-value">{weather.humidity}%</span>
        </div>
        <div className="weather-row">
          <span className="weather-label">Wind Speed:</span>
          <span className="weather-value">{weather.wind} km/h</span>
        </div>
      </div>

      <div className="weather-footer">
        <small>Data from OpenWeatherMap</small>
      </div>
    </div>
  );
};

export default Weather;