import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import moment from 'moment'
import Edit from '../../img/edit.png'
import Del from '../../img/del.png'
import { Link, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import './singlepost.css'
import Comments from '../../components/comments/Comments'
import Follower from '../../components/follower/Follower'
import SaveToFavorites from '../../components/favorite/Savefavorite'
import Like from '../../components/like/Like'
import PropTypes from 'prop-types'

const Singlepost = ({ post }) => {
  // Component code here
  const navigate = useNavigate()

  console.log('post:', post)

  // userId is the user id of the post author here
  const postUserId = post?.uid || null
  console.log('post:', post)
  console.log('userid:', postUserId)

  const { currentUser } = useContext(AuthContext)

  const [userImg, setUserImg] = useState(null) // State to store user's image

  // for user's image in singlepost
  useEffect(() => {
    // Fetch the user's data using post.uid (userId)
    if (post?.uid) {
      axios.get(`/users/${post.uid}`)
        .then(response => {
          const userData = response.data
          setUserImg(userData.img) // Set userImg state with user's image
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [post])

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post.id}`)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const formatImageUri = (uri) => {
    // if begins with http or https, return uri
    // if undefined return default image
    // otherwise prefix is ../../upload/
    if (!uri) {
      return 'https://picsum.photos/id/16/300'
    }
    return uri.startsWith('http') ? uri : `../../upload/${uri}`
  }

  // Check if post is defined and has an id before rendering the component
  if (!post || !post.id) {
    return null
  }

  return (
    <div className='content'>
      {/* <img className='upimg' src={`../upload/${post?.img}`} alt='' /> */}
      <img className='postImg' src={formatImageUri(post?.img)} alt='' />
      <div className='followerIcon'>
        <Follower userId={postUserId} />
      </div>
      <div className='postIcon'>
        {currentUser?.username === post?.username && (
          <>
            <img className='delimg' onClick={handleDelete} src={Del} alt='' />
            <Link to={`/update?edit=${post.id}`} state={post}>
              <img className='editimg' src={Edit} alt='' />
            </Link>
          </>
        )}

        <div className='likeIcon'>
          <Like postId={post.id} />
        </div>
        <div className='favIcon'>
          <SaveToFavorites postId={post.id} postUserId={post.uid} />
          {/* <SaveToFavorites postId={post.id} /> */}
        </div>
      </div>
      <p className='postTitle'>Title: {post.title}</p>
      {userImg &&
        <img className='authorimg' src={ userImg } onClick = {() => navigate(`/user/${postUserId}`)} alt='' />}

      <div className='postInfo'>
        <b className='postAuthor'>Author: {post?.username}</b>
        <p className='postdate'>Posted {moment(post.date).fromNow()}</p>
      </div>

      <div
        className='postDesc'
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.desc)
        }}
      ></div>

      <div className='postComment'>
        <h3 className='postCommentText'>Add Comments Here</h3>
      </div>

      {/* Render the Comments component regardless of the commentOpen state */}
      <Comments postId={post.id || 0} />
    </div>
  )
}

Singlepost.propTypes = {
  post: PropTypes.object.isRequired
}
export default Singlepost
