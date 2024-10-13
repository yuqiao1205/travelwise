import express from 'express'
import { sendImg } from '../controllers/vision.js'
const router = express.Router()

router.post('/', sendImg)

export default router
