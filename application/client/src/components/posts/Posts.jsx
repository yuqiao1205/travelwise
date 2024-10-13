import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import './posts.css'
import CustomCard from '../card/CustomCard.jsx'
import Paging from '../pagination/Paging.jsx'
import Container from 'react-bootstrap/Container'
import ScrollToTop from '../scrollToTop/ScrollToTop'

export default function Posts () {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const cat = useLocation().search

  // Extract the 'search' part from the location object
  const searchParams = new URLSearchParams(location.search)

  // Use get method of URLSearchParams to get the value of 'cat' parameter
  const catName = searchParams.get('cat')
  console.log('catName:', catName)

  useEffect(() => {
    setCurrentPage(1)
  }, [cat])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = cat ? `${cat}&page=${currentPage}` : `?page=${currentPage}`
        const res = await axios.get(`/posts${queryString}`)
        console.log('Response from API:', res.data) // Assuming the response is an object with a 'data' field
        if (Array.isArray(res.data.posts)) {
          // Check if the response is an array
          setPosts(res.data.posts)
          setTotalPages(res.data.totalPages) // Use the totalPages property from the response
        } else {
          setPosts([]) // If not an array, reset posts to an empty array
        }
      } catch (err) {
        console.log(err)
        setPosts([]) // In case of an error, also reset posts to an empty array
      }
    }
    fetchData()
  }, [cat, currentPage])

  return (
    <Container fluid>
      {!catName && <h2 id='topElement1'className='latest-post'>Latest Posts</h2>}

      {catName && <h3 id='topElement1'className = 'region-title'>Region: {catName}</h3>}
      <div className="title-holder">
      </div>
      <div className='posts-container'>
        <div id='topElement' className='posts'>
          {posts.map((post) => (
            <div key={post.id} className='post'>
              <CustomCard key={post.id} id={post.id} {...post} postUserId={post.uid} />
              <div className='postFollow'></div>
            </div>
          ))}
        </div>
        <div>
          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <ScrollToTop trigger={currentPage} elementId = 'topElement'/>

        </div>

      </div>
    </Container>
  )
}
