import { validationResult } from 'express-validator'
import { register } from '../../controllers/auth'

// Mock 'express-validator' module
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'), // Use the actual implementations of other functions
  validationResult: jest.fn() // Mock validationResult specifically
}))

describe('register validation', () => {
  beforeEach(() => {
    // Prepare mock result to simulate validation errors
    const mockResult = {
      isEmpty: () => false, // Indicates validation errors exist
      array: () => [
        { param: 'email', msg: 'Invalid email' },
        { param: 'username', msg: 'Username is required' },
        { param: 'password', msg: 'Password must be at least 6 characters long' },
        { param: 'nickname', msg: 'Nickname is required' }
      ]
    }

    // Mock the return value of validationResult to simulate validation errors
    validationResult.mockReturnValue(mockResult)
  })

  afterEach(() => {
    jest.resetAllMocks() // Reset mocks after each test
  })

  it('should return 400 for invalid input data', async () => {
    const req = {
      body: {
        email: 'invalid-email', // Invalid email format
        username: '', // Empty username
        password: '12345', // Password too short
        nickname: 'nick' // Valid, but not relevant for this specific validation
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await register(req, res)

    // Debugging output removed for clarity, uncomment if needed for troubleshooting
    // console.log('res.status calls:', res.status.mock.calls);
    // console.log('res.json calls:', res.json.mock.calls);

    expect(res.status).toHaveBeenCalledWith(400) // Expect 400 for validation error
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ param: 'email', msg: 'Invalid email' }),
        expect.objectContaining({ param: 'username', msg: 'Username is required' }),
        expect.objectContaining({ param: 'password', msg: 'Password must be at least 6 characters long' })
      ])
    })
  })

  // Add more test cases as needed
})
