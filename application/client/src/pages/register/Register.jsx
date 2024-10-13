import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './register.css'


const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const hasErrors = () => {
  // any one of the fields is not ''
    return Object.values(errors).some(err => err !== '')
  }

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]: value
    }))
    // Validate inputs
    const newErrors = { ...errors }
    switch (name) {
    case 'username':
      newErrors.username = value.length < 1 ? 'Username can not be empty' : ''
      break
    case 'nickname':
      newErrors.nickname = value.length < 1 ? 'Nickname can not be empty' : ''
      break
    case 'email':
      newErrors.email = !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email address' : ''
      break
    case 'password':
      newErrors.password = value.length < 6 ? 'Password must be at least 6 characters long' : ''
      break
    case 'confirmPassword':
      newErrors.confirmPassword = value !== inputs.password ? 'Passwords do not match' : ''
      break
    default:
      break
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasErrors()) {
      return
    }

    try {
      await axios.post('/auth/register', inputs)
      navigate('/login')
    } catch (err) {
      console.log(err)
      let otherErrorMessages = ''

      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        otherErrorMessages = err.response.data.errors.map(error => error.msg).join('\n')
      } else {
        otherErrorMessages = err.response.data || 'An error occurred'
      }
      setErrors(prev => ({
        ...prev,
        general: otherErrorMessages
      }))
      setTimeout(() => {
        setErrors(prev => ({
          ...prev,
          general: ''
        }))
      }, 3000)
    }
  }

  return (
    <div className='register'>
      <span className='registerTitle'>Create an Account</span>
      <form className='registerForm' onSubmit={handleSubmit}>
        <label>Username</label>
        <input className='registerInput'
          required
          type='text'
          placeholder='username'
          name='username'
          value={inputs.username}
          onChange={handleChange}
        />
        {errors.username && <p className='errorMessage'>{errors.username}</p>}
        <label>Nickname</label>
        <input className='registerInput'
          required
          type='text'
          placeholder='nickname'
          name='nickname'
          value={inputs.nickname}
          onChange={handleChange}
        />
        {errors.nickname && <p className='errorMessage'>{errors.nickname}</p>}
        <label>Email</label>
        <input className='registerInput'
          required
          type='email'
          placeholder='email'
          name='email'
          value={inputs.email}
          onChange={handleChange}
        />
        {errors.email && <p className='errorMessage'>{errors.email}</p>}
        <label>Password</label>
        <input className='registerInput'
          required
          type='password'
          placeholder='password'
          name='password'
          value={inputs.password}
          onChange={handleChange}
        />
        {errors.password && <p className='errorMessage'>{errors.password}</p>}
        <label>Confirm Password</label>
        <input className='registerInput'
          required
          type='password'
          placeholder='confirm password'
          name='confirmPassword'
          value={inputs.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className='errorMessage'>{errors.confirmPassword}</p>}
        <button className='registerButton' type='submit'>Register</button>
        {errors.general && <p className='errorMessage'>{errors.general}</p>}
        <br />
        <span>
          Do you have an account? <Link to='/login'> Login </Link> or back to
          <Link to='/'> Home</Link>
        </span>
      </form>
    </div>
  )
}

export default Register
