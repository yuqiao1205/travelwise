import express from 'express'
import { getCountryDetails } from '../controllers/countryInfo.js'

const router = express.Router()
router.get('/', getCountryDetails)

export default router
