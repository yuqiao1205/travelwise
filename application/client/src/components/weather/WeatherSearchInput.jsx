import React, { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import axios from 'axios'
import PropTypes from 'prop-types'

const WeatherSearchInput = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null)

  let options
  const callCityApi = async (cityName) => {
    try {
      const response = await axios.get(`/weather/city?search=${cityName}`)
      console.log('success? ', response.data.success)
      if (!response.data.success) {
        console.error('Failed to fetch city options:', response.data.error)
        return { options: [] }
      }

      const options = response.data.cities.map(city => ({
        value: city.value,
        label: city.label
      }))
      const result = { options }
      return result
    } catch (error) {
      console.error('Error loading city options:', error)
      return { options }
    }
  }

  let lastCallTime = null

  // we need to stop loadCityOptions from calling the api on every key stroke
  const loadCityOptions = async (cityName) => {
    if (!cityName) return { options: [] }

    const currentTime = new Date().getTime()
    if (lastCallTime && currentTime - lastCallTime < 500) {
      return { options: [] } // return empty options if the last call was less than 500ms ago
    }
    lastCallTime = currentTime
    const result = await callCityApi(cityName)
    if (!result.options || !result) {
      return { options: [] }
    }

    return result
  }

  const handleOnChange = (searchData) => {
    setSearch(searchData)
    onSearchChange(searchData)
  }

  return (
    <AsyncPaginate
      placeholder="Type City Name for Searching Weather"
      debounceTimeout={500}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadCityOptions}
    />
  )
}

WeatherSearchInput.propTypes = {
  onSearchChange: PropTypes.func.isRequired
}

export default WeatherSearchInput
