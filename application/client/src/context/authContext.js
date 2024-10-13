import axios from 'axios'
import { createContext, useEffect, useState, React } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    // It is initialized with the user data retrieved from localStorage or set to null if user is not logged in.
    //  parse the stored value as JSON with JSON.parse() and pass it to useState().
    JSON.parse(localStorage.getItem('user')) || null
  )

  const login = async (inputs) => {
    const res = await axios.post('/auth/login', inputs)
    setCurrentUser(res.data)
  }

  const logout = async () => {
    await axios.post('/auth/logout')
    setCurrentUser(null)
    localStorage.removeItem('user')
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthContextProvider.propTypes = {
  children: PropTypes.node
}
