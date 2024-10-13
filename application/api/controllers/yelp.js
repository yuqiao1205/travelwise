import { yelp } from '../services/yelp.js'

export async function getBusinesses (req, res) {
  const { term, location } = req.query
  const page = req.query.page || 1
  try {
    if (!term || !location) {
      return res.status(400).json({ error: 'Both "term" and "location" parameters are required.' })
    }

    const data = await yelp.fetchBusinesses(term, location, page)
    res.json(data)
  } catch (error) {
    if (error.data.error.code === 'LOCATION_NOT_FOUND') {
      return res.status(400).json({ error: `Location "${location}" not found` })
    } else {
      console.error('Error fetching businesses:', error)
      res.status(500).json({ error: 'An error occurred while fetching businesses' })
    }
  }
}
