import { db } from '../db.js'

export const getLikes = (postId) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT userId FROM likes WHERE postId = ?'
    db.query(q, [postId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.map(like => like.userId))
      }
    })
  })
}

export const addLike = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)'
    const values = [userId, postId]

    db.query(q, values, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Post has been liked.')
      }
    })
  })
}

export const deleteLike = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM likes WHERE `userId` = ? AND `postId` = ?'
    db.query(q, [userId, postId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Post has been disliked.')
      }
    })
  })
}

export const like = {
  getLikes,
  addLike,
  deleteLike
}
