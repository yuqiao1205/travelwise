import { relationship } from '../../services/relationship'
import { db } from '../../db.js'

describe('relationshipServices', () => {
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

  describe('getRelationships', () => {
    it('should resolve with followerUserIds for a given followedUserId', async () => {
      const mockData = [{ followerUserId: 1 }, { followerUserId: 2 }]
      db.query = jest.fn().mockImplementation((sql, params, callback) => {
        callback(null, mockData)
      })

      const result = await relationship.getRelationships('1')
      expect(result).toEqual(mockData.map((item) => item.followerUserId))
      expect(db.query).toHaveBeenCalledWith('SELECT followerUserId FROM relationships WHERE followedUserId = ?', ['1'], expect.any(Function))
    })

    it('should reject if there is a database error', async () => {
      db.query = jest.fn().mockImplementation((sql, params, callback) => {
        callback(new Error('Database error'), null)
      })

      await expect(relationship.getRelationships('1')).rejects.toThrow('Database error')
    })
  })

  describe('addRelationship', () => {
    it('should resolve with "Following" on successful insertion', async () => {
      db.query = jest.fn().mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 })
      })

      const result = await relationship.addRelationship(1, '2')
      expect(result).toEqual('Following')
      expect(db.query).toHaveBeenCalledWith('INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?, ?)', [1, '2'], expect.any(Function))
    })
  })
  it('should reject if there is a database error', async () => {
    db.query = jest.fn().mockImplementation((sql, params, callback) => {
      callback(new Error('Database error'), null)
    })

    await expect(relationship.addRelationship(1, '2')).rejects.toThrow('Database error')
  })

  describe('deleteRelationship', () => {
    it('should resolve with "Unfollow" on successful deletion', async () => {
      db.query = jest.fn().mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 })
      })

      const result = await relationship.deleteRelationship(1, '2')
      expect(result).toEqual('Unfollow')
      expect(db.query).toHaveBeenCalledWith('DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?', [1, '2'], expect.any(Function))
    })

    it('should reject if there is a database error', async () => {
      db.query = jest.fn().mockImplementation((sql, params, callback) => {
        callback(new Error('Database error'), null)
      })

      await expect(relationship.deleteRelationship(1, '2')).rejects.toThrow('Database error')
    })
  })
})
