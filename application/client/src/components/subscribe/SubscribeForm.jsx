import React, { useState } from 'react'
import axios from 'axios'
import './subscribeform.css'

const SubscribeForm = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage('')
    }, 5000) // Message will disappear after 2000 milliseconds (2 seconds)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    // Data validation
    if (!email.trim()) {
      setIsSubmitting(false)
      return showMessage('Email is required.')
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsSubmitting(false)
      return showMessage('Invalid email format.')
    }

    try {
      await axios.post('/subscriptions/subscribe', { email })
      console.log('Subscribed successfully with email:', email)
      showMessage('Subscribed successfully! Thank you for subscribing!')
    } catch (error) {
      console.error('Subscription failed:', error)

      if (error.response && error.response.status === 409) {
        showMessage('You are already subscribed with this email.')
      } else {
        showMessage('Subscription failed. Please try again.')
      }
    } finally {
      setEmail('')
      setIsSubmitting(false)
    }
  }

  // const handleSubscribe = async (e) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)
  //   setMessage('')

  //   try {
  //     await axios.post('/subscriptions/subscribe', { email })
  //     console.log('Subscribed successfully with email:', email)
  //     showMessage('Subscribed successfully!Thank you for subscribing!')
  //   } catch (error) {
  //     console.error('Subscription failed:', error)

  //     if (error.response && error.response.status === 409) {
  //       showMessage('You are already subscribed with this email.')
  //     } else {
  //       showMessage('Subscription failed. Please try again.')
  //     }
  //   } finally {
  //     setEmail('')
  //     setIsSubmitting(false)
  //   }
  // }

  const handleCancel = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    axios.delete('/subscriptions/unsubscribe', { data: { email } })
      .then(response => {
        // Handle success
        console.log('Unsubscribe successful:', response.data)
        showMessage('Unsubscribed successfully! Thank you for being with us.')
      })
      .catch(error => {
        // Handle error
        console.error('Unsubscribe error:', error)
        if (error.response) {
          // The server responded with a status code that falls out of the range of 2xx
          console.log('Error data:', error.response.data)
          console.log('Error status:', error.response.status)
          showMessage(`Unsubscription failed: ${error.response.data.message}`)
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error request:', error.request)
          showMessage('Unsubscription failed. No response from the server.')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message:', error.message)
          showMessage('Unsubscription failed due to a request error.')
        }
      })
      .finally(() => {
        setEmail('')
        setIsSubmitting(false)
      })
  }

  return (
    <div className='subs-container'>
      <h4 className='subs-subheading'>Get the newest posts to your box</h4>
      <form className='subs-form-container' onSubmit={handleSubscribe}>
        <input className='subs-input-field'
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <button className='subscribe-button' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Subscribe'}
        </button>
        <button className='unsubscribe-button' onClick={handleCancel} disabled={isSubmitting}>
          Cancel Subscription
        </button>
      </form>
      <div className='error-message'>
        {message && <span>{message}</span>}
      </div>
    </div>
  )
}

export default SubscribeForm
