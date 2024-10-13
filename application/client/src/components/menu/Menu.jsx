import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import './menu.css'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([])

  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`)
        // Assuming the backend returns an object with a 'data' key containing the posts
        if (res.data && Array.isArray(res.data.posts)) {
          // Exclude the post with the specified ID
          const filteredPosts = res.data.posts.filter(post => post.id !== parseInt(id))
          setPosts(filteredPosts)
        } else {
          console.warn('Unexpected response format:', res.data)
          setPosts([])
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
        setPosts([])
      }
    }
    fetchData()
  }, [cat, id])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(`/posts/?cat=${cat}`)
  //       // Assuming the backend returns an object with a 'data' key containing the posts
  //       if (res.data && Array.isArray(res.data.posts)) {
  //         setPosts(res.data.posts)
  //       } else {
  //         console.warn('Unexpected response format:', res.data)
  //         setPosts([])
  //       }
  //     } catch (err) {
  //       console.error('Error fetching posts:', err)
  //       setPosts([])
  //     }
  //   }
  //   fetchData()
  // }, [cat])

  const formatImageUri = (uri) => {
    // if begins with http or https, return uri
    // if undefined return default image
    // otherwise prefix is ../../upload/
    if (!uri) {
      return 'https://picsum.photos/id/16/300'
    }
    return uri.startsWith('http') ? uri : `../../upload/${uri}-thumbnail.jpg`
  }
  return (

    <div className='menu'>

      <h1 className='menu-title'>Other Articles You May Like</h1>
      {posts.map(post => (
        <div className='menu-post' key={post.id}>

          {/* <img src={`../upload/${post.img}`} alt=''/> */}
          <Link to={`/singlepost/${post.id}`}>
            <img className='menu-img' src={formatImageUri(post?.img)} alt=''/>
          </Link>
          {/* <img src= {post.img} alt=''/> */}
          <p className='menu-postname'>{post.title}</p>
          <Link to={`/singlepost/${post.id}`}>
            <Button className='menu-readmore'>Read More &gt;&gt;</Button></Link>
        </div>

      ))}

    </div>

  )
}

Menu.propTypes = {
  cat: PropTypes.string,
  currentPost: PropTypes.object
}
export default Menu
