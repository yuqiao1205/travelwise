import express from 'express'
import { check } from 'express-validator' // Import express-validator
import { register, login, logout } from '../controllers/auth.js'

const router = express.Router()

const registerValidation = [
  check('email').isEmail().withMessage('Invalid email'),
  check('username').notEmpty().withMessage('Username is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('nickname').notEmpty().withMessage('Nickname is required')
]

router.post('/register', registerValidation, register)

router.post('/login', login)
router.post('/logout', logout)

export default router
