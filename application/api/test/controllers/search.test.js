// Import the controller and the search service
import * as searchController from '../../controllers/search'
import * as searchService from '../../services/search'

// Mock the search service
jest.mock('../../services/search.js')

describe('Search Controller test - getSearch', () => {
  // Mock Express.js req and res objects
  let mockReq, mockRes

  beforeEach(() => {
    mockReq = {
      query: {}
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
  })

  it('should return 400 if no search term is provided', async () => {
    mockReq.query = {}

    await searchController.getSearch(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.send).toHaveBeenCalledWith('Search term is required')
  })

  it('should return 200 and search results on success', async () => {
    const mockSearchResults = { results: ['item1', 'item2'], page: 1, totalPages: 5 }
    searchService.getSearch.mockResolvedValue(mockSearchResults)
    mockReq.query = { q: 'test', page: '1', filter: 'filter1' }

    await searchController.getSearch(mockReq, mockRes)

    expect(searchService.getSearch).toHaveBeenCalledWith('test', 'filter1', 1, 3)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(mockSearchResults)
  })

  it('should handle requests without filter parameter', async () => {
    const mockSearchResults = { results: ['item1', 'item2'], page: 1, totalPages: 5 }
    searchService.getSearch.mockResolvedValue(mockSearchResults)
    mockReq.query = { q: 'test', page: '1' }

    await searchController.getSearch(mockReq, mockRes)

    // Note: Since 'filter' is not provided, it should be 'undefined' or handled accordingly in your service
    expect(searchService.getSearch).toHaveBeenCalledWith('test', undefined, 1, 3)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(mockSearchResults)
  })

  it('should return 500 on service failure', async () => {
    searchService.getSearch.mockRejectedValue(new Error('Service error'))
    mockReq.query = { q: 'test', page: '1', filter: 'filter1' }

    await searchController.getSearch(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.send).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
