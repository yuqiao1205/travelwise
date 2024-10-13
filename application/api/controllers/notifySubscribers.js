import { emailServiceManager } from '../services/emailServiceManager.js'
import { subscription } from '../services/subscribe.js'

export const notifySubscribers = async (postId) => {
  try {
    // Fetch the list of subscribers
    const subscribers = await subscription.getAllSubscribersEmail()

    // Send an email to each subscriber
    subscribers.forEach(subscriberEmail => {
      emailServiceManager.sendEmail(subscriberEmail,
        'New Post Alert!!', // email subject
        'Dear Customer, good news, a new post has been added. Please check it out!')// email body
    })

    console.log('Subscribers notified for post ID:', postId)
  } catch (error) {
    console.error('Error notifying subscribers:', error)
  }
}
