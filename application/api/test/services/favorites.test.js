import sinon from 'sinon'
import { favorites } from '../../services/favorites' // Import the favorites module
import { db } from '../../db'

describe('favorites', () => {
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
  describe('savePostToFavorites', () => {
    it('should resolve with results when post is saved to favorites successfully', async () => {
      const userId = 1
      const postId = 1
      const expectedResults = { insertId: 1, affectedRows: 1 }

      // Mock the db.query function to simulate a successful query
      queryStub.callsFake((sql, values, callback) => {
        callback(null, expectedResults)
      })

      const result = await favorites.savePostToFavorites(userId, postId)

      expect(result).toEqual(expectedResults)
      sinon.assert.calledWith(queryStub, 'INSERT INTO favorites (userId, postId) VALUES (?, ?)', [userId, postId])
    })

    it('should reject with an error when an error occurs during saving post to favorites', async () => {
      const userId = 1
      const postId = 1
      const expectedError = new Error('Database error')

      // Mock the db.query function to simulate an error in the query
      queryStub.callsFake((sql, values, callback) => {
        callback(expectedError, null)
      })

      await expect(favorites.savePostToFavorites(userId, postId)).rejects.toThrow('Database error')
      sinon.assert.calledWith(queryStub, 'INSERT INTO favorites (userId, postId) VALUES (?, ?)', [userId, postId])
    })
  })

  describe('when post is deleted successfully', () => {
    it('should resolve with results when saved post is deleted successfully', async () => {
      const userId = 1
      const postId = 1
      const expectedResults = { affectedRows: 1 }

      // Mock the db.query function to simulate a successful query
      queryStub.callsFake((sql, values, callback) => {
        callback(null, expectedResults)
      })

      const result = await favorites.deleteSavedPost(postId, userId)

      expect(result).toEqual(expectedResults)
      sinon.assert.calledWith(queryStub, 'DELETE FROM favorites WHERE userId = ? AND postId = ?;', [userId, postId])
    })
  })

  describe('when an error occurs during deleting saved post', () => {
    it('should reject with an error when an error occurs during deleting saved post', async () => {
      const userId = 1
      const postId = 1
      const expectedError = new Error('Database error')

      // Mock the db.query function to simulate an error in the query
      queryStub.callsFake((sql, values, callback) => {
        callback(expectedError, null)
      })

      await expect(favorites.deleteSavedPost(postId, userId)).rejects.toThrow('Database error')
      sinon.assert.calledWith(queryStub, 'DELETE FROM favorites WHERE userId = ? AND postId = ?;', [userId, postId])
    })
  })

  it('should resolve with favorite posts and total pages when successful', async () => {
    const userId = 1
    const page = 1
    const desiredPageSize = 2
    const mockPosts = [{ postId: 1, title: 'Post 1' }, { postId: 2, title: 'Post 2' }]
    const mockTotalFavorites = [{ totalFavorites: 6 }]

    // First call simulates fetching posts successfully
    queryStub.onFirstCall().callsFake((sql, values, callback) => callback(null, mockPosts))
    // Second call simulates counting total favorites successfully
    queryStub.onSecondCall().callsFake((sql, values, callback) => callback(null, mockTotalFavorites))

    const result = await favorites.getFavoritePosts(userId, page, desiredPageSize)

    expect(result.posts).toEqual(mockPosts)
    expect(result.totalPages).toEqual(3) // Assuming pageSize is limited to 2, and there are 6 favorites in total
  })

  it('should reject with an error when the first query fails', async () => {
    const userId = 1
    const page = 1
    const desiredPageSize = 2
    const error = new Error('Database error')

    queryStub.onFirstCall().callsFake((sql, values, callback) => callback(error, null))

    await expect(favorites.getFavoritePosts(userId, page, desiredPageSize)).rejects.toThrow('Database error')
  })

  it('should reject with an error when the second query fails', async () => {
    const userId = 1
    const page = 1
    const desiredPageSize = 2
    const mockPosts = [{ postId: 1, title: 'Post 1' }, { postId: 2, title: 'Post 2' }]
    const error = new Error('Database error')

    // First call simulates fetching posts successfully
    queryStub.onFirstCall().callsFake((sql, values, callback) => callback(null, mockPosts))
    // Second call simulates an error on counting total favorites
    queryStub.onSecondCall().callsFake((sql, values, callback) => callback(error, null))

    await expect(favorites.getFavoritePosts(userId, page, desiredPageSize)).rejects.toThrow('Database error')
  })

  //   describe('when favorite posts are retrieved successfully', () => {
  //     it('should resolve with favorite posts and total pages when successful', async () => {
  //       const userId = 1
  //       const page = 1
  //       const desiredPageSize = 2
  //       const expectedPosts = [{ postId: 1, title: 'Post 1' }, { postId: 2, title: 'Post 2' }]
  //       const totalPages = 3

  //       // Mock the db.query function to simulate a successful query
  //       queryStub.onCall(0).callsFake((sql, values, callback) => {
  //         callback(null, expectedPosts)
  //       })

  //       queryStub.onCall(1).callsFake((sql, values, callback) => {
  //         callback(null, [{ totalFavorites: 6 }])
  //       })

  //       const result = await favorites.getFavoritePosts(userId, page, desiredPageSize)

  //       expect(result.posts).toEqual(expectedPosts)
  //       expect(result.totalPages).toEqual(totalPages)
  //       sinon.assert.calledWith(
  //         queryStub.firstCall,
  //         sinon.match.string,
  //         [userId, (page - 1) * desiredPageSize, desiredPageSize]
  //       )
  //       sinon.assert.calledWith(
  //         queryStub.secondCall,
  //         sinon.match.string,
  //         [userId]
  //       )
  //     })
  //   })

  //   describe('when an error occurs during query', () => {
  //     it('should reject with an error when an error occurs during query', async () => {
  //       const userId = 1
  //       const expectedError = new Error('Database error')

  //       // Mock the db.query function to simulate an error in the query
  //       queryStub.callsFake((sql, values, callback) => {
  //         callback(expectedError, null)
  //       })

//       await expect(favorites.getFavoritePosts(userId)).rejects.toThrow('Database error')
//       sinon.assert.calledWith(queryStub, sinon.match.string, [userId])
//     })
//   })
})
