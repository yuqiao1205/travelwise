import { db } from '../db.js'

export const savePostToFavorites = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO favorites (userId, postId) VALUES (?, ?)'

    db.query(q, [userId, postId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const deleteSavedPost = (postId, userId) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM favorites WHERE userId = ? AND postId = ?;'

    db.query(q, [userId, postId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getFavoritePosts = (userId, page, desiredPageSize) => {
  const MAX_PAGE_SIZE = 4 // Limit the maximum 4 posts per page
  const pageSize = Math.min(desiredPageSize, MAX_PAGE_SIZE) // Limit the page size to 3
  const skip = (page - 1) * pageSize

  return new Promise((resolve, reject) => {
    const q = `
      SELECT p.*, u.id AS userId, username
      FROM posts AS p
      JOIN users AS u ON (u.id = p.uid)
      JOIN favorites AS f ON (p.id = f.postId)
      WHERE f.userId = ?
      ORDER BY p.date DESC
      LIMIT ?, ?`

    // Query to count the total number of favorite posts for the user
    const countQuery = `
      SELECT COUNT(*) as totalFavorites
      FROM posts AS p
      JOIN users AS u ON (u.id = p.uid)
      JOIN favorites AS f ON (p.id = f.postId)
      WHERE f.userId = ?`

    db.query(q, [userId, skip, pageSize], (err, data) => {
      if (err) {
        reject(err)
      } else {
        // Execute the count query to get the total count
        db.query(countQuery, [userId], (countErr, countData) => {
          if (countErr) {
            reject(countErr)
          } else {
            const totalFavorites = countData[0].totalFavorites
            const totalPages = Math.ceil(totalFavorites / pageSize)
            resolve({ posts: data, totalPages })
          }
        })
      }
    })
  })
}

export const favorites = {
  savePostToFavorites,
  deleteSavedPost,
  getFavoritePosts
}
