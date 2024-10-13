import { post } from '../services/post.js'
import { notifySubscribers } from './notifySubscribers.js'
import { validationResult } from 'express-validator'

// Pagination helper function
const calculatePagination = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = 6 // Default to 4 posts per page

  // Calculate the offset
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

// get all posts
export const getPosts = async (req, res) => {
  try {
    const cat = req.query.cat
    const { limit, offset } = calculatePagination(req)

    const result = await post.getPosts(cat, limit, offset)

    if (!result) {
      return res.status(500).json({ error: 'Error getting posts.' })
    }

    return res.status(200).json(result) // Return the result a list of objects directly
  } catch (err) {
    console.error('Error getting posts:', err)
    return res.status(500).json()
  }
}

// get posts by tag id which is by theme
export const getPostsByTagId = async (req, res) => {
  const tid = parseInt(req.params.tid) // Convert tid to an integer

  try {
    // Check if tid is a valid number
    if (isNaN(tid) || tid < 1) {
      return res.status(400).json({ message: 'Invalid tag ID provided.' })
    }

    // Calculate pagination values using the helper function
    const { limit, offset } = calculatePagination(req)

    // Fetch posts by tag ID for the specified page
    const data = await post.getPostsByTagId(tid, limit, offset)

    if (!data) {
      // If no data is returned, send a 404 Not Found response
      return res.status(404).json({ message: 'No posts found for the specified tag.' })
    }

    // Send the data with a 200 OK response
    return res.status(200).json(data)
  } catch (err) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error in getPostsByTagId controller:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// get singlepost by id
export const getPost = async (req, res) => {
  try {
    const data = await post.getPost(req.params.id)

    if (!data) {
      return res.status(500).json({ error: 'Error getting posts.' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Error executing query:', err)
    return res.status(500).json({ error: err })
  }
}

// get own posts with pagination feature
export const getOwnPosts = async (req, res) => {
  try {
    // Since the middleware already verified the token, directly use the user info
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1 // Get the page number from query parameters

    // req.query.pageSize may be defined or not
    // if it is not defined, give a large number to pageSize
    const pageSize = parseInt(req.query.pageSize) || Number.MAX_SAFE_INTEGER // Number of posts per page

    // Calculate the skip value to skip the appropriate number of records
    // Fetch posts for the specified user with pagination
    const { posts, totalPages } = await post.getOwnPosts(userId, page, pageSize)

    return res.status(200).json({ posts, totalPages })
  } catch (err) {
    console.error('Error getting own posts:', err)
    return res.status(500).json(err)
  }
}

export const getFollowerPosts = async (req, res) => {
  try {
    // The user's ID is retrieved from req.user, set by the authenticateToken middleware
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1 // Get the page number from query parameters

    // req.query.pageSize may be defined or not
    // if it is not defined, give a large number to pageSize
    const pageSize = parseInt(req.query.pageSize) || Number.MAX_SAFE_INTEGER // Number of posts per page

    // Fetch follower posts for the specified user with pagination
    const { posts, totalPages } = await post.getFollowerPosts(userId, page, pageSize)

    return res.status(200).json({ posts, totalPages })
  } catch (err) {
    console.error('Error getting follower posts:', err)
    return res.status(500).json(err)
  }
}

export const addPost = async (req, res) => {
  // First, check for any validation errors that might have been caught earlier in the middleware
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { title, desc, img, thumbnail, cat, date, selectedThemes } = req.body
    if (!selectedThemes || !Array.isArray(selectedThemes) || selectedThemes.length === 0) {
      return res.status(400).json({ message: 'selectedThemes is undefined or must be non-empty array' })
    }

    const userId = req.user.id // Get user ID from the request object

    const postId = await post.addPost(title, desc, img, thumbnail, cat, date, userId, selectedThemes)
    await notifySubscribers(postId)
    return res.status(200).json({ message: 'Post added successfully and subscribers notified.', postId })
  } catch (err) {
    console.error('Error:', err)
    return res.status(err.status || 500).json({ message: err.message || 'An error occurred' })
  }
}

export const updatePost = (req, res) => {
  // Extract post details and user ID from the request
  const { title, desc, img, thumbnail, cat, selectedThemes } = req.body // Include selectedThemes same as frontend variable name
  const postId = req.params.id
  const userId = req.user.id // User ID is now obtained from req.user

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // If errors exist, return 400 status with errors
    return res.status(400).json({ errors: errors.array() })
  }

  if (!selectedThemes || !Array.isArray(selectedThemes) || selectedThemes.length === 0) {
    return res.status(400).json({ message: 'selectedThemes is undefined or must be non-empty array' })
  }

  post.updatePost(title, desc, img, thumbnail, cat, postId, userId, selectedThemes) // Pass selectedThemes to the updatePost function
    .then((message) => {
      return res.status(200).json({ message: 'Post updated successfully.' })
    })
    .catch((err) => {
      console.error('Error updating post:', err)
      return res.status(500).json(err)
    })
}

export const deletePost = (req, res) => {
  // Retrieve the user's ID and the post ID from the request
  const userId = req.user.id
  const postId = req.params.id

  post.deletePost(postId, userId)
    .then((message) => {
      return res.status(200).json({ message: 'Post deleted successfully.' })
    })
    .catch((err) => {
      console.error('Error deleting post:', err)
      return res.status(500).json(err)
    })
}
