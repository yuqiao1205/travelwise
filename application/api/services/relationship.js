// services/relationship.js
import { db } from '../db.js'

export const getRelationships = (followedUserId) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT followerUserId FROM relationships WHERE followedUserId = ?'
    db.query(q, [followedUserId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.map((relationship) => relationship.followerUserId))
      }
    })
  })
}

// followedUserId is the user being followed
export const addRelationship = (followerUserId, followedUserId) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?, ?)'
    const values = [followerUserId, followedUserId]

    db.query(q, values, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Following')
      }
    })
  })
}

export const deleteRelationship = (followerUserId, userIdToDelete) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?'
    db.query(q, [followerUserId, userIdToDelete], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Unfollow')
      }
    })
  })
}

export const relationship = {
  getRelationships,
  addRelationship,
  deleteRelationship
}
