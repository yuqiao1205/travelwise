import * as relationshipController from '../../controllers/relationship.js'
import * as relationshipService from '../../services/relationship.js'
import { jest } from '@jest/globals'

jest.mock('../../services/relationship.js')

describe('Relationship Controller', () => {
  let mockRequest, mockResponse
  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  describe('getRelationships', () => {
    it('should return 200 and relationships on success', async () => {
      const mockRelationships = [{ followerUserId: 1, followedUserId: 2 }]
      relationshipService.getRelationships.mockResolvedValue(mockRelationships)

      mockRequest.query = { followedUserId: '2' }

      await relationshipController.getRelationships(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockRelationships)
    })

    it('should return 500 on service failure', async () => {
      relationshipService.getRelationships.mockRejectedValue(new Error('Service error'))

      mockRequest.query = { followedUserId: '2' }

      await relationshipController.getRelationships(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
    })
  })

  describe('addRelationship', () => {
    it('should return 200 and a success message when relationship is added', async () => {
      const successMessage = 'Relationship added successfully'
      relationshipService.addRelationship.mockResolvedValue(successMessage)

      mockRequest.user = { id: 1 }
      mockRequest.body = { userId: '2' }

      await relationshipController.addRelationship(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: successMessage })
    })

    it('should return 400 if userId to follow is missing', async () => {
      mockRequest.user = { id: 1 }
      mockRequest.body = {}

      await relationshipController.addRelationship(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith('Missing required parameter: userId')
    })

    it('should return 400 if attempting to follow himself', async () => {
      mockRequest.user = { id: 1 }
      mockRequest.body = { userId: '1' }

      await relationshipController.addRelationship(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.status.mock.calls.length).toBe(1)
      expect(mockResponse.json).toHaveBeenCalledWith('You cannot follow yourself!')
    })
  })

  describe('deleteRelationship', () => {
    it('should return 200 and a success message when relationship is deleted', async () => {
      const successMessage = 'Relationship deleted successfully'
      relationshipService.deleteRelationship.mockResolvedValue(successMessage)

      mockRequest.user = { id: 1 }
      mockRequest.query = { userId: '2' }

      await relationshipController.deleteRelationship(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: successMessage })
    })

    it('should return 400 if userId to unfollow is missing', async () => {
      mockRequest.user = { id: 1 }
      mockRequest.query = {}

      await relationshipController.deleteRelationship(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith('Missing required parameter: userId')
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
