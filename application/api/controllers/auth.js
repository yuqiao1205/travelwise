import jwt from 'jsonwebtoken'
import { authService } from '../services/auth.js'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'

dotenv.config()

const secretkey = process.env.Secret_Key

// const secretkey = 'c1b586dc616452c1ced1f6bb65af186c'

export const register = async (req, res) => {
  try {
    const { email, username, password, nickname } = req.body
    // Validate the request
    const err = validationResult(req)

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() })
    }

    const existingUsers = await authService.checkExistingUser(email, username)

    if (existingUsers.length) {
      return res.status(409).json('User already exists!')
    }

    await authService.createUser(username, email, password, nickname)

    return res.status(200).json('User has been created.')
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const userData = await authService.findUserByUsername(username)

    if (userData.length === 0) {
      return res.status(404).json('User not found!')
    }

    const isPasswordCorrect = authService.comparePassword(password, userData[0].password)

    if (!isPasswordCorrect) {
      return res.status(400).json('Wrong username or password!')
    }

    const token = jwt.sign({ id: userData[0].id }, secretkey, {
      // expiresIn: '1d'
    })
    const { password: userPassword, ...other } = userData[0]

    res
      .cookie('access_token', token, {
        httpOnly: true
      })
      .status(200)
      .json(other)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'none',
    secure: true
  }).status(200).json('User has been logged out.')
}
