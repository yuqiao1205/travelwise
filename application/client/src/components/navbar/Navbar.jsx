import { Link, useNavigate } from 'react-router-dom'
import DropdownMenu from '../settingdropdown/DropdownMenu.jsx'
import { AuthContext } from '../../context/authContext.js'
import React, { useContext } from 'react'
import './navbar.css'
// import SearchInput from '../../pages/searchpage/SearchInput.jsx';
import { themes } from '../../config/themes.js'
import ThemeDropdown from '../themedropdown/ThemeDropdown.jsx'
// import BookingDropdown from '../booking/BookingDropdown.jsx'
import RegionDropdown from '../region/RegionDropdown.jsx'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import TravelDropdown from '../traveldropdown/TravelDropdown.jsx'
import TravelLogo from '../../img/travelwise.png'
import SearchInputFilter from '../search/SearchInputFilter.jsx'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleWriteClick = (e) => {
    // Check if the user is logged in
    if (!currentUser) {
      // Prevent default link behavior
      e.preventDefault()
      // If not logged in, redirect to the login page
      navigate('/login')
    }
  }

  const handleLogout = () => {
    logout()

    // Redirect to the home page
    navigate('/')
  }

  return (
    <div className='my-navbar'>
      <div className='topLeft'>
        <Link to='/'>
          <img className='toplogo' src={TravelLogo} alt='logo' style={{ width: '100px', height: '80px' }} />
        </Link>
        {/* <a href="/" className='brand-logo'>TravelWise</a> */}

        {/* <i className='topIcon fab fa-facebook-square'></i>
        <i className='topIcon fab fa-instagram-square'></i>
        <i className='topIcon fab fa-pinterest-square'></i>
        <i className='topIcon fab fa-twitter-square'></i> */}
      </div>
      <div className='topCenter'>
        <ul className='topList'>
          <li className='topListItem'>
            <Link to='/'>
              <button className='linkhome'>HOME</button>
            </Link>
          </li>
          {/* <li className='topListItem'>
            <Link to='/about'>
              <button className='linkhome'>ABOUT</button>
            </Link>
          </li> */}
          <li className='topListItem'>
            <RegionDropdown/>
          </li>

          <li className='topListItem'>
            <ThemeDropdown themes={themes} />
          </li>
          <li className='topListItem1'>
            <Link to='/write' onClick={handleWriteClick}>
              <AddCircleOutlineIcon className='addicon'></AddCircleOutlineIcon>
              {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
              <button className='newpostbtn'>POST
              </button>
            </Link>
          </li>
          {/* <li className='topListItem'>
            <Link className='link' to='/location' >
              <button className='mapbtn'>MAP</button>
            </Link>
          </li> */}
          {/* <li className='topListItem'>

            <TravelDropdown/>

          </li> */}
          {/* <li className='topListItem'>
          <BookingDropdown />
          </li> */}
        </ul>
      </div>
      <div className='top-search'>
        <SearchInputFilter/>
      </div>
      <div className='top-user-logout'>
        {currentUser && (
          <>
            {/* <span className='topListItem'>Hi, </span> */}
            {/* <span className='topListItem'><img src={currentUserImg} alt="User" /></span> */}
            <span>
              <DropdownMenu
                currentUser={currentUser}
                // updateUsername={setCurrentUsername}
              />
            </span>

            <ul className='top-logout'>
              <li className='topListItem4' onClick={handleLogout}>
                <span className='logout-button'>LOGOUT</span>
              </li>
            </ul>
          </>
        )}

        {!currentUser && (
          <ul className='topList-login-register'>
            <li className='topListItem2'>
              <Link className='login-link' to='/login'>
                LOGIN
              </Link>
            </li>
            <li className='topListItem3'>
              <Link className='link1' to='/register'>
                REGISTER
              </Link>
            </li>
          </ul>
        )}

      </div>

    </div>
  )
}

export default Navbar
