import sinon from 'sinon'
import bcrypt from 'bcryptjs'
import { authService } from '../../services/auth'
import { db } from '../../db'

const mockUserData = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
    // other user properties here
  }
  // Additional user objects can be added if needed
]

describe('Authentication Service', () => {
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

  describe('checkExistingUser', () => {
    it('should resolve with user data if email or username exists', async () => {
      const email = 'test@example.com'
      const username = 'testuser'

      queryStub.callsFake((q, values, callback) => {
        // Simulate a successful query by returning some data
        callback(null, [mockUserData])
      })

      const result = await authService.checkExistingUser(email, username)

      expect(result).toEqual([[...mockUserData]])
      sinon.assert.calledWith(queryStub, 'SELECT * FROM users WHERE email = ? OR username = ?', [email, username])
    })

    it('should reject with an error if there is an error in the query', async () => {
      const email = 'test@example.com'
      const username = 'testuser'

      queryStub.callsFake((q, values, callback) => {
        // Simulate an error in the query
        callback(new Error('test error'), null)
      })

      await expect(authService.checkExistingUser(email, username)).rejects.toThrow('test error')
      sinon.assert.calledWith(queryStub, 'SELECT * FROM users WHERE email = ? OR username = ?', [email, username])
    })
  })

  describe('createUser', () => {
    it('should resolve with a success message if user creation is successful', async () => {
      const username = 'testuser'
      const email = 'test@example.com'
      const password = 'password123'
      const nickname = 'nick'

      queryStub.callsFake((q, values, callback) => {
        // Simulate a successful user creation
        callback(null)
      })

      const result = await authService.createUser(username, email, password, nickname)

      expect(result).toBe('User has been created.')
      sinon.assert.calledWith(queryStub, 'INSERT INTO users(`username`,`email`,`password`,`nickname`) VALUES (?)', [[username, email, sinon.match.string, nickname]])
    })

    it('should reject with an error if there is an error in user creation', async () => {
      const username = 'testuser'
      const email = 'test@example.com'
      const password = 'password123'
      const nickname = 'nick'

      queryStub.callsFake((q, values, callback) => {
        // Simulate an error in user creation
        callback(new Error('test error'))
      })

      await expect(authService.createUser(username, email, password, nickname)).rejects.toThrow('test error')
      sinon.assert.calledWith(queryStub, 'INSERT INTO users(`username`,`email`,`password`,`nickname`) VALUES (?)', [[username, email, sinon.match.string, nickname]])
    })
  })

  describe('findUserByUsername', () => {
    it('should resolve with user data if username exists', async () => {
      const username = 'testuser'

      queryStub.callsFake((q, values, callback) => {
        // Simulate a successful query by returning some data
        callback(null, [mockUserData])
      })

      const result = await authService.findUserByUsername(username)

      expect(result).toEqual([[...mockUserData]])
      sinon.assert.calledWith(queryStub, 'SELECT * FROM users WHERE username = ?', [username])
    })

    it('should resolve with an empty array if username does not exist', async () => {
      const username = 'nonexistentuser'

      queryStub.callsFake((q, values, callback) => {
        // Simulate a query that doesn't find any user
        callback(null, [])
      })

      const result = await authService.findUserByUsername(username)

      expect(result).toEqual([])
      sinon.assert.calledWith(queryStub, 'SELECT * FROM users WHERE username = ?', [username])
    })

    it('should reject with an error if there is an error in the query', async () => {
      const username = 'testuser'

      queryStub.callsFake((q, values, callback) => {
        // Simulate an error in the query
        callback(new Error('test error'), null)
      })

      await expect(authService.findUserByUsername(username)).rejects.toThrow('test error')
      sinon.assert.calledWith(queryStub, 'SELECT * FROM users WHERE username = ?', [username])
    })
  })

  describe('comparePassword', () => {
    it('should return true if passwords match', () => {
      const password = 'password123'
      const hashedPassword = bcrypt.hashSync(password, 10) // Simulated hashed password

      const result = authService.comparePassword(password, hashedPassword)

      expect(result).toBe(true)
    })

    it('should return false if passwords do not match', () => {
      const password = 'password123'
      const hashedPassword = bcrypt.hashSync('wrongpassword', 10) // Simulated incorrect hashed password

      const result = authService.comparePassword(password, hashedPassword)

      expect(result).toBe(false)
    })
  })
})
