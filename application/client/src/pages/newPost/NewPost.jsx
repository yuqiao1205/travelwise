import React, { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../context/authContext'
import { themes } from '../../config/themes.js'
import './newPost.css'
import { useNavigate } from 'react-router-dom'
// import { themeCheckboxes } from './postlib'

const NewPost = () => {
  const Navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  const [isAuthenticated] = useState(!!currentUser)
  const [desc, setDesc] = useState('')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [cat, setCategory] = useState('')
  const [selectedThemes, setSelectedThemes] = useState([])

  const handleThemeChange = (themeId) => {
    const themeName = themes.find(theme => theme.tid === themeId)?.name
    if (!themeName) return

    setSelectedThemes(prevThemes => {
      if (prevThemes.includes(themeName)) {
        return prevThemes.filter(name => name !== themeName)
      } else {
        return [...prevThemes, themeName]
      }
    })
  }

  // Render the checkboxes for themes
  const themeCheckboxes = themes.map(theme => (
    <div key={theme.tid} className='theme'>
      <input
        type='checkbox'
        checked={selectedThemes.includes(theme.name)}
        onChange={() => handleThemeChange(theme.tid)}
        id={`theme-${theme.tid}`}
      />
      <label htmlFor={`theme-${theme.tid}`}>{theme.name}</label>
    </div>
  ))

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
  const [errorMessages, setErrorMessage] = useState([])

  const handlePublishClick = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      // Handle authentication error
      Navigate('/login')
    }

    if (!file) {
      // Set an error message indicating that a file selection is required
      setErrorMessage(['Please select an image file before submitting.'])
      setTimeout(() => {
        setErrorMessage([])
      }, 3000)
      return // Exit the function early
    }

    try {
      const uploadResult = await upload()
      const postData = {
        title,
        desc,
        cat,
        img: uploadResult?.filename || '',
        thumbnail: uploadResult?.thumbnail || '',
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        selectedThemes
      }

      // Create new post
      await axios.post('/posts', postData)
      // Redirect to home page or show success message
      Navigate('/')
      // Implement the redirection or success message display based on your UI/UX design
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

  return (
    <>
      <div className='create-post-container'>
        <h2 className='create-title'>Creat Your Own Post Here</h2>
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
              <div className='newpost-category'>{themeCheckboxes}</div>
              {/* <div className='newpost-category'>{themeCheckboxes(themes, selectedThemes, handleThemeChange)}</div> */}

              <button className='publishbutton' onClick={handlePublishClick}>Publish</button>
              {errorMessages.length > 0 && (
                <div className='backend-errors'>
                  {errorMessages.map((error, index) => (
                    <p key={index} className='new-post-errors'>{error}</p>
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

export default NewPost
