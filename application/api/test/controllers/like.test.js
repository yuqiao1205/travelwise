// Assuming your imports are correct and pointing to the actual controller and service
import { getLikes, addLike, deleteLike } from '../../controllers/like'
import * as likeService from '../../services/like' // Ensure this points to your actual like service

jest.mock('../../services/like') // Correctly mock the like service

describe('Like Controller', () => {
  let mockReq, mockRes, mockNext

  beforeEach(() => {
    mockReq = { user: { id: 1 }, body: {}, query: {} }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    mockNext = jest.fn()
  })

  describe('getLikes', () => {
    it('should return 200 and likes on success', async () => {
      const mockLikes = { count: 5 }
      likeService.getLikes.mockResolvedValue(mockLikes)

      mockReq.query.postId = '123' // Setting up req.query.postId

      await getLikes(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(mockLikes)
    })

    it('should return 500 on error', async () => {
      likeService.getLikes.mockRejectedValue(new Error('Error getting likes'))

      mockReq.query.postId = '123' // Setting up req.query.postId

      await getLikes(mockReq, mockRes, mockNext) // Make sure to await the controller call

      expect(mockRes.status).toHaveBeenCalledWith(500)
      // Ensure the assertion for `mockRes.json` is called with an appropriate error object/message
    })
  })

  describe('addLike', () => {
    it('should return 200 and a success message on success', async () => {
      const successMessage = 'Like added successfully'
      likeService.addLike.mockResolvedValue(successMessage)

      mockReq.body.postId = '123' // Setting up req.body.postId

      await addLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({ message: successMessage })
    })

    it('should return 400 if postId is missing', async () => {
      mockReq.body = {} // postId is missing

      await addLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith('Missing required parameter: postId')
    })

    it('should return 500 on service error', async () => {
      mockReq.body.postId = '123' // Setting up req.body.postId
      likeService.addLike.mockRejectedValue(new Error('Service error'))

      await addLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      // Optional: Verify that the json method is called with a specific error message or object
    })
  })
  describe('deleteLike', () => {
    it('should return 200 and a success message on success', async () => {
      const successMessage = 'Like deleted successfully'
      likeService.deleteLike.mockResolvedValue(successMessage)

      mockReq.query.postId = '123' // Setting up req.query.postId

      await deleteLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({ message: successMessage })
    })

    it('should return 400 if postId is missing', async () => {
      mockReq.query = {} // postId is missing

      await deleteLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith('Missing required parameter: postId')
    })

    it('should return 500 on service error', async () => {
      mockReq.query.postId = '123' // Setting up req.query.postId
      likeService.deleteLike.mockRejectedValue(new Error('Service error'))

      await deleteLike(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      // Optional: Verify that the json method is called with a specific error message or object
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
