import express from 'express'
import { getWeather, getCityInfo } from '../controllers/weather.js'

const router = express.Router()
router.get('/', getWeather)
router.get('/city', getCityInfo)

export default router
