import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
// Geo API constants and options
const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo'
const GeoApiOptions = {
  headers: {
    'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
  }
}

// Weather API constants
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5'
const WEATHER_API_KEY = process.env.WEATHER_API_KEY

// Function to fetch current weather
const fetchCurrentWeather = async (lat, lon) => {
  const url = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  const response = await axios.get(url)
  return response.data
}

// Function to fetch weather forecast
const fetchForecast = async (lat, lon) => {
  const url = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  const response = await axios.get(url)
  return response.data
}

// Function to fetch city information
const fetchCityInfo = async (cityName) => {
  const response = await axios.get(
      `${GEO_API_URL}/cities?sort=-population&namePrefix=${cityName}`,
      GeoApiOptions
  )
  return response.data.data.map(city => ({
    value: `${city.latitude} ${city.longitude}`,
    label: `${city.name}, ${city.countryCode}`
  }))
}

// export { fetchCurrentWeather, fetchForecast, fetchCityInfo }
export const weatherService = { fetchCurrentWeather, fetchForecast, fetchCityInfo }
