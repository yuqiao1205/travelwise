// Import the subscription service
import { subscription } from '../services/subscribe.js'

export const saveSubscription = async (req, res) => {
  const { email } = req.body
  console.log('email:', email)

  try {
    // Check if the email is already subscribed
    const alreadySubscribed = await subscription.isAlreadySubscribed(email)

    if (alreadySubscribed) {
      return res.status(409).json({ message: 'Email already subscribed.' })
    }

    // Save the email address to the database using the subscription service
    await subscription.saveSubscription(email)
    // Send a confirmation email (implementation not shown)
    res.status(200).json({ message: 'Subscribed successfully' })
  } catch (error) {
    // console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Endpoint for unsubscribing
export const removeSubscriber = async (req, res) => {
  const { email } = req.body
  console.log(' cancel email:', email)
  console.log('Unsubscribing email:', email)

  try {
    // Remove the email address from the database using the subscription service
    const result = await subscription.removeSubscriber(email)

    if (result === 0) {
      // No rows affected, email not found
      res.status(404).json({ message: 'Email not found in subscription list' })
    } else {
      // Successfully removed the subscriber
      res.status(200).json({ message: 'Unsubscribed successfully' })
    }
  } catch (error) {
    // console.error('Error removing subscription:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
