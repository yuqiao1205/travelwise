import * as likeService from '../../services/like'
import { db } from '../../db.js'

describe('likeservices', () => {
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

  describe('getLikes', () => {
    it('should resolve with user IDs of likes for a post', async () => {
      const mockLikes = [{ userId: 1 }, { userId: 2 }]
      db.query = jest.fn().mockImplementation((query, values, callback) => {
        callback(null, mockLikes)
      })

      const result = await likeService.getLikes('postId')

      expect(result).toEqual(mockLikes.map(like => like.userId))
      expect(db.query).toHaveBeenCalledWith('SELECT userId FROM likes WHERE postId = ?', ['postId'], expect.any(Function))
    })

    it('should reject if there is a database error', async () => {
      db.query = jest.fn().mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null)
      })

      await expect(likeService.getLikes('postId')).rejects.toThrow('Database error')
    })
  })

  describe('addLike', () => {
    it('should resolve with a success message when a like is added', async () => {
      db.query = jest.fn().mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 })
      })

      const result = await likeService.addLike(1, 'postId')

      expect(result).toEqual('Post has been liked.')
      expect(db.query).toHaveBeenCalledWith('INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)', [1, 'postId'], expect.any(Function))
    })

    it('should reject if there is a database error', async () => {
      db.query = jest.fn().mockImplementation((query, values, callback) => {
        callback(new Error('Database error'), null)
      })

      await expect(likeService.addLike(1, 'postId')).rejects.toThrow('Database error')
    })
  })

  describe('deleteLike', () => {
    it('should resolve with a success message when a like is deleted', async () => {
      db.query = jest.fn().mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 })
      })

      const result = await likeService.deleteLike(1, 'postId')

      expect(result).toEqual('Post has been disliked.')
      expect(db.query).toHaveBeenCalledWith('DELETE FROM likes WHERE `userId` = ? AND `postId` = ?', [1, 'postId'], expect.any(Function))
    })
  })
  it('should reject if there is a database error', async () => {
    db.query = jest.fn().mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null)
    })

    await expect(likeService.deleteLike(1, 'postId')).rejects.toThrow('Database error')
  })
})
