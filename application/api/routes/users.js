import express from 'express'
import { getUser, updateUser, deleteUser } from '../controllers/user.js'
import { authenticateToken } from '../middleware/authenticateToken.js'
import { check } from 'express-validator' // Import express-validator

const updateUserInfoValidation = [
  check('email')
    .isEmail().withMessage('Invalid email')
    .notEmpty().withMessage('Email is required'),

  check('nickname')
    .notEmpty().withMessage('Nickname is required'),

  check('city')
    .notEmpty().withMessage('City is required'),

  // For interest, first check if it's optional, then apply length validation if it's provided
  check('interest')
    .optional({ nullable: true, checkFalsy: true }) // Mark as optional
    .isLength({ max: 100 }).withMessage('Interest must not be longer than 100 characters'), // Apply validation and message if provided

  // For fullname, the optional check is correctly placed, but ensure validation follows it directly
  check('fullname')
    .optional({ checkFalsy: true }) // Mark as optional
    .isLength({ min: 1 }).withMessage('Full name cannot be empty if provided') // Validate length if provided
]
const router = express.Router()
router.get('/:userId', getUser)
router.put('/', authenticateToken, updateUserInfoValidation, updateUser)
router.delete('/:userId', authenticateToken, deleteUser)

export default router
