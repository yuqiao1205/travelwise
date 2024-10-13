import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './dropdown.css'
import PropTypes from 'prop-types'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ListIcon from '@mui/icons-material/List'
// import AccountBoxIcon from '@mui/icons-material/AccountBox'
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import AccountBoxIcon from '@mui/icons-material/AccountBox'

 
// import Dropdown from 'react-bootstrap/Dropdown'

function DropdownMenu ({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleMouseOver = () => {
    setIsOpen(true)
  }

  const handleMouseOut = () => {
    setIsOpen(false)
  }


  const handleUserProfileClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate(`/user/${currentUser.id}`)
    }
  }
  const handleMyPostListClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate(`/userpost/${currentUser.id}`)
    }
  }

  const handleMySettingClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate(`/usersetting/${currentUser.id}`)
    }
  }

  const handleMyFollowedListClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate(`/followerpost/${currentUser.id}`)
    }
  }

  const handleMyFavoritePostClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate(`/favorites/${currentUser.id}`)
    }
  }

  const handleTravelExpertHelpClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate('/chat')
    }
  }

  const handleMyImgClick = () => {
    // Check if currentUser is available
    if (currentUser) {
      // Navigate to the user's post page
      navigate('/vision')
    }
  }

  return (

    <div className='personaldropdown' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>

      {currentUser && (
        <><i className='fas fa-user-circle'></i><span className='personaldropdown-toggle'>  {currentUser.username}</span>

          {/* <img src={currentUser.img} alt='user' className='userImg' /> */}

          {/* <button className='personaldropdown-toggle'>=</button> */}
          {/* <button className={'dropdown-toggle'}></button> */}

          {isOpen && (
            <div className='personaldropdown-content'>
              <Link to='#' onClick={handleUserProfileClick}><AccountBoxIcon></AccountBoxIcon>  My Profile</Link>
              <Link to='#' onClick={handleMySettingClick}><SettingsSuggestOutlinedIcon></SettingsSuggestOutlinedIcon>  Account Setting</Link>
              <Link to='#' onClick={handleMyPostListClick}><ListIcon></ListIcon>  My Posts List</Link>
              <Link to='#' onClick={handleMyFavoritePostClick}><FavoriteIcon></FavoriteIcon>  My Favorites Posts</Link>
              <Link to='#' onClick={handleMyFollowedListClick}><FollowTheSignsIcon></FollowTheSignsIcon>  Followed Users Posts</Link>
              <Link to='#' onClick={handleMyImgClick} ><ExploreOutlinedIcon></ExploreOutlinedIcon>  Destination Identification</Link>
              <Link to='#' onClick={handleTravelExpertHelpClick}><SmartToyIcon></SmartToyIcon>  Travel Expert Help</Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

DropdownMenu.propTypes = {
  currentUser: PropTypes.object
}
export default DropdownMenu
