import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'

// import Rightbar from '../../components/rightbar/Rightbar'
import { useLocation, Link, useNavigate } from 'react-router-dom'
// import DefaultUser from '../../img/defaultuser.png'
// import Header2 from '../../components/header2/Header2'

import './personalSetting.css'

const PersonalSetting = () => {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useContext(AuthContext)

  const state = useLocation().state
  const DefaultUser = 'https://picsum.photos/id/501/100'
  const [profileImg, setProfileImg] = useState(currentUser?.img)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fileName, setFileName] = useState('')

  // Conditionally set the initial state based on whether state is null or not
  const [texts, setTexts] = useState({
    email: state?.email || currentUser?.email || '',
    nickname: state?.nickname || currentUser?.nickname || '',
    city: state?.city || currentUser?.city || '',
    fullname: state?.fullname || currentUser?.fullname || '',
    interest: state?.interest || currentUser?.interest || ''
  })
  console.log('personal setting initial states:', texts)

  const [uploadError, setUploadError] = useState('')
  const upload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/profile', formData)
      setUploadError('') // Clear any previous upload error
      return res.data
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        setUploadError(
          err.response.data.error ||
            'An error occurred while uploading the image'
        )
      } else {
        setUploadError('Failed to upload image')
      }
    }
  }

  // set a timer to clear the error message after 3 seconds
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError('') // Clear the error message after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup the timer
    }
  }, [uploadError])

  const displayErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 4000)
  }

  const displaySuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage('')
    }, 4000)
  }

  // Update user data on initial load
  const handleChange = (e) => {
    const { name, value } = e.target
    setTexts((prev) => ({ ...prev, [name]: value }))
  }

  const handleClick = async (e) => {
    e.preventDefault()
    console.log('handleClick', profileImg)
    // prevent submit form if the image is not image file
    if (profileImg === undefined) {
      displayErrorMessage('Please check the profile image file')
      return
    }

    console.log('Changing profile picture')

    try {
      let imgFile = currentUser?.img || state?.img || DefaultUser

      // Check if a new image is selected
      if (profileImg instanceof File) {
        const uploadResponse = await upload(profileImg)
        imgFile = '../../profile/' + uploadResponse
      }

      const updatedUser = {
        ...texts,
        img: imgFile || profileImg
      }

      // Perform API call to update the user
      await axios.put('/users', updatedUser)

      displaySuccessMessage('Profile updated successfully')
      navigate(`/user/${currentUser.id}`) // Redirect to the profile page
      //   window.location.reload()
    } catch (error) {
      // Handle errors from the entire try block, including our specific error for non-image files
      if (error.message === 'Only image files are allowed.') {
        displayErrorMessage(
          'Error updating profile: Only image files are allowed.'
        )
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg)
          .join('\n')
        displayErrorMessage('Error updating profile:\n' + errorMessages)
      } else {
        displayErrorMessage('Error updating profile, please try again.')
      }
    }
  }

  const changeProfileImage = async (e) => {
    console.log('changeProfileImage')
    const file = e.target.files[0]

    if (file) {
      setFileName(file.name)

      console.log('file is:', file)
      let profileImg = currentUser?.img || state?.img || DefaultUser

      try {
        profileImg = await upload(file) // Use file variable directly
        if (profileImg) {
          //   setProfileImg(profileImg)
          profileImg = '../../profile/' + profileImg // Update profile image state with the URL or path received from upload
        }
        console.log('profileImg:', profileImg)
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errorMessages = error.response.data.errors
            .map((err) => err.msg)
            .join('\n')
          displayErrorMessage('Error uploading image:\n' + errorMessages)
        } else {
          displayErrorMessage('Failed to upload image, please try again.')
        }
      }
      setProfileImg(profileImg)
    }
  }

  // Update user data on initial load
  useEffect(() => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...texts,
      img: profileImg
    }))
  }, [setCurrentUser, texts, profileImg])

  const handleDeleteAccount = async () => {
    // Ask for confirmation before deleting the account
    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )

    if (isConfirmed) {
      try {
        // Assuming you have an API endpoint to delete the user account
        // and that the endpoint is secured and requires a user's token
        const userId = currentUser?.id || state?.id
        await axios.delete(`/users/${userId}`)
        setCurrentUser(null)
        localStorage.removeItem('user')
        navigate('/')
      } catch (error) {
        console.error('Error deleting account:', error)
        window.alert('Error deleting account, please try again.')
      }
    }
  }

  return (
    <>
      <div className="settings">
        <div className="settingsWrapper">
          <div className="settingsTitle">
            <span className="settingsTitleUpdate">Update Your Account</span>
            <div className="settingbutton">
              <button
                className="settingsUpdateButton"
                type="submit"
                onClick={handleClick}
              >
                Update
              </button>
              <button
                className="settingsTitleDelete"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>

          </div>

          <form className="settingsForm">
            <label>Profile Picture</label>
            <div className="settingsPP">
              <Link to={`/user/${currentUser.id}`}>
                <img
                  className="own-img"
                  name="img"
                  src={profileImg || DefaultUser}
                  alt="profile"
                />
              </Link>
              {/* <img name="img" src={profileUrl || DefaultUser} alt="" /> */}
              <label htmlFor="fileInput">
                <i className="settingsPPIcon far fa-user-circle"></i>{' '}
              </label>
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                className="settingsPPInput"
                onChange={changeProfileImage}
              />
              <div>change profile image</div>
              <div className="file-info">
                {fileName && (
                  <p className="file-name">Selected file: {fileName}</p>
                )}
                {uploadError && (
                  <p className="upload-error-message">{uploadError}</p>
                )}
              </div>
            </div>
            <br />
            <label>Email</label>
            <input
              value={texts.email}
              type="email"
              placeholder="Enter new email"
              name="email"
              required
              onChange={handleChange}
            />

            <label>Full Name</label>
            <input
              value={texts.fullname}
              type="text"
              placeholder="Enter your full name"
              name="fullname"
              onChange={handleChange}
            />
            <label>Nickname</label>
            <input
              value={texts.nickname}
              type="text"
              placeholder="new nickname"
              name="nickname"
              onChange={handleChange}
              required
            />
            <label>City</label>
            <input
              value={texts.city}
              type="text"
              placeholder="new cityname"
              name="city"
              onChange={handleChange}
              required
            />
            <label>Interest</label>
            <input
              value={texts.interest}
              type="text"
              placeholder="Enter your interest"
              name="interest"
              onChange={handleChange}
            />
          </form>
          {errorMessage && (
            <p className="personal-setting-error-message">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="personal-setting-success-message">{successMessage}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default PersonalSetting
