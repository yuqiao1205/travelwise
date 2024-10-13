import { like } from '../services/like.js'

export const getLikes = async (req, res) => {
  const postId = req.query.postId
  try {
    const likes = await like.getLikes(postId)
    return res.status(200).json(likes)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const addLike = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const postId = req.body.postId

  if (!postId) {
    return res.status(400).json('Missing required parameter: postId')
  }
  try {
    const message = await like.addLike(userId, postId)
    return res.status(200).json({ message })
  } catch (err) {
    // Log or handle error as needed
    // console.error('Error adding like:', err);
    return res.status(500).json(err)
  }
}

export const deleteLike = async (req, res) => {
  const userId = req.user.id // User ID obtained from req.user
  const postId = req.query.postId

  if (!postId) {
    return res.status(400).json('Missing required parameter: postId')
  }
  try {
    const message = await like.deleteLike(userId, postId)
    return res.status(200).json({ message })
  } catch (err) {
    // Log or handle error as needed
    // console.error('Error deleting like:', err);
    return res.status(500).json(err)
  }
}
