import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Header2 from '../../components/header2/Header2'
import './information.css'
import { countries } from '../../config/countries.js'

const Information = () => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [callingCode, setCallingCode] = useState('')
  const [countryName, setCountryName] = useState('')
  const [officialName, setOfficialName] = useState('')
  const [capital, setCapital] = useState('')
  const [region, setRegion] = useState('')
  const [subregion, setSubregion] = useState('')
  const [population, setPopulation] = useState('')
  const [flagURL, setFlagURL] = useState('')
  const [timezones, setTimezones] = useState([])
  const [currency, setCurrency] = useState('')
  const [languages, setLanguages] = useState({})

  useEffect(() => {
    if (selectedCountry) {
      // Fetch country details when a country is selected from the dropdown
      fetchCountryDetails(selectedCountry.value)
    } else {
      setCallingCode('')
      setCountryName('')
      setOfficialName('')
      setCapital('')
      setRegion('')
      setSubregion('')
      setPopulation('')
      setFlagURL('')
      setCurrency('')
      setTimezones([])
      setLanguages({})
    }
  }, [selectedCountry])

  //   const countries = [
  //     { value: 'afghanistan', label: 'Afghanistan' },
  //     { value: 'albania', label: 'Albania' },
  //     { value: 'algeria', label: 'Algeria' },
  //     { value: 'andorra', label: 'Andorra' },
  //     { value: 'angola', label: 'Angola' },
  //     { value: 'antigua & deps', label: 'Antigua & Deps' },
  //   ]

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption)
  }

  const getFirstKey = (jsonObj) => {
    // 1. Get the keys of the jsonObj
    const keys = Object.keys(jsonObj)
    // 2. Check if the keys array has any elements (i.e., if jsonObj is not empty)
    // 3. If the keys array is not empty, return the first key (keys[0])
    // 4. If the keys array is empty, return null
    return keys.length > 0 ? keys[0] : null
  }

  const extractCountryInfo = (countryData) => {
    const root = getFirstKey(countryData)
    console.log('root:', root)
    const countryInfo = countryData[root]
    console.log('countryInfo:', countryInfo)
    return {
      name: countryInfo.name,
      officialName: countryInfo.official_name,
      callingCode: countryInfo.callingCode,
      capital: countryInfo.capital,
      region: countryInfo.region,
      subregion: countryInfo.subregion,
      population: countryInfo.population,
      timezones: countryInfo.timezones,
      currencies: countryInfo.currencies,
      languages: countryInfo.languages,
      flagURL: countryInfo.flag ? countryInfo.flag.large: ''
    }
  }

  const transformCurrencyInfo = (currencyData) => {
    /*
      {
        "CHF": {
            "name": "Swiss franc",
            "symbol": "Fr."
        },
        "EUR": {
            "name": "Euro",
            "symbol": "€"
        }
      }
    */

    // choose first currency
    // output should look like this: "Swiss franc (Fr.)"
    const firstKey = getFirstKey(currencyData)
    const currency = currencyData[firstKey]
    return `${currency.name} (${currency.symbol})`
  }

  const fetchCountryDetails = (countryName) => {
    axios
      .get(`/country?selectedCountry=${countryName}`)
      .then((response) => {
        // countryData should be an object
        const countryData = response.data.countryDetails
        console.log('countryData:', countryData)
        const countryInfo = extractCountryInfo(countryData)
        setCallingCode(countryInfo.callingCode)
        setCountryName(countryInfo.name)
        setOfficialName(countryInfo.officialName)
        setCapital(countryInfo.capital)
        setRegion(countryInfo.region)
        setSubregion(countryInfo.subregion)
        setPopulation(countryInfo.population)
        setTimezones(countryInfo.timezones)
        setCurrency(transformCurrencyInfo(countryInfo.currencies))
        setLanguages(countryInfo.languages)
        setFlagURL(countryInfo.flagURL)
      })
      .catch((error) => {
        console.error('Error fetching country details:', error)
      })
  }

  return (
    <>
      <Header2 />
      <div className='contryinfo-wrapper'>
        <p className='infopage-heading'>Please Select a Country Below to Check Detailed Info</p>
        <div className='infocontainer'>
          <Select
            options={countries}
            isSearchable={true}
            className='Select'
            placeholder='Select a Country'
            onChange={handleCountryChange}
          />
          {selectedCountry && (
            <div className='country-info'>
              <ul>
                <li>Country Name: {countryName}</li>
                <li>Offical Name: {officialName}</li>
                <li>Calling Code: {callingCode}</li>
                <li>Capital: {capital}</li>
                <li>Region: {region}</li>
                <li>Subregion: {subregion}</li>
                <li>Population: {population}</li>
              </ul>
              <div>
                <li className='flag'>Timezones: {Array.isArray(timezones) ? timezones.join(', ') : timezones}</li>
                <li className='flag'>Currency: {currency}</li>
                <li className='flag'>Languages:</li>
                <ul>
                  {Object.entries(languages).map(([code, name]) => (
                    <li className='flag' key={code}>
                      <strong>{code}:</strong> {name}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedCountry && (
                <div>
                  <li className='flag'>Flag:</li>
                  <div className='flag2'><img src={flagURL} alt='Flag' className='flag-image' />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Information
