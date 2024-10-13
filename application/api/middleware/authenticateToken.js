import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secretkey = process.env.Secret_Key

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated!' })
  }

  try {
    const userInfo = jwt.verify(token, secretkey)
    req.user = userInfo
    next()
  } catch (err) {
    console.error('Error:', err)
    return res.status(403).json({ message: 'Token is invalid or expired' })
  }
}

export const authProtector = {
  authenticateToken
}
