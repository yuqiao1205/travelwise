import { comment } from '../services/comment.js'

export const getComments = async (req, res) => {
  try {
    const postId = req.query.postId
    const comments = await comment.getComments(postId)
    return res.status(200).json(comments)
  } catch (err) {
    // console.error('Error fetching comments:', err)
    return res.status(500).json(err)
  }
}

export const addComment = async (req, res) => {
  try {
    const { desc, postId } = req.body
    const userId = req.user.id // User ID is now obtained from req.user

    const message = await comment.addComment(desc, postId, userId)
    return res.status(200).json({ message })
  } catch (err) {
    // console.error('Error creating comment:', err)
    return res.status(500).json(err)
  }
}

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id // User ID is now obtained from req.user

    const message = await comment.deleteComment(commentId, userId)
    return res.status(200).json({ message })
  } catch (err) {
    // console.error('Error deleting comment:', err)
    return res.status(500).json(err)
  }
}

export const addReplyToComment = async (req, res) => {
  try {
    const { desc, parentCommentId, postId } = req.body
    const userId = req.user.id // User ID is now obtained from req.user

    if (!desc || !parentCommentId || !postId) {
      return res.status(400).json('Missing required parameters')
    }

    await comment.addReplyToComment(desc, parentCommentId, userId, postId)
    return res.status(200).json('Reply has been added.')
  } catch (err) {
    // console.error('Error adding reply:', err)
    return res.status(500).json(err)
  }
}

