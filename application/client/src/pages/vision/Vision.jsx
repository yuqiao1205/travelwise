import React, { useState, useRef } from 'react'
import axios from 'axios' // Import Axios
import './vision.css'

const Vision = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setError('')
      setImage(null)
      setImageUrl('')
      return
    }

    setImage(file)

    try {
      const reader = new FileReader()
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          setImageUrl(reader.result)
          setError('')
        } else {
          setImageUrl('')
          setError('Invalid file type')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error:', error)
      console.log('file.type:', file)
      setError('Failed to load image')
    }
  }

  const submitImage = async () => {
    if (!image) {
      setError('Please upload an image')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await axios.post('/vision', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.error) {
        throw new Error(response.data.error)
      }

      setDescription(response.data.answer)
    } catch (error) {
      console.error('Error:', error)
      setError(error.response.data.error || error.message)
    }
  }

  const refreshInput = () => {
    setImage(null)
    setImageUrl('')
    setError('')
    setDescription('') // clear the description as well
  }

  const handleSelectFile = () => {
    fileInputRef.current.click()
    console.log('fileInputRef.current:', fileInputRef.current)
  }

  return (
    <>
      <div className='img-dialog'>
        <div className='img-question'>
          <label htmlFor='image'>Upload Your Destination Image to Know Where It Is!</label>

          <input
            type='file'
            id='file'
            accept='image/*'
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <button onClick={handleSelectFile}>Select File</button>
        </div>
        {error && <span className='img-error'>{error}</span>}

        <div className='img-container'>

          <div className='img-answer-container'>
            <p
              className='img-answer-paragraph'
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          </div>
          <div className='img-preview-container'>
            {imageUrl && (!error) && <img className='img-preview' src={imageUrl} alt='Preview' style={{ width: '350px', height: '379px' }} />}
          </div>
        </div>
        <div className='img-buttons'>
          {/* dynamically disable this next button when no image */}
          <button className='img-button1' onClick={submitImage} disabled={!imageUrl}>Submit</button>
          <button className='img-button2' onClick={refreshInput}>Reset</button>
        </div>
      </div>
    </>
  )
}

export default Vision
