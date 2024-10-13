import express from 'express'
import { getFavoritePosts, savePostToFavorites, deleteSavedPost } from '../controllers/favorites.js'
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/:userId', authenticateToken, getFavoritePosts)
router.post('/', authenticateToken, savePostToFavorites)
router.delete('/', authenticateToken, deleteSavedPost)// by position in url parama

export default router
