import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import Header2 from '../../components/header2/Header2'
import Paging from '../../components/pagination/Paging'
import { Table } from 'react-bootstrap'
// import Follower from '../../components/follower/Follower'

const FollowedPost = () => {
  const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          // Include currentPage in the API request
          const res = await axios.get(`/posts/followed/${currentUser.id}?page=${currentPage}`)
          setPosts(res.data.posts)
          setTotalPages(res.data.totalPages) // Assume the backend sends this data
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage]) // Depend on currentUser.id and currentPage

  return (
    <>
      <Header2 />
      <div className="ownpost">
        <h2>Your Followed Users Posts List</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Username</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
                </td>
                {/* <td>{post.username}</td> */}
                <td> <Link to={`/user/${post.uid}`}>{post.username}</Link></td>
                <td>{moment(post.date).fromNow()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Pagination controls */}
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

export default FollowedPost
