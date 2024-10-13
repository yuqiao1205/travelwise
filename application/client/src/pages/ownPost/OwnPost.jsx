import Edit from '../../img/edit.png'
import Del from '../../img/del.png'
import Header2 from '../../components/header2/Header2'
import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import './ownpost.css'
import Paging from '../../components/pagination/Paging'
import { Table } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

const OwnPost = () => {
  const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(0) // Total pages

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if currentUser is available before making the request
        if (currentUser) {
          const res = await axios.get(
            `/posts/user/${currentUser.id}?page=${currentPage}`
          )
          setPosts(res.data.posts)
          setTotalPages(res.data.totalPages)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [currentUser?.id, currentPage])

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`)
      // Remove the deleted post from the state to update the UI
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      // Refetch the posts to stay on the same page
      const res = await axios.get(`/posts/user/${currentUser?.id || ''}`)
      setPosts(res.data.posts)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <Header2 />
      <div className="ownpost">
        <h2>Your Posts List</h2>
        <Table striped bordered hover> {/* Add Bootstrap table class names */}
          <thead>
            <tr>
              <th style={{ width: '600px' }}>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
                </td>
                {/* <td>{moment(post.date).fromNow()}</td> */}
                <td className='time-cell'>{new Date(post.date).toLocaleString()}</td>
                <td>
                  {currentUser?.id === post.userId && ( // Update the check
                    <div className="edit">
                      <Link to={`/update?edit=${post.id}`} state={post}>
                        <img className='action-img' src={Edit} alt="Edit" />
                      </Link>

                      <img className='action-img'
                        src={Del}
                        alt="Delete"
                        onClick={() => handleDelete(post.id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Pagination buttons */}
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

// return (
//   <>
//     <Header2 />
//     <div className="ownpost">
//       <table>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {posts.map((post) => (
//             <tr key={post.id}>
//               <td>
//                 <Link to={`/singlepost/${post.id}`}>{post.title}</Link>
//               </td>
//               {/* <td>{moment(post.date).fromNow()}</td> */}
//               <td>{new Date(post.date).toLocaleString()}</td>
//               <td>
//                 {currentUser?.id === post.userId && ( // Update the check
//                   <div className="edit">
//                     <Link to={`/write?edit=${post.id}`} state={post}>
//                       <img src={Edit} alt="Edit" />
//                     </Link>

//                     <img
//                       src={Del}
//                       alt="Delete"
//                       onClick={() => handleDelete(post.id)}
//                     />
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {/* Pagination buttons */}
//       {/* Pagination buttons */}

//       <div className="paging">
//         <Paging
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   </>
// )
// }

export default OwnPost

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Check if currentUser is available before making the request
//       if (currentUser) {
//         const res = await axios.get(`/posts/user/${currentUser.id}`)
//         setPosts(res.data)
//       }
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   fetchData()
// }, [currentUser?.id]) // Update the dependency array
