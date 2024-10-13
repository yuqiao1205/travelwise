import React, { useState } from 'react'
import axios from 'axios'
import CurrentWeather from '../../components/weather/CurrentWeatherBox'
import ForecastDetail from '../../components/weather/ForecastDetail' 
import Header2 from '../../components/header2/Header2'
import WeatherSearchInput from '../../components/weather/WeatherSearchInput'
import './weatherInfo.css'

const WeatherInfo = () => {
  const [weatherData, setWeatherData] = useState({
    currentWeather: null,
    forecast: null
  })

  const handleOnSearchChange = async (searchData) => {
    if (!searchData || !searchData.value) return

    try {
      const [lat, lon] = searchData.value.split(' ')
      const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`)
      const data = response.data

      if (data.success) {
        setWeatherData({
          currentWeather: data.currentWeather,
          forecast: data.weatherForecast
        })
      } else {
        console.error('Failed to fetch weather data:', data.error)
        setWeatherData({
          currentWeather: null,
          forecast: null
        })
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  return (
    <>
      <Header2 />
      <div className='weather-wrapper'>
        <p className='weather-title'>Please Type Your City Name Below To Check Your Destination Weather Info</p>
        <div className='weather-container'>
          <WeatherSearchInput onSearchChange={handleOnSearchChange} />
          {weatherData.currentWeather && <CurrentWeather data={weatherData.currentWeather} />}
          {weatherData.forecast && <ForecastDetail data={weatherData.forecast} />}
        </div>
      </div>
    </>
  )
}

export default WeatherInfo
