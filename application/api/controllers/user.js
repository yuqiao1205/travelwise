import { users } from '../services/user.js'
import { validationResult } from 'express-validator'
// import { authProtector } from '../middleware/authenticateToken.js'

export const getUser = async (req, res) => {
  const userId = req.params.userId // Extracts userId from the URL parameters

  try {
    const user = await users.getUser(userId) // Await the promise from the user service
    if (user) {
      const { password, ...info } = user // Destructure to exclude the password from the response
      res.status(200).json(info) // Return the user info without the password
    } else {
      res.status(404).json('User not found!') // User not found case
    }
  } catch (err) {
    // console.error('Error fetching user:', err) // Log any errors
    res.status(500).json({ error: 'Internal server error.' }) // Return a server error response
  }
}

export const updateUser = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const { city, img, email, nickname, fullname, interest } = req.body // Extract user details from the request body
  const errors = validationResult(req) // Extract validation errors from the request

  // Check if there are validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // Call updateUser without considering the password
    const success = await users.updateUser(userId, city, img, email, nickname, fullname, interest)

    if (success) {
      return res.status(200).json({ msg: 'User has been updated!' })
    } else {
      // Use an errors array for consistency
      return res.status(400).json({ errors: [{ msg: 'Invalid field' }] })
    }
  } catch (err) {
    // console.error('Error updating user:', err)
    // Return a structured error response similar to validation errors
    return res.status(500).json({ errors: [{ msg: 'Server error', error: err.message }] })
  }
}

export const deleteUser = async (req, res) => {
  const userIdFromToken = req.user.id // User ID obtained from req.user
  const userIdFromParams = parseInt(req.params.userId) // Convert userId from route parameter to integer

  // Check if the user is trying to delete their own account
  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json('You can only delete your own account!')
  }

  try {
    const success = await users.deleteUser(userIdFromParams) // Await the promise from deleteUser operation
    if (success) {
      return res.status(200).json('User has been deleted successfully!')
    } else {
      return res.status(404).json('User not found!') // Handle case where user does not exist
    }
  } catch (err) {
    // console.error('Error deleting user:', err) // Log any errors that occur during deletion
    return res.status(500).json(err) // Return a server error response
  }
}

// export const authenticatedDeleteUser = [authProtector.authenticateToken, deleteUser]
