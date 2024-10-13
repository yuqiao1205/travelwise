// (`https://countryapi.io/api/name/${countryName}?apikey=2m04kAelH4IsFjnlgr1CpmrgFIh10xhrSSsjLXZP`)

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const COUNTRY_API_URL = 'https://countryapi.io/api/name'
const COUNTRY_API_KEY = process.env.COUNTRY_API_KEY

export const getCountryDetails = async (countryName) => {
  const response = await axios.get(`${COUNTRY_API_URL}/${countryName}?apikey=${COUNTRY_API_KEY}`)
  return response.data
}

export const countryInfoService = { getCountryDetails }
