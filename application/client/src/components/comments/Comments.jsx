import React, { useContext, useState, useEffect, useCallback } from 'react'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import './comment.css'
import PropTypes from 'prop-types'

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState('')
  const [replyDescs, setReplyDescs] = useState({})
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeReplyBox, setActiveReplyBox] = useState(null)

  const toggleReplyBox = (commentId) => {
    setActiveReplyBox(commentId === activeReplyBox ? null : commentId)
  }

  // Function to process comments data
  const processData = (commentsData) => {
    const topLevelComments = commentsData.filter(comment => !comment.parentCommentId)
    const repliesMap = commentsData.filter(comment => comment.parentCommentId)
      .reduce((map, comment) => {
        if (!map[comment.parentCommentId]) {
          map[comment.parentCommentId] = []
        }
        map[comment.parentCommentId].push(comment)
        return map
      }, {})

    topLevelComments.forEach(comment => {
      comment.replies = repliesMap[comment.id] || []
    })

    return topLevelComments
  }

  // Fetch comments data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/comments?postId=${postId}`)
      const processedComments = processData(response.data)
      setComments(processedComments)
      setError(null)
    } catch (error) {
      setError('Error fetching comments')
      console.error('Error fetching comments:', error)
    }
    setIsLoading(false)
  }, [postId]) // Include all dependencies here

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Function to handle comment addition
  const addComment = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      await axios.post('/comments', { desc, postId, userId: currentUser.id })
      fetchData()
      setDesc('')
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  // Function to handle reply addition
  const addReplyToComment = async (commentId) => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const replyDesc = replyDescs[commentId] || ''
    try {
      await axios.post('/comments/reply', {
        desc: replyDesc,
        parentCommentId: commentId,
        userId: currentUser.id,
        postId

      })
      fetchData()
      setReplyDescs(prevDescs => ({ ...prevDescs, [commentId]: '' }))
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  // Function to handle reply input change
  const handleReplyChange = (commentId, value) => {
    setReplyDescs(prevDescs => ({ ...prevDescs, [commentId]: value }))
  }

  // Function to handle comment button click
  const handleClick = (e) => {
    e.preventDefault()
    addComment()
  }

  // Function to render comments and replies
  const renderComments = (comments, depth = 0) => {
    return comments.map(comment => (
      <div key={comment.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div className='comment'>
          <div className='comment-info'>
            <span className='comment-username'> {depth > 0 ? `reply@${comment.username}` : `@${comment.username}`}</span>
            <p className='comment-date'>{moment(comment.createdAt).fromNow()}</p>
          </div>
          <p className='comment-desc'>{comment.desc}</p>
          {depth === 0 && (
            <>
              <p className='replytext' onClick={() => toggleReplyBox(comment.id)}>
                Reply
              </p>
              {activeReplyBox === comment.id && (
                <div>
                  <input
                    type='text'
                    placeholder='Write a reply'
                    value={replyDescs[comment.id] || ''}
                    onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                  />
                  <button className='replybutton' onClick={() => addReplyToComment(comment.id)}>
                    Post Reply
                  </button>
                  <button className='cancelbutton' onClick={() => setActiveReplyBox(null)}>
                  Cancel
                  </button>
                </div>
              )}
            </>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className='nested-replies'>
              {renderComments(comment.replies, depth + 1)}
            </div>
          )}
        </div>
      </div>
    ))
  }

  return (
    <div className='comments'>
      {isLoading ? <p>Loading...</p> : renderComments(comments)}
      <div className='write'>
        <input
          type='text'
          placeholder='Write a comment'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className='comment-button' onClick={handleClick}>Comment</button>
      </div>
      {/* {error && <p>{error}</p>} */}
      {error && (
        <div>
          <p>Error loading comments. Please try again.</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}
    </div>
  )
}

Comments.propTypes = {
  postId: PropTypes.number.isRequired
}
export default Comments
