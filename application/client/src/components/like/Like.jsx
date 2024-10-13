import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom' // Import useHistory
import axios from 'axios'
import './like.css'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import PropTypes from 'prop-types'

const Like = ({ postId }) => {
  const { currentUser } = useContext(AuthContext)
  const [likes, setLikes] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate() // Initialize useHistory

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/likes?postId=${postId}`)
        const userLikes = currentUser ? response.data.includes(currentUser.id) : false
        setLikes(response.data)
        setIsLiked(userLikes)
      } catch (error) {
        console.error('Error fetching like status:', error)
        // Handle error if needed
      }
    }

    fetchLikeStatus()
  }, [currentUser, postId])

  const handleLike = async () => {
    try {
      if (!currentUser) {
        console.log('User is not logged in')
        // Redirect to the login page for unregistered users
        navigate('/login')
        return
      }

      if (isLiked) {
        await axios.delete(`/likes?postId=${postId}`)
        setLikes((prevLikes) => prevLikes.filter((id) => id !== currentUser.id))
      } else {
        await axios.post('/likes', { postId })
        setLikes((prevLikes) => [...prevLikes, currentUser.id])
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error handling like:', error)
      // Handle error if needed
    }
  }

  return (
    <span className='likeSection'>
      {/* Conditionally render the like button */}
      {currentUser && (
        <>
          {isLiked
            ? (
              <ThumbUpOutlinedIcon style={{ color: 'blue' }} onClick={handleLike} />
            )
            : (
              <ThumbUpAltOutlinedIcon style={{ color: 'gray' }} onClick={handleLike} />
            )}
          {likes.length > 0 && (
            <span className='likect'>{likes.length}</span>
          )}
        </>
      )}
      {!currentUser && (
        <>
          <ThumbUpOutlinedIcon
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          />
          {/* for like count */}
          <span className='likect'>
            {likes.length}
          </span>
        </>
      )}
    </span>
  )
}

Like.propTypes = {
  postId: PropTypes.number.isRequired
}

export default Like
