import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './traveldropdown.css'

function TravelDropdown () {
  const [isOpen, setIsOpen] = useState(false)

  const handleMouseOver = () => {
    setIsOpen(true)
  }

  const handleMouseOut = () => {
    setIsOpen(false)
  }

  return (
    <div className='dropdown' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <button className='travelinfo-dropdown-button'>TRAVEl-INFO</button>
      {isOpen && (
        <div className='dropdown-content'>
          <Link to='/weather_info'>
            Weather Info
          </Link>
          <Link to='/information'>
            Country Info
          </Link>
          <Link to='/yelpsearch'>
            Yelp Search
          </Link>

        </div>
      )}
    </div>
  )
}

export default TravelDropdown
