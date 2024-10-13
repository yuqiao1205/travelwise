import { relationship } from '../services/relationship.js'

export const getRelationships = async (req, res) => {
  try {
    const relationships = await relationship.getRelationships(req.query.followedUserId)
    return res.status(200).json(relationships)
  } catch (err) {
    // console.error('Error getting relationships:', err)
    return res.status(500).json(err)
  }
}

export const addRelationship = async (req, res) => {
  const followerUserId = req.user.id // User ID obtained from req.user
  const followedUserId = req.body.userId // Assuming post userId is sent in the request body

  // Check if the followedUserId is provided
  if (!followedUserId) {
    return res.status(400).json('Missing required parameter: userId')
  }

  // Check if the user is trying to follow themselves
  if (String(followedUserId) === String(followerUserId)) {
    console.log('You cannot follow yourself!')
    return res.status(400).json('You cannot follow yourself!')
  }

  try {
    const message = await relationship.addRelationship(followerUserId, followedUserId)
    return res.status(200).json({ message })
  } catch (err) {
    console.error('Error adding relationship:', err)
    return res.status(500).json(err)
  }
}

export const deleteRelationship = async (req, res) => {
  const followerUserId = req.user.id // User ID obtained from req.user
  const followedUserId = req.query.userId // Assuming followed userId is sent in the query

  if (!followedUserId) {
    return res.status(400).json('Missing required parameter: userId')
  }

  try {
    const message = await relationship.deleteRelationship(followerUserId, followedUserId)
    return res.status(200).json({ message })
  } catch (err) {
    console.error('Error deleting relationship:', err)
    return res.status(500).json(err)
  }
}