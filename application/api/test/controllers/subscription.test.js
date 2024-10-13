import { saveSubscription, removeSubscriber } from '../../controllers/subscription'
import { subscription } from '../../services/subscribe'
import { jest } from '@jest/globals'

describe('saveSubscription', () => {
  it('should return a 409 status and message if email is already subscribed', async () => {
    const req = { body: { email: 'test@example.com' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Stub the isAlreadySubscribed function to return true (email already subscribed)
    jest.spyOn(subscription, 'isAlreadySubscribed').mockResolvedValue(true)

    await saveSubscription(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already subscribed.' })
  })

  it('should return a 200 status and message if email is not already subscribed', async () => {
    const req = { body: { email: 'test@example.com' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Stub the isAlreadySubscribed function to return false (email not subscribed)
    jest.spyOn(subscription, 'isAlreadySubscribed').mockResolvedValue(false)

    // Stub the saveSubscription function
    jest.spyOn(subscription, 'saveSubscription').mockResolvedValue()

    await saveSubscription(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Subscribed successfully' })
  })

  it('should return a 500 status and error message if an error occurs', async () => {
    const req = { body: { email: 'test@example.com' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Stub the isAlreadySubscribed function to throw an error
    jest.spyOn(subscription, 'isAlreadySubscribed').mockRejectedValue(new Error('Database error'))

    await saveSubscription(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
  })
})

describe('Subscription Controller', () => {
  describe('removeSubscriber', () => {
    it('should return 404 if email is not found in the subscription list', async () => {
      const req = {
        body: {
          email: 'nonexistent@example.com'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the removeSubscriber function to return 0 (email not found)
      subscription.removeSubscriber = jest.fn().mockResolvedValue(0)

      await removeSubscriber(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Email not found in subscription list' })
    })

    it('should return 200 if email is successfully removed from the subscription list', async () => {
      const req = {
        body: {
          email: 'existing@example.com'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the removeSubscriber function to return 1 (email removed successfully)
      subscription.removeSubscriber = jest.fn().mockResolvedValue(1)

      await removeSubscriber(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Unsubscribed successfully' })
    })

    it('should return 500 if an error occurs during removal', async () => {
      const req = {
        body: {
          email: 'existing@example.com'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Mock the removeSubscriber function to throw an error
      subscription.removeSubscriber = jest.fn().mockRejectedValue(new Error('Database error'))

      await removeSubscriber(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })
})
