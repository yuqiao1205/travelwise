// YelpSearchResult.js
import React from 'react'
import PropTypes from 'prop-types'
import Rating from 'react-rating'
import './yelpSingleInfo.css'

function YelpSingleResult ({ business }) {
  return (
    <div className='search-result'>
      <a href={business.url} target="_blank" rel="noreferrer">
        <img src={business.image_url} alt={business.name} className='business-image'/>
      </a>
      <div className='business-info'>
        <h3 className='business-name'>{business.name}</h3>
        <p className='business-category'>{business.categories[0].title}</p>
        <span className='business-price'>{business.price}</span>
        <div className='business-rating'>
          {/* <p className='business-reviewcount'> {business.review_count}</p> */}
          <Rating
            emptySymbol="far fa-star"
            fullSymbol="fas fa-star"
            fractions={2}
            readonly
            initialRating={business.rating}
          />
          <p>{business.review_count} Reviews</p>
        </div>
        {/* <p className='business-rating'>Rating: {business.rating}</p> */}
      </div>
      <div className='contact-info'>
        <p>Phone: {business.display_phone}</p>
        <p className='business-location'>
          Location: {business.location.address1}, {business.location.city}
        </p>
      </div>
    </div>
  )
}

YelpSingleResult.propTypes = {
  business: PropTypes.object.isRequired
}

export default YelpSingleResult
