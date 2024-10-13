import React, { useState } from 'react'
import YelpSearchBar from './YelpSearchBar'
import YelpSearchResultsList from './YelpSearchResultsList'

function YelpInfoPage () {
  const [businesses, setBusinesses] = useState([])

  return (
    <div>
      <YelpSearchBar updateBusinesses={setBusinesses} />
      <YelpSearchResultsList businesses={businesses} />
    </div>
  )
}

export default YelpInfoPage