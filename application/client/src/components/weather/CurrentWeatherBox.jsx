import './currentweather.css'
import PropTypes from 'prop-types'
import React from 'react'

const CurrentWeatherBox = ({ data }) => {
  return (
    <div className="weather">
      <div className="weather-top">
        <div>
          <p className="city-name">{data.city}</p>
          <p className="weather-description">{data.weather[0].description}</p>
          {/* console.log(data) */}
        </div>
        <img
          alt="weather"
          className="weather-icon"
          src={`icons/${data.weather[0].icon}.png`}
        />
      </div>
      <div className="bottom-info">
        <p className="temperature">{Math.round(data.main.temp)}°C</p>
        <div className="details">
          <div className="detail-row">
            <span className="detail-label">Details</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">
              {Math.round(data.main.feels_like)}°C
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{data.wind.speed} m/s</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.main.humidity}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{data.main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  )
}
CurrentWeatherBox.propTypes = {
  data: PropTypes.object.isRequired
}
export default CurrentWeatherBox
