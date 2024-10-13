import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import CustomCard from '../../components/card/CustomCard.jsx'
import './searchResultsPage.css'
import Paging from '../../components/pagination/Paging.jsx'

const SearchResults = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchTerm = queryParams.get('q')
  const filter = queryParams.get('filter')

  useEffect(() => {
    // Reset currentPage to 1 whenever the search term changes
    setCurrentPage(1)
  }, [searchTerm, filter])

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(`/search/?q=${encodeURIComponent(searchTerm)}&filter=${filter}&page=${currentPage}`)

        // Check if there are any posts
        if (res.data.data && res.data.data.length > 0) {
          setPosts(res.data.data) // Assuming posts are returned in 'data' field
          setTotalPages(res.data.totalPages) // Set total pages computed by the backend
        } else {
          setPosts([]) // No posts found
          setTotalPages(1) // Set totalPages to 1 to avoid 'Page 1 of 0'
        }
      } catch (error) {
        console.log('Error fetching search results:', error)
        setPosts([])
        setTotalPages(1) // Set totalPages to 1 in case of error as well
      }
    }

    if (searchTerm) {
      fetchSearchResults()
    }
  }, [searchTerm, currentPage, filter])

  const capitalizeEachCharacter = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <>
      {searchTerm && (
        <h2 className='search-results-header'>Search Result For {capitalizeEachCharacter(searchTerm)}</h2>
      )}
      <div className='search-results-container'>
        <div className='posts1'>
          {posts.length === 0
            ? (<p>No results found.</p>)
            : (posts.map((post) => (
              <div key={post.id} className='post'>
                <CustomCard id={post.id} {...post} postUserId={post.uid} />
              </div>
            ))
            )}
        </div>
      </div>
      <Paging
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )
}

export default SearchResults
