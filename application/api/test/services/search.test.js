// Import necessary libraries and modules
import { search } from '../../services/search'
import { db } from '../../db'

// jest.mock('../../db.js', () => ({
//   query: jest.fn()
// }))

describe('searchServices', () => {
  let queryStub

  beforeAll(() => {
    // Stub the query function of mysql2's default export using Testdouble.js
    queryStub = db.query
  })

  afterEach(() => {
    // Restore the original query function after each test using Testdouble.js
    // queryStub is a sinon stub
    queryStub.resetHistory()
  })

  describe('getSearch', () => {
    // it('successfully retrieves search results', async () => {
    //   const mockData = [{ id: 1, title: 'Test Post', username: 'testuser' }]
    //   const mockTotalData = [{ total: 1 }]
    //   db.query = jest.fn().mockImplementationOnce((sql, params, callback) => { callback(null, mockData) })
    //     .mockImplementationOnce((sql, callback) => callback(null, mockTotalData))

    //   const result = await search.getSearch('test', 1, 10)

    //   expect(result.data).toEqual(mockData)
    //   expect(result.total).toBe(1)
    //   expect(result.totalPages).toBe(1)
    //   expect(db.query).toHaveBeenCalledTimes(2)
    // })

    it('successfully retrieves search results with no filter', async () => {
      const searchTerm = 'test'
      const page = 1
      const limit = 10
      const mockData = [{ id: 1, title: 'Test Post', username: 'testuser' }]
      const mockTotalData = [{ total: 1 }]
      db.query = jest.fn()
        .mockImplementationOnce((sql, params, callback) => callback(null, mockData))
        .mockImplementationOnce((sql, callback) => callback(null, mockTotalData))

      const result = await search.getSearch(searchTerm, '', page, limit)

      expect(result.data).toEqual(mockData)
      expect(result.total).toBe(1)
      expect(result.totalPages).toBe(1)
      expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('successfully retrieves search results with specific filter', async () => {
      const searchTerm = 'test'
      const filter = 'username'
      const page = 1
      const limit = 10
      const mockData = [{ id: 1, username: 'testuser' }]
      const mockTotalData = [{ total: 1 }]
      db.query = jest.fn()
        .mockImplementationOnce((sql, params, callback) => callback(null, mockData))
        .mockImplementationOnce((sql, callback) => callback(null, mockTotalData))

      const result = await search.getSearch(searchTerm, filter, page, limit)

      expect(result.data).toEqual(mockData)
      expect(result.total).toBe(1)
      expect(result.totalPages).toBe(1)
      expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('handles errors during search query execution', async () => {
      const searchTerm = 'test'
      const filter = ''
      const page = 1
      const limit = 10
      db.query = jest.fn().mockImplementationOnce((sql, params, callback) => { callback(new Error('Query failed')) })

      await expect(search.getSearch(searchTerm, filter, page, limit)).rejects.toThrow('Query failed')
      expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('handles errors during total count query execution', async () => {
      db.query = jest.fn().mockImplementationOnce((sql, params, callback) => { callback(null, [{ id: 1, title: 'Test Post', username: 'testuser' }]) })
        .mockImplementationOnce((sql, callback) => { callback(new Error('Query failed')) })

      await expect(search.getSearch('test', 1, 10)).rejects.toThrow('Query failed')
      expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('sets filter to "title" if filter is neither "cat" nor "title"', async () => {
      const searchTerm = 'test'
      const filter = 'title'
      const page = 1
      const limit = 10
      const mockData = [{ id: 1, title: 'Test Post', username: 'testuser' }]
      const mockTotalData = [{ total: 1 }]
      db.query = jest.fn()
        .mockImplementationOnce((sql, params, callback) => callback(null, mockData))
        .mockImplementationOnce((sql, callback) => callback(null, mockTotalData))

      const result = await search.getSearch(searchTerm, filter, page, limit)

      expect(result.data).toEqual(mockData)
      expect(result.total).toBe(1)
      expect(result.totalPages).toBe(1)
      expect(db.query).toHaveBeenCalledTimes(2)
      expect(filter).toBe('title') // Ensure filter is set to 'title'
    })

  // Add more tests as needed to cover different aspects of the function
  })
})
