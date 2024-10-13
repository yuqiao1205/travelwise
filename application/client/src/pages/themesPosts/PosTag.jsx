// src/components/PostsByTag.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header2 from '../../components/header2/Header2'
import CustomCard from '../../components/card/CustomCard.jsx'
import Paging from '../../components/pagination/Paging.jsx'
import './posTag.css'
import { themes } from '../../config/themes.js'
// import SubscribeForm from '../../components/subscribe/SubscribeForm.jsx'
// import Follower from '../../components/follower/Follower.jsx';
// import Rightbar from '../../components/rightbar/Rightbar.jsx';

const PostsByTag = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [themeName, setThemeName] = useState('')

  const { tid } = useParams()
  console.log('tid:', tid)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('tid:', tid)
        // const response = await axios.get(`/posts/tag/${tid}`);
        const response = await axios.get(
          `/posts/tag/${tid}?page=${currentPage}`
        ) // Include the current page in the request

        // Assuming the response is an object with a 'data' field
        setPosts(response.data.data)
        console.log('Response from API:', response.data)
        setTotalPages(response.data.totalPages) // Set the total number of pages
      } catch (err) {
        console.error('Error fetching posts:', err)
        // Handle the error appropriately
      } finally {
        setLoading(false)
      }
    }

    const theme = themes.find(t => t.tid.toString() === tid)
    if (theme) {
      setThemeName(theme.name)
    }

    fetchPosts()
  }, [tid, currentPage])

  if (loading) return <p>Loading...</p>
  if (!posts.length) return <p>No posts found for this theme.</p>

  return (
    <>
      <Header2 />
      <div className='tag-posts-container'>
        {themeName && <h1 className='themeTitle'>Theme: {themeName}</h1>}
        <div className='posts'>
          {posts.map((post, index) => (
            <div key={`${post.id}-${index}`} className='post'>
              <CustomCard id={post.id} {...post} postUserId={post.uid} />

            </div>
          ))}
        </div>
        {/* <Rightbar className= 'rightbar'/> */}
        <div className='theme-paging'>
          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {/* <SubscribeForm /> */}
      </div>
    </>
  )
}

export default PostsByTag
