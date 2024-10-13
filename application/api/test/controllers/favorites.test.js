import { savePostToFavorites, deleteSavedPost, getFavoritePosts } from '../../controllers/favorites'
import { favorites } from '../../services/favorites'
import { jest } from '@jest/globals'

describe('savePostToFavorites', () => {
  // Mock the savePostToFavorites method directly on the favorites object
  beforeAll(() => {
    // Ensure the mock is reset before each test suite runs
    favorites.savePostToFavorites = jest.fn()
    favorites.deleteSavedPost = jest.fn()
    favorites.getFavoritePosts = jest.fn()
  })

  afterEach(() => {
    // Reset the mock after each test to clear previous call information
    favorites.savePostToFavorites.mockReset()
    favorites.deleteSavedPost.mockReset()
    favorites.getFavoritePosts.mockReset()
  })

  it('should return a 200 status and success message when post is saved to favorites successfully', async () => {
    const req = {
      user: { id: 1 },
      body: { postId: 1 }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Mock implementation to resolve successfully for this test case
    favorites.savePostToFavorites.mockResolvedValue()

    await savePostToFavorites(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith('Post saved to favorites successfully.')
  })

  it('should return a 500 status and error message if an error occurs during saving post to favorites', async () => {
    const req = {
      user: { id: 1 },
      body: { postId: 1 }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Mock implementation to reject with an error for this test case
    favorites.savePostToFavorites.mockRejectedValue(new Error('Database error'))

    await savePostToFavorites(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
  })

  it('should return a 400 status and error message if postId is missing in the request body', async () => {
    const req = {
      user: { id: 1 },
      body: {} // Missing postId in the request body
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await savePostToFavorites(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith('Missing required parameter: postId')
  })

  describe('deleteSavedPost', () => {
    let req, res

    beforeEach(() => {
      // Setup mock request and response
      req = {
        user: { id: 1 },
        query: {}
      }
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
    })

    it('should return a 200 status and success message when post is removed from favorites successfully', async () => {
      req.query.postId = '123' // Simulate postId sent in the query
      favorites.deleteSavedPost.mockResolvedValue()

      await deleteSavedPost(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith('Post removed from favorites successfully.')
    })

    it('should return a 400 status and error message if postId is missing in the query', async () => {
      // No postId provided in the query

      await deleteSavedPost(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith('Missing required parameter: postId')
    })

    it('should return a 500 status and error message if an error occurs during removal', async () => {
      req.query.postId = '123' // Simulate postId sent in the query
      const errorMessage = { message: 'Database error' }
      favorites.deleteSavedPost.mockRejectedValue(errorMessage)

      await deleteSavedPost(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(errorMessage)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
  })

  describe('getFavoritePosts', () => {
    let req, res

    beforeEach(() => {
      // Setup mock request and response
      // req = { user: { id: 1 } }
      req = {
        user: { id: 1 },
        query: {
          page: '1', // Default page number as string, similar to how it's received from query params
          pageSize: '10' // Default page size as string
        }
      }
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
    })

    it('should return a 200 status and list of favorite posts on success', async () => {
      // Assuming req and res are already defined as per your setup
      const mockFavoritePosts = {
        posts: [{ id: '1', title: 'Post 1' }, { id: '2', title: 'Post 2' }],
        totalPages: 1
      }
      favorites.getFavoritePosts.mockResolvedValue(mockFavoritePosts)

      await getFavoritePosts(req, res)

      // Ensure the assertion matches the structure returned by the controller
      expect(res.json).toHaveBeenCalledWith(mockFavoritePosts)
    })

    it('should return a 500 status and error message on failure', async () => {
      const mockError = new Error('Database error')
      favorites.getFavoritePosts.mockRejectedValue(mockError)

      await getFavoritePosts(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(expect.any(Object))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
  })
})
