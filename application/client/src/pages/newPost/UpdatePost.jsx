import React, { useState, useEffect, useContext } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import './newPost.css'
import { themes } from '../../config/themes.js'
import { themeCheckboxes } from './postlib'

const UpdatePost = () => {
  console.log('post component is rendering')
  const [state, setState] = useState(useLocation().state)
  console.log(state)

  const postId = new URLSearchParams(useLocation().search).get('edit')

  const [previousFilename, setPreviousFilename] = useState('')
  const [previousThumbnail, setPreviousThumbnail] = useState('')

  useEffect(() => {
    if (state) {
      setPreviousFilename(state.img)
      setPreviousThumbnail(state.thumbnail)
    }
  }, [state])

  useEffect(() => {
    if (postId) {
      // Fetch the post from the server
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/posts/${postId}`)
          console.log('Fetched post:', res.data)
          // Set the state with the fetched post
          setState(res.data)
        } catch (err) {
          console.error('Error fetching post:', err)
          // Handle error if needed
        }
      }
      fetchPost()
    }
  }, [postId])

  const tagsToThemes = (state) => {
    console.log('state:', state)
    const tags = state?.tags
    // tags is a comma separated string of theme ids, e.g '1, 3, 7'
    // output should list of theme names ['Urban', 'Nature', 'Food']
    // use the themes array from the config file to translate the ids to names
    console.log('tags:', tags)
    if (!tags) return []
    const ids = tags.split(',').map(Number)
    console.log('ids:', ids)
    const selectedThemes = ids.map(id => themes.find(theme => theme.tid === id).name)
    console.log('selectedThemes:', selectedThemes)
    return selectedThemes
  }

  // if state is not null then use state.title else use empty string means needs add new post
  const [desc, setDesc] = useState(state?.desc || '')
  const [title, setTitle] = useState(state?.title || '')
  const [file, setFile] = useState(state?.img || null)
  const [cat, setCategory] = useState(state?.cat || '')
  const [selectedThemes, setSelectedThemes] = useState(state !== undefined ? tagsToThemes(state) : []) // Add selected themes

  const { currentUser } = useContext(AuthContext)

  // Add authentication state
  const [isAuthenticated] = useState(!!currentUser)

  const defaultImageUrl = 'https://picsum.photos/id/16/300'
  // const [error, setError] = useState('');

  const navigate = useNavigate()

  const parseToIntArray = (str) => {
    // Check if str is a string and not empty
    if (typeof str === 'string' && str.trim() !== '') {
      // Split the input string by commas (,) to create an array of substrings
      const substrings = str.split(',')

      // Use the map function to convert each substring into an integer
      const intArray = substrings.map(function (substring) {
        return parseInt(substring, 10) // Use parseInt to parse each substring as an integer
      })

      return intArray
    } else {
      // If str is not a string or is empty, return an empty array
      return []
    }
  }

  useEffect(() => {
    // Check if state has selectedThemes and if it's an array
    console.log('Current State1:', state)
    console.log('Current State2:', state?.tags)
    const tags = parseToIntArray(state?.tags)
    console.log('Current State3:', Array.isArray(tags))
    if (tags && Array.isArray(tags)) {
      console.log('Selected Themes:', tags)
      // Convert theme IDs to theme names
      const loadedThemes = tags.map(tid =>
        themes.find(theme => theme.tid === tid)?.name
      ).filter(Boolean) // Remove any undefined entries
      console.log('Loaded themes:', loadedThemes)
      setSelectedThemes(loadedThemes)
    }
  }, [state])

  const handleThemeChange = (themeId) => {
    const themeName = themes.find(theme => theme.tid === themeId)?.name
    if (!themeName) return // Theme not found

    setSelectedThemes(prevThemes => {
      if (prevThemes.includes(themeName)) {
        return prevThemes.filter(name => name !== themeName)
      } else {
        return [...prevThemes, themeName]
      }
    })
  }

  const [uploadError, setUploadError] = useState('')
  const upload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload', formData)
      setUploadError('') // Clear any previous upload error
      return res.data
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.error) {
        setUploadError(err.response.data.error || 'An error occurred while uploading the image')
      } else {
        setUploadError('Failed to upload image')
      }
    }
  }

  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError('') // Clear the error message after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup the timer
    }
  }, [uploadError])

  const [errorMessages, setErrorMessage] = useState([])

  const handlePublishClick = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Check if a file has been selected
    if (!file) {
    // Set an error message indicating that a file selection is required
      setErrorMessage(['Please select an image file before submitting.'])
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
      return // Exit the function early
    }

    const isNotNewFile = !(file && file !== previousFilename)
    // if file is null then upload file and get url else use default image url

    const uploadFunc = async () => {
      if (isNotNewFile) {
        return [previousFilename, previousThumbnail]
      } else {
        const uploadResult = await upload()
        return [uploadResult?.filename || defaultImageUrl, uploadResult?.thumbnail || defaultImageUrl]
      }
    }

    const [imgUrl, thumbnailUrl] = await uploadFunc()

    const postData = {
      title,
      desc,
      cat,
      img: isNotNewFile ? previousFilename : imgUrl || file || '',
      thumbnail: isNotNewFile ? previousThumbnail : thumbnailUrl || file || '',

      // img: imgUrl || file || '',
      // thumbnail: thumbnailUrl || file || '',
      date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      selectedThemes // Add selected themes
    }

    try {
      if (state) {
        // Update existing post
        await axios.put(`/posts/${state.id}`, postData)

        navigate(`/singlepost/${state.id}`)
      }
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data && err.response.data.errors) {
        // Map each error to its message and update the state
        const errorMessages = err.response.data.errors.map(error => error.msg)
        setErrorMessage(errorMessages)
      } else {
        // Handle other errors (network issues, etc.)
        setErrorMessage(['An unexpected error occurred. Please try again.'])
      }
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
    }
  }

  function handleFileChange (e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setUploadError('Please select an image file.')
        setFile(null)
      } else {
        setUploadError('') // Clear previous errors
        setFile(selectedFile) // Proceed to set the file
      }
    } else {
      setFile(null) // Clear file if none is selected
    }
  }

  return (
    <>
      <div className='create-post-container-update'>
        <h2 className='create-title1'>Update Your Own Post Here</h2>
        <div className='create-post'>
          <div className='post-content'>
            <input className='post-title-input' type='text' value={title} placeholder='Type Title Here' onChange={e => setTitle(e.target.value)}></input>
            <div className='editorContainer'>
              <ReactQuill theme='snow' placeholder=' Type Your Post Content Here' value={desc} onChange={setDesc}/>

            </div>

          </div>

          <div className='newpost-menu'>
            <div className='newpost-item'>
              <span>
                <h2 className='select-text'>Select Image</h2><br/>
              </span>
              <input required style={{ display: 'none' }} type='file' name='file' id='file'
                onChange={handleFileChange} >
              </input>
              <div className='upload-img-button'>
                <label className='uploadimg' htmlFor='file'>
            Upload Image</label>
                <div className='upload-imgname'>
                  {file && <span>{file.name}</span>}
                  {uploadError && <span className='upload-error-message'>{uploadError}</span>}
                </div>
              </div>
            </div>
            <div className='newpost-item'>
              <h2 className='select-text'>Select Regions</h2>
              <div className='newpost-category'>
                <input type='radio' checked={cat === 'Asia'} name='cat' value='Asia' id='asia' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='asia'>Asia</label></div>
              <div className='newpost-category'>
                <input type='radio' checked={cat === 'America'} name='cat' value='America' id='America' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='america'>America</label></div>
              <div className='newpost-category'>
                <input type='radio' checked={cat === 'Europe'} name='cat' value='Europe' id='Europe' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='europe'>Europe</label></div>
              <div className='newpost-category'>
                <input type='radio' checked={cat === 'Africa'} name='cat' value='Africa' id='Africa' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='africa'>Africa</label></div>
              <div className='newpost-category'>
                <input type='radio'checked={cat === 'Caribbean'} name='cat' value='Caribbean' id='Caribbean' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='caribben'>Caribbean</label></div>
              <div className='newpost-category'>
                <input type='radio'checked={cat === 'Middleeast'} name='cat' value='Middleeast' id='Middleeast' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='middleeast'>Middle East</label></div>
              <div className='newpost-category'>
                <input type='radio'checked={cat === 'Other'} name='cat' value='Other' id='Other' onChange={e => setCategory(e.target.value)}></input>
                <label htmlFor='other'>Other</label></div><br/>
              <h2 className='select-text'>Select Themes</h2>
              <div className='newpost-category'>{themeCheckboxes(themes, selectedThemes, handleThemeChange)}</div>

              <button className='publishbutton' onClick={handlePublishClick}>Publish</button>
              {errorMessages.length > 0 && (
                <div className="backend-errors">
                  {errorMessages.map((error, index) => (
                    <p key={index} className="error">{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdatePost
