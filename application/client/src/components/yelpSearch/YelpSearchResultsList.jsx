// YelpSearchResultsList.js
import React from 'react'
import PropTypes from 'prop-types'
import YelpSingleResult from './YelpSingleResult'
import './yelpSearchResultsList.css'

function YelpSearchResultsList ({ businesses }) {
  return (
    <div className='search-results'>

      {/* <h2>Yelp Search Results</h2> */}
      <ul>
        {businesses.map((business) => (
          <li key={business.id} className='business-listing'>
            <YelpSingleResult business={business} />
          </li>
        ))}
      </ul>
    </div>
  )
}

YelpSearchResultsList.propTypes = {
  businesses: PropTypes.array.isRequired
}

export default YelpSearchResultsList
