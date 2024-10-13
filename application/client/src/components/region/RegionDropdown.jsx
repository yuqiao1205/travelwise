import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './region.css'

function RegionDropdown () {
  const [isOpen, setIsOpen] = useState(false)

  const handleMouseOver = () => {
    setIsOpen(true)
  }

  const handleMouseOut = () => {
    setIsOpen(false)
  }

  return (
    <div className='regiondropdown' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <button className='region-dropdown-btn'>REGIONS</button>
      {isOpen && (
        <div className='region-dropdown-content'>
          <Link to='/?cat=Asia'>Asia</Link>
          <Link to='/?cat=America'>America</Link>
          <Link to='/?cat=Europe'>Europe</Link>
          <Link to='/?cat=Africa'>Africa</Link>
          <Link to='/?cat=Caribbean'>Caribbean</Link>
          <Link to='/?cat=Middleeast'>Middle East</Link>
          <Link to='/?cat=Other'>Other</Link>
          {/* Add more regions as needed */}
        </div>
      )}
    </div>
  )
}

export default RegionDropdown
