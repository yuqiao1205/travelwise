import { search } from '../services/search.js'

export const getSearch = async (req, res) => {
  const searchTerm = req.query.q
  const page = parseInt(req.query.page) || 1
  const filter = req.query.filter
  const limit = 3

  if (!searchTerm) {
    return res.status(400).send('Search term is required')
  }

  try {
    // console.log('searchTerm2:', searchTerm, 'filter:', filter, 'page:', page, 'limit:', limit)
    const result = await search.getSearch(searchTerm, filter, page, limit)
    return res.status(200).json(result)
  } catch (err) {
    // console.error('Error executing search query:', err)
    return res.status(500).send(err)
  }
}
