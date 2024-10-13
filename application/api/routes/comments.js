import express from 'express'
import { getComments, addComment, deleteComment, addReplyToComment } from '../controllers/comment.js'
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', getComments)
router.post('/', authenticateToken, addComment)
router.delete('/:id', authenticateToken, deleteComment)
router.post('/reply', authenticateToken, addReplyToComment)

export default router
