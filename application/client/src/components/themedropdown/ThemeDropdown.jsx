import React from 'react'
import './themedropdown.css'
import { Link } from 'react-router-dom'
import { themes } from '../../config/themes.js' // Assuming this is the correct path

const ThemeDropdown = () => {
  return (
    <div className='dropdown'>
      <button className='theme-dropbtn'>THEMES</button>
      <div className='dropdown-content'>
        {themes.map(theme => (
          <Link key={theme.tid} to={`/posts/tag/${theme.tid}`}>{theme.name}</Link>
        ))}
      </div>
    </div>
  )
}

export default ThemeDropdown