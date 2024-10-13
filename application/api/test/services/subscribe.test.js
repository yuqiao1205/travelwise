import sinon from 'sinon'
import { subscription } from '../../services/subscribe' // Import the subscription module
import { db } from '../../db'

describe('isAlreadySubscribed', () => {
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

  it('should resolve true when email is already subscribed', async () => {
    // Configure the queryStub to invoke a callback with specific arguments
    queryStub.callsFake((sql, params, callback) => {
      // Simulate a successful query by calling the callback with null and [true]
      callback(null, [true])
    })

    const email = 'test@example.com'
    const result = await subscription.isAlreadySubscribed(email)

    expect(result).toBe(true)

    // Ensure that db.query was called with the correct SQL and parameters
    sinon.assert.calledWith(queryStub, 'SELECT * FROM subscriptions WHERE email = ?', [email])
  })

  it('should error when error', async () => {
    // Configure the queryStub to invoke a callback with specific arguments
    queryStub.callsFake((sql, params, callback) => {
      // Simulate an unsuccessful query by calling the callback with an error and an empty array
      callback(new Error('test error'), [])
    })

    const email = 'test@example.com'

    // Ensure that the promise is rejected with the correct error
    await expect(subscription.isAlreadySubscribed(email)).rejects.toThrow('test error')
  })
})

describe('Subscription Service', () => {
  describe('saveSubscription', () => {
    it('should resolve with results when subscription is saved successfully', async () => {
      const email = 'test@example.com'
      const expectedResults = { insertId: 1, affectedRows: 1 }

      // Mock the db.query function to simulate a successful query
      db.query = jest.fn().mockImplementationOnce((sql, values, callback) => {
        callback(null, expectedResults)
      })

      const result = await subscription.saveSubscription(email)

      expect(result).toEqual(expectedResults)
    })

    it('should reject with an error when an error occurs during subscription saving', async () => {
      const email = 'test@example.com'
      const expectedError = new Error('Database error')

      // Mock the db.query function to simulate an error in the query
      db.query = jest.fn().mockImplementationOnce((sql, values, callback) => {
        callback(expectedError, null)
      })

      await expect(subscription.saveSubscription(email)).rejects.toThrow(expectedError)
    })
  })

  describe('removeSubscriber', () => {
    it('should resolve with affectedRows when subscriber is removed successfully', async () => {
      const email = 'test@example.com'
      const expectedAffectedRows = 1

      // Mock the db.query function to simulate successful removal
      db.query = jest.fn().mockImplementationOnce((sql, values, callback) => {
        callback(null, { affectedRows: expectedAffectedRows })
      })

      const result = await subscription.removeSubscriber(email)

      expect(result).toEqual(expectedAffectedRows)
    })

    it('should reject with an error when an error occurs during subscriber removal', async () => {
      const email = 'test@example.com'
      const expectedError = new Error('Database error')

      // Mock the db.query function to simulate an error in removal
      db.query = jest.fn().mockImplementationOnce((sql, values, callback) => {
        callback(expectedError, null)
      })

      await expect(subscription.removeSubscriber(email)).rejects.toThrow(expectedError)
    })
  })
})

describe('Subscription Service', () => {
  describe('getAllSubscribersEmail', () => {
    it('should resolve with an array of subscriber emails when successful', async () => {
      const expectedEmails = ['subscriber1@example.com', 'subscriber2@example.com']

      // Mock the db.query function to simulate a successful query
      db.query = jest.fn().mockImplementationOnce((sql, callback) => {
        callback(null, expectedEmails.map((email) => ({ email })))
      })

      const result = await subscription.getAllSubscribersEmail()

      expect(result).toEqual(expectedEmails)
    })

    it('should reject with an error when an error occurs during query', async () => {
      const expectedError = new Error('Database error')

      // Mock the db.query function to simulate an error in the query
      db.query = jest.fn().mockImplementationOnce((sql, callback) => {
        callback(expectedError, null)
      })

      await expect(subscription.getAllSubscribersEmail()).rejects.toThrow(expectedError)
    })
  })
})
