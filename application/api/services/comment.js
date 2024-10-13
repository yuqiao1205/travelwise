import { db } from '../db.js'
import moment from 'moment'

export const getComments = (postId) => {
  return new Promise((resolve, reject) => {
    const q = `
        SELECT c.*, u.id AS userId, username
        FROM comments AS c
        JOIN users AS u ON (u.id = c.userId)
        WHERE c.postId = ?
        ORDER BY c.createdAt DESC`

    db.query(q, [postId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        const comments = data

        // Fetch replies to comments
        const qReplies = `
            SELECT cr.*, ur.id AS replyUserId, ur.username AS replyUsername
            FROM comments AS cr
            JOIN users AS ur ON (ur.id = cr.userId)
            WHERE cr.postId = ? AND cr.parentCommentId IS NOT NULL
            ORDER BY cr.createdAt DESC`

        db.query(qReplies, [postId], (err, replyData) => {
          if (err) {
            reject(err)
          } else {
            // Group replies by parentCommentId
            const repliesMap = new Map()
            replyData.forEach((reply) => {
              const parentCommentId = reply.parentCommentId
              if (!repliesMap.has(parentCommentId)) {
                repliesMap.set(parentCommentId, [])
              }
              repliesMap.get(parentCommentId).push(reply)
            })

            // Combine comments and replies
            comments.forEach((comment) => {
              const commentId = comment.id
              if (repliesMap.has(commentId)) {
                comment.replies = repliesMap.get(commentId)
              }
            })

            resolve(comments)
          }
        })
      }
    })
  })
}

// export const addComment = (desc, postId, userId, parentCommentId) => {
//   return new Promise((resolve, reject) => {
//     const q = 'INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)'
//     const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
//     const values = [desc, createdAt, userId, postId, parentCommentId]

//     db.query(q, values, (err, data) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve('Comment has been created.')
//       }
//     })
//   })
// }

export const addComment = (desc, postId, userId) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)'
    const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const values = [desc, createdAt, userId, postId]

    db.query(q, values, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Comment has been created.')
      }
    })
  })
}
export const deleteComment = (commentId, userId) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM comments WHERE `id` = ? AND `userId` = ?'

    db.query(q, [commentId, userId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        if (data.affectedRows > 0) {
          resolve('Comment has been deleted!')
        } else {
          resolve('You can delete only your comment!')
        }
      }
    })
  })
}

export const addReplyToComment = (desc, parentCommentId, userId, postId) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO comments(`desc`, `createdAt`, `userId`, `parentCommentId`, `postId`) VALUES (?, ?, ?, ?, ?)'
    const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const values = [desc, createdAt, userId, parentCommentId, postId]
    console.log(values)
    db.query(q, values, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Reply has been added.')
      }
    })
  })
}

export const comment = { getComments, addComment, deleteComment, addReplyToComment }
