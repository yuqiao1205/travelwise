import express from 'express'
import { getLikes, addLike, deleteLike } from '../controllers/like.js'
import { authenticateToken } from '../middleware/authenticateToken.js'
const router = express.Router()

router.get('/', getLikes)
router.post('/', authenticateToken, addLike)
router.delete('/', authenticateToken, deleteLike)

export default router
