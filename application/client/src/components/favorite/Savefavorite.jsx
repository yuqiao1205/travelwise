import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import './save.css'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import PropTypes from 'prop-types'

const SaveToFavorites = ({ postId, postUserId }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleFavorite = async () => {
    console.log('Current User ID:', currentUser?.id) // Debug log
    // passing post user id to the function

    console.log('Post User ID:', postUserId) // Debug log
    try {
      if (!currentUser) {
        console.log('User is not logged in')
        navigate('/login')
        return
      }

      // Check if the post user id is equ to current user id
      if (postUserId === currentUser.id) {
        // Check if the user is trying to favorite their own post
        setErrorMessage('You can\'t favorite own')
        setTimeout(() => {
          setErrorMessage('') // Clear the error message after 3 seconds
        }, 3000) // 3 seconds (3000 milliseconds)
        return
      }
    } catch (error) {
      console.error('Error:', error)
      // You can handle the error here, such as displaying an error message to the user.
    }

    if (isSaved) {
      const removeFavorite = async () => {
        const response = await axios.delete('/favorites?postId=' + postId)
        if (response.status === 200) {
          setIsSaved(false)
        } else {
          console.error('Error removing from favorites:', response.data)
          setErrorMessage('Error removing from favorites. Please try again.')
        }
      }

      removeFavorite()
    } else {
      // If the post is not saved, save it to favorites
      // Send a POST request to save the post to favorites
      const saveToFavorites = async () => {
        await axios.post('/favorites', { postId, userId: currentUser.id })
        setIsSaved(true)
        // setErrorMessage('Add to favorites.');
      }

      saveToFavorites()
    }
  }

  useEffect(() => {
    const fetchFavStatus = async () => {
      try {
        if (currentUser) {
          // Fetching the list of favorite posts for the current user
          const response = await axios.get(`/favorites/${currentUser.id}`)
          const favorites = response.data ? response.data.posts : []

          // Check if the current post is in the list of favorites
          const userFav = Array.isArray(favorites) && favorites.some(post => post.id === postId)
          setIsSaved(userFav)
        } else {
          setIsSaved(false)
        }
      } catch (error) {
        console.error('Error fetching favorites status:', error)
      }
    }

    fetchFavStatus()
  }, [currentUser?.id, postId])

  return (
    <span className='save'>
      <button className='fav-button' onClick={handleFavorite} style={{ background: 'none', border: 'none' }}>
        {isSaved
          ? (<FavoriteOutlinedIcon style={{ color: 'red' }} />)
          : (
            <FavoriteBorderOutlinedIcon style={{ color: 'gray' }} />
          )}
      </button>
      <span className='errorMessage'>{errorMessage}</span>
    </span>
  )
}

// userId is post's user id, postId is post's id
SaveToFavorites.propTypes = {
  postId: PropTypes.number,
  postUserId: PropTypes.number
}
export default SaveToFavorites
