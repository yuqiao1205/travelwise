import { weatherService } from '../services/weatherService.js'

export const getCityInfo = async (req, res) => {
  try {
    const cityName = req.query.search

    if (!cityName) {
      return res.status(400).json({ success: false, error: 'City name is required' })
    }

    const cityInfo = await weatherService.fetchCityInfo(cityName)

    if (!cityInfo.length) {
      return res.status(404).json({ success: false, error: 'City not found' })
    }

    // Returning the first result which contains longitude and latitude
    res.json({
      success: true,
      cities: cityInfo
    })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}

// controllers/weatherController.js
export const getWeather = async (req, res) => {
  try {
    const latitude = req.query.lat
    const longitude = req.query.lon

    console.log('latitude', latitude)
    console.log('longitude', longitude)

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' })
    }

    const currentWeather = await weatherService.fetchCurrentWeather(latitude, longitude)
    const weatherForecast = await weatherService.fetchForecast(latitude, longitude)

    res.json({
      success: true,
      currentWeather,
      weatherForecast
    })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
}
