import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './yelpSearchBar.css'
import Paging from '../pagination/Paging'
import Header2 from '../../components/header2/Header2'

function YelpSearchBar ({ updateBusinesses }) {
  const [inputTerm, setInputTerm] = useState('')
  const [inputLocation, setInputLocation] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/yelpsearch?term=${searchTerm}&location=${searchLocation}&page=${currentPage}`)
        updateBusinesses(response.data.businesses)
        setTotalPages(response.data.totalPages)
        setError('')
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            setError(error.response.data.error)
          } else {
            setError('An error occurred while fetching businesses.')
          }
        } else {
          console.log('Error updating businesses:', error)
          setError('An error occurred while updating businesses.')
        }
      }
    }
    if (searchTerm && searchLocation) {
      fetchData()
    }
  }, [currentPage, searchTerm, searchLocation])

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!inputTerm || !inputLocation) {
      setError('Both "term" and "location" are required fields.')
    }

    setSearchTerm(inputTerm)
    setSearchLocation(inputLocation)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(e)
    }
  }

  return (
    <>
      <Header2></Header2>
      <div className='paging-field'>
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <div className='field'>
        <p className='yelp-search-title'>Yelp-Like Search</p>
        <form >
          <div className='search-row'>
            <div className='search-term'>
              <label className='search-term-label'>
          Search Term:
                <input className='input-field'
                  type="text"
                  value={inputTerm}
                  onChange={(e) => setInputTerm(e.target.value)}
                  placeholder='cake, sushi, coffee etc.'
                  onKeyDown={handleKeyDown}
                />
              </label>
            </div>
            <div className='location-field'>
              <label className='location-label'>
          Nearby:
                <input id="inputLocation" className='input-field'
                  type="text"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  placeholder='Enter location'
                  onKeyDown={handleKeyDown}
                />
              </label>
            </div>
            <div>
              <div className='search-icon-container'onClick={handleSearch}>
                <span className='yelpsearch-icon' style={{ fontSize: '25px' }}><i className="fas fa-search"></i></span>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>

    </>
  )
}

YelpSearchBar.propTypes = {
  updateBusinesses: PropTypes.func.isRequired
}

export default YelpSearchBar
