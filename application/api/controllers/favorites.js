import { favorites } from '../services/favorites.js'

export const savePostToFavorites = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const postId = req.body.postId // Assuming postId is sent in the request body

  if (!postId) {
    return res.status(400).json('Missing required parameter: postId')
  }

  try {
    await favorites.savePostToFavorites(userId, postId)
    return res.status(200).json('Post saved to favorites successfully.')
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}


export const deleteSavedPost = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const postId = req.query.postId // Assuming postId is sent in the query

  if (!postId) {
    return res.status(400).json('Missing required parameter: postId')
  }

  try {
    await favorites.deleteSavedPost(postId, userId)
    return res.status(200).json('Post removed from favorites successfully.')
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getFavoritePosts = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const page = parseInt(req.query.page) || 1 // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || Number.MAX_SAFE_INTEGER // Default to MAX_PAGE_SIZE if not specified

  try {
    // Adjusted to pass page and pageSize to the getFavoritePosts function
    const { posts, totalPages } = await favorites.getFavoritePosts(userId, page, pageSize)
    return res.status(200).json({ posts, totalPages })
  } catch (error) {
    // console.error('Error getting favorite posts:', error) // Improved error logging
    return res.status(500).json({ message: 'Error fetching favorite posts', error })
  }
}
