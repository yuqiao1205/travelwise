import './login.css'
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })
  const [err, setError] = useState(null)

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(inputs)
      navigate('/')
    } catch (err) {
      setError(err.response.data)
    }
    setTimeout(() => {
      setError('')
    }, 3000)
  }
  return (
    
    <div className='login'>
      <span className='loginTitle'>Login</span>
      <span><LoginOutlinedIcon /> Welcome back to Your Account</span>
      <form className='loginForm'>
        <label>Username</label>
        <input className='loginInput' required type='text' placeholder='username' name='username' onChange={handleChange}/>
        <br/>
        <label>Password</label>
        <input className='loginInput' required type='password' placeholder='password' name='password' onChange={handleChange}/>

        <button className='loginButton' onClick={handleSubmit}>Login</button>
        <br/>
        {err && <p className='errormessage'>{err}</p>}
        <br/>
        <span className='registerlink'>
          Don&apos;t you have an account?
          <Link className='linktoreg' to='/register'>Register</Link> or back to
          <Link className='linktohome' to='/'> Home</Link>
        </span>

      </form>
      
    </div>
    
  )
}

export default Login
