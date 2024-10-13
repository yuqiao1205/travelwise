import express from 'express'
import { saveSubscription, removeSubscriber } from '../controllers/subscription.js'

const router = express.Router()
router.post('/subscribe', saveSubscription)
router.delete('/unsubscribe', removeSubscriber)

export default router
