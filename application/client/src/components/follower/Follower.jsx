import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
// import './follower.css'
import PropTypes from 'prop-types'

const Follower = ({ userId, postUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const { currentUser } = useContext(AuthContext)

  // display error message if current user follow themselves
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  //  const userId = props.userId;

  const handleFollow = async () => {
    try {
      if (!currentUser) {
        navigate('/login')
        return
      }

      if (userId === currentUser.id) {
        setErrorMessage('You can\'t follow yourself.')
        setTimeout(() => {
          setErrorMessage('') // Clear the error message after 3 seconds
        }, 3000) // 3 seconds (3000 milliseconds)
        return
      }

      if (isFollowing) {
        await axios.delete('/follow?userId=' + userId)
        setIsFollowing(false)
      } else {
        await axios.post('/follow', { userId, postUserId })
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Error:', error)
      // You can handle the error here, such as displaying an error message to the user.
    }
  }

  useEffect(() => {
    const fetchRelationshipData = async () => {
      try {
        const res = await axios.get('/follow?followedUserId=' + userId)
        const relationshipData = res.data
        setIsFollowing(relationshipData.includes(currentUser?.id))
      } catch (error) {
        console.error('Error fetching relationship data:', error)
        // You can handle the error here, such as displaying an error message to the user.
      }
    }

    fetchRelationshipData()
  }, [userId, currentUser?.id])

  return (
    <div>
      <Button
        className={`followButton ${isFollowing ? 'following' : ''}`}
        onClick={handleFollow}
        style={{ color: 'white', backgroundColor: isFollowing ? 'green' : 'blue' }}
      >
        {isFollowing ? 'Following' : 'Follow This User'}
      </Button>
      {/* <Button
        className={`followButton ${isFollowing ? 'following' : ''}`}
        onClick={handleFollow}
        variant={isFollowing ? 'success' : 'primary'}
      >
        {isFollowing ? 'Following' : 'Follow This User'}
      </Button> */}
      <span className="errorMessage">{errorMessage}</span>
    </div>
  )
}

Follower.propTypes = {
  userId: PropTypes.number,
  postUserId: PropTypes.number
}
export default Follower
