import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Singlepost from '../../components/singlepost/Singlepost'
import Menu from '../../components/menu/Menu'
// import Header2 from '../../components/header2/Header2'
import './detail.css'

const Detail = () => {
  const [post, setPost] = useState({})
  const [cat, setCat] = useState('')
  const location = useLocation()

  const postId = location.pathname.split('/')[2]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`)
        console.log('res.data:', res.data)
        setPost(res.data)
        setCat(res.data.cat) // updae the category after fetching the post
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [postId])

  return (
    <>
      <div className='detail'>
        {/* <Singlepost post={post} handleDelete={handleDelete} /> */}
        <Singlepost post={post} />
        <Menu key={cat} cat={cat} />
      </div>
    </>
  )
}

export default Detail
