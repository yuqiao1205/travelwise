import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'
import { Link } from 'react-router-dom'
import Paging from '../../components/pagination/Paging'
import Header2 from '../../components/header2/Header2'
import { Table } from 'react-bootstrap'
import Del from '../../img/del.png'

// import moment from 'moment';

const FavoritesList = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          // Adjusted to include currentPage in the request
          const res = await axios.get(`/favorites/${currentUser.id}?page=${currentPage}`)
          setPosts(res.data.posts) // Assuming the API returns an object with posts and totalPages
          setTotalPages(res.data.totalPages)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage]) // Depend on currentPage as well

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/favorites?postId=${postId}`)
      // Optionally, refetch favorites to reflect changes or simply filter out the deleted post
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <>
      <Header2 />
      <div className='ownpost'>
        <h2>My Favorites Posts List</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Username</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={`${post.id}-${index}`}>
                <td style={{ width: '900px', fontSize: '15px' }}>
                  <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
                </td>
                <td> <Link to={`/user/${post.userId}`}>{post.username}</Link></td>
                {/* Uncomment if using moment for formatting dates */}
                {/* <td>{moment(post.date).fromNow()}</td> */}
                <td style={{ width: '400px', fontSize: '13px' }}>{new Date(post.date).toLocaleString()}</td> {/* Adjusted to use toLocaleString for date */}
                <td>
                  <div className='edit'> {/* Corrected line */}
                    <img className='delete-action'
                      src={Del}
                      alt="Delete"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => handleDelete(post.id)}
                    />
                  </div>
                  {/* <button className='delete-btn' onClick={() => handleDelete(post.id)}>Delete</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Pagination buttons */}
        <div className='ownpost-paging'>
          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  )
}

export default FavoritesList
