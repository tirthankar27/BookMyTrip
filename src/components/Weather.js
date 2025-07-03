import React, { Component } from "react";
export default class Weather extends Component {
  constructor() {
    super();
    this.state = {
      weather: null,
    };
  }
  async componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        let url = `http://api.weatherapi.com/v1/current.json?key=d5eaef7be67b410a966163325250307&q=${lat},${lon}&aqi=no`;
        let data = await fetch(url);
        let weatherData = await data.json();
        this.setState({ weather: weatherData });
      });
    }
  }
  render() {
    const { weather } = this.state;
    if (!weather) {
      return <div>Loading weather...</div>;
    }
    let { location, current } = weather;
    let cardStyle = {
      backgroundColor: current.temp_c < 25.0 ? "#e0f7fa" : "#fff3e0",
      color: current.temp_c < 25.0 ? "#006064" : "#e65100   ",
    };

    return (
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={`https:${current.condition.icon}`}
            className="card-img-top"
            alt={current.condition.text}
          />
          <div className="card-body" style={cardStyle}>
            <h5 className="card-title">{location.name}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {location.country}
            </h6>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {current.condition.text}
            </h6>
            <p className="card-text">{current.temp_c}°C</p>
            <p className="card-text">Wind Speed: {current.wind_kph} kmph</p>
          </div>
        </div>
      </div>
    );
  }
}
