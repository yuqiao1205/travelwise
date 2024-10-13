import express from 'express'
import { authenticateToken } from '../middleware/authenticateToken.js'
import { body, validationResult } from 'express-validator'

import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  getOwnPosts,
  getFollowerPosts,
  getPostsByTagId

} from '../controllers/post.js'

const router = express.Router()

// Validation rules for a new or updated post
const postValidationRules = [
  body('title').trim().notEmpty().withMessage('Title cannot be empty.'),
  body('desc').trim().notEmpty().withMessage('Description cannot be empty.'),
  body('cat').notEmpty().withMessage('Please select a region.'),
  body('selectedThemes').isArray({ min: 1 }).withMessage('Please select at least one theme.')
  // Add additional validation rules as necessary
]

// Function to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

router.post('/', authenticateToken, postValidationRules, validate, addPost)// addpost
router.put('/:id', authenticateToken, postValidationRules, validate, updatePost)// updatepost

router.get('/', getPosts)
router.get('/:id', getPost)
router.delete('/:id', authenticateToken, deletePost)
router.get('/user/:userid', authenticateToken, getOwnPosts)
router.get('/followed/:userid', authenticateToken, getFollowerPosts)
router.get('/tag/:tid', getPostsByTagId)

export default router
