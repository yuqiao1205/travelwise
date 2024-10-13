import express from 'express'
import { getRelationships, addRelationship, deleteRelationship } from '../controllers/relationship.js'
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', getRelationships)
router.post('/', authenticateToken, addRelationship)
router.delete('/', authenticateToken, deleteRelationship)

export default router
