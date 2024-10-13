import jwt from 'jsonwebtoken'
import { authService } from '../../services/auth'
import { register, login, logout } from '../../controllers/auth.js'
// import { validationResult } from 'express-validator'

describe('Authentication Controller', () => {
  describe('register', () => {
    it('should return 409 if user already exists', async () => {
      const req = {
        body: {
          email: 'existing@example.com',
          username: 'existingUser',
          password: 'password123',
          nickname: 'nick'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the checkExistingUser function to return an existing user
      authService.checkExistingUser = jest.fn().mockResolvedValue([{
        id: 1,
        username: 'existingUser',
        email: 'existing@example.com'
      }])

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith('User already exists!')
    })

    it('should return 200 if user is successfully registered', async () => {
      const req = {
        body: {
          email: 'new@example.com',
          username: 'newUser',
          password: 'password123',
          nickname: 'nick'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the checkExistingUser function to return an empty array (user doesn't exist)
      authService.checkExistingUser = jest.fn().mockResolvedValue([])

      // Mock the createUser function to succeed
      authService.createUser = jest.fn().mockResolvedValue('User has been created.')

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith('User has been created.')
    })

    it('should return 500 if an error occurs during registration', async () => {
      const req = {
        body: {
          email: 'new@example.com',
          username: 'newUser',
          password: 'password123',
          nickname: 'nick'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the checkExistingUser function to return an empty array (user doesn't exist)
      authService.checkExistingUser = jest.fn().mockResolvedValue([])

      // Mock the createUser function to throw an error
      authService.createUser = jest.fn().mockRejectedValue(new Error('Database error'))

      await register(req, res)

      // console.log(res.json.mock.calls)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  // describe('register validation', () => {
  //   jest.mock('../../controllers/auth') // Mock the auth controller
  //   jest.mock('express-validator')
  //   beforeEach(() => {
  //     const mockResult = {
  //       isEmpty: () => false, // Simulate validation errors
  //       array: () => [
  //         { param: 'email', msg: 'Invalid email' },
  //         { param: 'username', msg: 'Username is required' },
  //         { param: 'password', msg: 'Password must be at least 6 characters long' },
  //         { param: 'nickname', msg: 'Nickname is required' }
  //       ]
  //     }

  //     // Mock validationResult function
  //     validationResult.mockReturnValue(mockResult)
  //   })

  //   afterEach(() => {
  //     jest.resetAllMocks()
  //   })

  //   it('should return 400 for invalid input data', async () => {
  //     const req = {
  //       body: {
  //         email: 'invalid-email', // Invalid email format
  //         username: '', // Empty username
  //         password: '12345', // Password too short
  //         nickname: 'nick'
  //       }
  //     }

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn()
  //     }

  //     await register(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400) // Expect 400 for validation error
  //     expect(res.json).toHaveBeenCalledWith({
  //       errors: [
  //         { param: 'email', msg: 'Invalid email' },
  //         { param: 'username', msg: 'Username is required' },
  //         { param: 'password', msg: 'Password must be at least 6 characters long' }
  //       ]
  //     })
  //   })

  // Add more test cases for valid input data and additional validation scenarios as needed
  // })
  // describe('register validation', () => {
  //   jest.mock('../../controllers/auth') // Mock the auth controller

  //   beforeEach(() => {
  //     const mockResult = {
  //       isEmpty: () => false, // Simulate validation errors
  //       array: () => [
  //         { param: 'email', msg: 'Invalid email' },
  //         { param: 'username', msg: 'Username is required' },
  //         { param: 'password', msg: 'Password must be at least 6 characters long' },
  //         { param: 'nickname', msg: 'Nickname is required' }
  //       ]
  //     }
  //     // Mock validationResult function
  //     validationResult.mockImplementation(() => mockResult)
  //   })

  //   afterEach(() => {
  //     jest.resetAllMocks()
  //   })

  //   it('should return 400 for invalid input data', async () => {
  //     const req = {
  //       body: {
  //         email: 'invalid-email', // Invalid email format
  //         username: '', // Empty username
  //         password: '12345', // Password too short
  //         nickname: 'nick'
  //       }
  //     }

  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn()
  //     }

  //     await register(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400) // Expect 400 for validation error
  //     expect(res.json).toHaveBeenCalledWith({
  //       errors: [
  //         { param: 'email', msg: 'Invalid email' },
  //         { param: 'username', msg: 'Username is required' },
  //         { param: 'password', msg: 'Password must be at least 6 characters long' }
  //       ]
  //     })
  //   })

  //   // Add more test cases for valid input data and additional validation scenarios as needed
  // })

  describe('login', () => {
    it('should return 404 if user is not found', async () => {
      const req = {
        body: {
          username: 'nonexistentUser',
          password: 'password123'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the findUserByUsername function to return an empty array (user not found)
      authService.findUserByUsername = jest.fn().mockResolvedValue([])

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith('User not found!')
    })

    it('should return 400 if password is incorrect', async () => {
      const req = {
        body: {
          username: 'existingUser',
          password: 'wrongPassword'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the findUserByUsername function to return an existing user
      authService.findUserByUsername = jest.fn().mockResolvedValue([
        {
          id: 1,
          username: 'existingUser',
          email: 'existing@example.com',
          password: 'correctHashedPassword' // Actual hashed password should be used here
          // other user properties here
        }
      ])

      // Mock the comparePassword function to return false
      authService.comparePassword = jest.fn().mockReturnValue(false)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith('Wrong username or password!')
    })

    it('should return a token and user data if login is successful', async () => {
      const req = {
        body: {
          username: 'existingUser',
          password: 'correctPassword'
        }
      }
      const res = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the findUserByUsername function to return an existing user
      authService.findUserByUsername = jest.fn().mockResolvedValue([
        {
          id: 1,
          username: 'existingUser',
          email: 'existing@example.com',
          password: 'correctHashedPassword' // Actual hashed password should be used here
          // other user properties here
        }
      ])

      // Mock the comparePassword function to return true
      authService.comparePassword = jest.fn().mockReturnValue(true)

      // Mock the jwt.sign function to return a token
      jwt.sign = jest.fn().mockReturnValue('testToken')

      await login(req, res)

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'testToken', {
        httpOnly: true
      })
      expect(res.status).toHaveBeenCalledWith(200)
      // Ensure that the response JSON contains user data excluding the password
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        username: 'existingUser',
        email: 'existing@example.com'
        // other user properties here
      })
    })

    it('should return 500 if an error occurs during login', async () => {
      const req = {
        body: {
          username: 'existingUser',
          password: 'correctPassword'
        }
      }
      const res = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the findUserByUsername function to return an existing user
      authService.findUserByUsername = jest.fn().mockResolvedValue([
        {
          id: 1,
          username: 'existingUser',
          email: 'existing@example.com',
          password: 'correctHashedPassword' // Actual hashed password should be used here
          // other user properties here
        }
      ])

      // Mock the comparePassword function to return true
      authService.comparePassword = jest.fn().mockReturnValue(true)

      // Mock the jwt.sign function to throw an error
      jwt.sign = jest.fn().mockImplementation(() => {
        throw new Error('JWT error')
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  describe('logout', () => {
    it('should clear the access_token cookie and return 200', () => {
      const req = {}
      const res = {
        clearCookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      logout(req, res)

      // Ensure that the clearCookie method was called with the correct arguments
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        sameSite: 'none',
        secure: true
      })

      // Ensure that the response status and message are correct
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith('User has been logged out.')
    })
  })
})
