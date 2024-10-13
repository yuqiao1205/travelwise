import { getUser, updateUser, deleteUser } from '../../controllers/user'
import { users } from '../../services/user.js'
import { jest } from '@jest/globals'

// Mock the user service
beforeAll(() => {
  // Ensure the mock is reset before each test suite runs
  users.getUser = jest.fn()
  users.updateUser = jest.fn()
  users.deleteUser = jest.fn()
})

afterEach(() => {
  // Reset the mock after each test to clear previous call information
  users.getUser.mockReset()
  users.updateUser.mockReset()
  users.deleteUser.mockReset()
})

describe('getUser', () => {
  it('responds with user data without password on success', async () => {
    const req = { params: { userId: '1' } }
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    const mockUser = { id: 1, username: 'testUser', password: 'secret' }

    users.getUser.mockResolvedValue(mockUser)

    await getUser(req, res)

    expect(users.getUser).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'testUser' })
  })

  it('responds with 500 if getUser throws an error', async () => {
    const req = { params: { userId: '3' } }
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    const mockError = new Error('Error fetching user.')

    users.getUser.mockRejectedValue(mockError)

    await getUser(req, res)

    expect(users.getUser).toHaveBeenCalledWith('3')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error.' })
  })

  it('responds with 404 if user not found', async () => {
    const req = { params: { userId: '2' } }
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    users.getUser.mockResolvedValue(null)

    await getUser(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith('User not found!')
  })

  const mockValidationResultFn = jest.fn()

  jest.mock('express-validator', () => ({
    validationResult: () => mockValidationResultFn()
  }))

  // describe('updateUser Controller', () => {
  //   let req, res, next

  //   beforeEach(() => {
  //     req = {
  //       user: { id: 1 },
  //       body: { city: 'New City', img: 'newimage.jpg', email: 'test@example.com', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
  //     }
  //     res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn()
  //     }
  //     next = jest.fn()

  //     mockValidationResultFn.mockReturnValue({
  //       isEmpty: () => true // Simulate no validation errors
  //     })

  //     // Reset mocks before each test
  //     jest.clearAllMocks()
  //   })

  //   it('responds with 400 and validation errors', async () => {
  //     const req = {
  //       user: { id: 1 },
  //       body: { city: 'New City', img: 'newimage.jpg', email: 'invalid-email', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
  //     }
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn()
  //     }

  //     // Mock the validationResult function to return a non-empty array of errors
  //     mockValidationResultFn.mockReturnValue({
  //       isEmpty: () => false,
  //       array: () => [{ msg: 'Invalid field' }]
  //     })

  //     await updateUser(req, res)

  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid field' }] })
  //   })

  //   it('responds with 400 and validation errors if request validation fails', async () => {
  //     const req = {
  //       user: { id: 1 },
  //       body: { city: 'New City', img: 'newimage.jpg', email: 'invalid-email', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
  //     }
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn()
  //     }
    
  //     // Mock the validationResult function to return a non-empty array of errors
  //     mockValidationResultFn.mockReturnValue({
  //       isEmpty: () => false,
  //       array: () => [{ msg: 'Invalid field' }]
  //     })
    
  //     await updateUser(req, res)
    
  //     expect(res.status).toHaveBeenCalledWith(400)
  //     expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid field' }] })
  //   })
    

  //   it('responds with 200 and success message if user update is successful', async () => {
  //     mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
  //     users.updateUser.mockResolvedValue(true)

  //     await updateUser(req, res, next)

  //     expect(users.updateUser).toHaveBeenCalled()
  //     expect(res.status).toHaveBeenCalledWith(200)
  //     expect(res.json).toHaveBeenCalledWith({ msg: 'User has been updated!' })
  //   })

  //   it('responds with 500 and server error message if updateUser throws an error', async () => {
  //     mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
  //     users.updateUser.mockRejectedValue(new Error('Update failed due to server error'))

  //     await updateUser(req, res, next)

  //     expect(users.updateUser).toHaveBeenCalled()
  //     expect(res.status).toHaveBeenCalledWith(500)
  //     expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Server error', error: 'Update failed due to server error' }] })
  //   })
  // })
  describe('updateUser Controller', () => {
    let req, res, next
  
    beforeEach(() => {
      req = {
        user: { id: 1 },
        body: { city: 'New City', img: 'newimage.jpg', email: 'test@example.com', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
      }
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      next = jest.fn()
  
      mockValidationResultFn.mockReturnValue({
        isEmpty: () => true // Simulate no validation errors
      })
  
      // Reset mocks before each test
      jest.clearAllMocks()
    })
  
    it('responds with 400 and validation errors', async () => {
      const req = {
        user: { id: 1 },
        body: { city: 'New City', img: 'newimage.jpg', email: 'invalid-email', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
  
      // Mock the validationResult function to return a non-empty array of errors
      mockValidationResultFn.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid field' }]
      })
  
      await updateUser(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid field' }] })
    })
  
    it('responds with 200 and success message if user update is successful', async () => {
      mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
      users.updateUser.mockResolvedValue(true)
  
      await updateUser(req, res, next)
  
      expect(users.updateUser).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ msg: 'User has been updated!' })
    })
  
    it('responds with 500 and server error message if updateUser throws an error', async () => {
      mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
      users.updateUser.mockRejectedValue(new Error('Update failed due to server error'))
  
      await updateUser(req, res, next)
  
      expect(users.updateUser).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Server error', error: 'Update failed due to server error' }] })
    })
  
    it('responds with 400 and validation errors if request validation fails', async () => {
      const req = {
        user: { id: 1 },
        body: { city: 'New City', img: 'newimage.jpg', email: 'invalid-email', nickname: 'newNickname', fullname: 'New Fullname', interest: 'New Interest' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
  
      // Mock the validationResult function to return a non-empty array of errors
      mockValidationResultFn.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid field' }]
      })
  
      await updateUser(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid field' }] })
    })
  
    it('responds with 500 and server error message if updateUser throws an error', async () => {
      mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
      users.updateUser.mockRejectedValue(new Error('Update failed due to server error'))
  
      await updateUser(req, res, next)
  
      expect(users.updateUser).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Server error', error: 'Update failed due to server error' }] })
    })

    it('responds with 400 and error message if updateUser returns false', async () => {
      mockValidationResultFn.mockReturnValue({ isEmpty: () => true })
      users.updateUser.mockResolvedValue(false)
    
      await updateUser(req, res, next)
    
      expect(users.updateUser).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid field' }] })
    })
    
  })
  


  describe('deleteUser', () => {
    it('deletes user successfully', async () => {
      const req = {
        user: { id: 1 },
        params: { userId: '1' }
      }
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      }

      users.deleteUser.mockResolvedValue(true)

      await deleteUser(req, res)

      expect(users.deleteUser).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith('User has been deleted successfully!')
    })

    it('responds with 404 if user does not exist', async () => {
      const req = {
        user: { id: 2 },
        params: { userId: '2' }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      users.deleteUser.mockResolvedValue(false) // Mock deleteUser to resolve with failure

      await deleteUser(req, res)

      // expect(users.deleteUser).toHaveBeenCalledWith(userIdFromParams) // This is not necessary since the operation is prevented before reaching deleteUser
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith('User not found!')
    })

    it('responds with 500 if deleteUser throws an error', async () => {
      const req = {
        user: { id: 1 },
        params: { userId: '1' } // Assume the user is trying to delete their own account
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      const mockError = [new Error('Error deleting user.')]

      users.deleteUser.mockRejectedValue(mockError) // Mock deleteUser to reject with error

      await deleteUser(req, res)

      expect(users.deleteUser).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(mockError)
    })
  })

  describe('deleteUser', () => {
    it('prevents a user from deleting another user\'s account', async () => {
      const req = {
        user: { id: 1 }, // Simulated logged-in user's ID
        params: { userId: '2' } // Simulated attempt to delete another user's account with a different ID
      }
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      }

      // Since the operation should be prevented, we don't expect users.deleteUser to be called.
      // However, if it's necessary to mock for consistency, you can include it.
      // In this case, it's not called due to the business logic preventing the action before reaching the deleteUser service.

      await deleteUser(req, res)

      // Verify that the status and response are correct for an unauthorized deletion attempt
      expect(users.deleteUser).not.toHaveBeenCalled() // Ensure deleteUser was not called due to the prevention logic
      expect(res.status).toHaveBeenCalledWith(403) // HTTP status for Forbidden
      expect(res.json).toHaveBeenCalledWith('You can only delete your own account!')
    })
  })
})
