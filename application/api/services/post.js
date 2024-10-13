import { db } from '../db.js'
import { postModel } from '../models/post.js'
import { tag } from './tagConvertService.js'

// getPost by id
const getPost = (id) => {
  console.log('getPost called')
  // SQL query to join users, posts, and posttags tables
  const q = `
      SELECT p.id, p.uid, u.username, p.title, p.desc, p.img, p.thumbnail,
             u.img AS userImg, p.cat, p.date, GROUP_CONCAT(t.tid) AS tags
      FROM posts p
      JOIN users u ON u.id = p.uid
      LEFT JOIN posttags t ON p.id = t.pid
      WHERE p.id = ?
      GROUP BY p.id
    `

  return new Promise((resolve, reject) => {
    db.query(q, [id], (err, data) => {
      if (err) {
        reject(err)
      } else {
        // Assuming postModel.Post.from_object can handle the additional 'tags' field
        resolve(postModel.Post.from_object(data[0]))
      }
    })
  })
}

// Helper function to calculate pagination
const calculatePagination = (cat, limit) => {
  const catString = cat ? 'WHERE cat=?' : ''
  const qTotal = `SELECT COUNT(*) AS total FROM posts ${catString}`

  return new Promise((resolve, reject) => {
    db.query(qTotal, cat ? [cat] : [], (err, totalData) => {
      if (err) {
        console.error('Error executing total count query:', err)
        reject(err)
      } else {
        const totalPosts = totalData[0].total
        const totalPages = Math.ceil(totalPosts / limit)
        resolve({ totalPosts, totalPages })
      }
    })
  })
}

// Function to fetch posts with pagination and category
export const getPosts = (cat, limit, offset) => {
  const catString = cat ? 'WHERE cat=?' : ''
  const queryParams = cat ? [cat, limit, offset] : [limit, offset]
  const q = `SELECT posts.*, posts.uid FROM posts 
             LEFT JOIN users ON posts.uid = users.id 
             ${catString} 
             ORDER BY posts.date DESC 
             LIMIT ? OFFSET ?`

  return new Promise((resolve, reject) => {
    db.query(q, queryParams, (err, data) => {
      if (err) {
        console.error('Error executing query:', err)
        reject(err)
      } else {
        calculatePagination(cat, limit, offset)
          .then(({ totalPosts, totalPages }) => {
            const result = {
              posts: data.length > 0 ? data : [],
              total: totalPosts,
              totalPages
            }
            resolve(result)
          })
          .catch((paginationErr) => {
            reject(paginationErr)
          })
      }
    })
  })
}

// Function to fetch posts by tag id with help of pagination
// Helper function to calculate pagination
const PaginationHelper = (tid, limit) => {
  const qTotal = `SELECT COUNT(*) AS total FROM posts
                  LEFT JOIN posttags ON posts.id = posttags.pid
                  WHERE posttags.tid = ?`

  return new Promise((resolve, reject) => {
    db.query(qTotal, [tid], (err, totalData) => {
      if (err) {
        console.error('Error executing total count query:', err)
        reject(err)
      } else {
        const totalPosts = totalData[0].total
        const totalPages = Math.ceil(totalPosts / limit)
        resolve({ totalPosts, totalPages })
      }
    })
  })
}

export const getPostsByTagId = (tid, limit, offset) => {
  const queryParams = [tid, limit, offset]
  const q = `SELECT posts.* FROM posts
              LEFT JOIN posttags ON posts.id = posttags.pid
              LEFT JOIN users ON posts.uid = users.id
              WHERE posttags.tid = ?
              ORDER BY posts.date DESC
              LIMIT ? OFFSET ?`

  return new Promise((resolve, reject) => {
    db.query(q, queryParams, (err, data) => {
      if (err) {
        console.error('Error executing query:', err)
        reject(err)
      } else {
        PaginationHelper(tid, limit)
          .then(({ totalPosts, totalPages }) => {
            const result = {
              data: data.length > 0 ? data : [],
              total: totalPosts,
              totalPages
            }
            resolve(result)
          })
          .catch((paginationErr) => {
            reject(paginationErr)
          })
      }
    })
  })
}

export const getOwnPosts = (userId, page, desiredPageSize) => {
  const MAX_PAGE_SIZE = 4 // Limit the maximum page size
  const pageSize = Math.min(desiredPageSize, MAX_PAGE_SIZE) // Limit the page size to 3
  const skip = (page - 1) * pageSize

  return new Promise((resolve, reject) => {
    const q = 'SELECT p.*, u.id AS userId, username FROM posts AS p JOIN users AS u ON (u.id = p.uid) WHERE u.id = ?' +
      ' ORDER BY p.date DESC LIMIT ?, ?'

    // Query to count the total number of posts for the user
    const countQuery = 'SELECT COUNT(*) as totalPages FROM posts AS p JOIN users AS u ON (u.id = p.uid) WHERE u.id = ?'

    db.query(q, [userId, skip, pageSize], (err, data) => {
      if (err) {
        reject(err)
      } else {
        // Execute the count query to get the total count
        db.query(countQuery, [userId], (countErr, countData) => {
          if (countErr) {
            reject(countErr)
          } else {
            const totalPages = Math.ceil(countData[0].totalPages / pageSize)
            resolve({ posts: data, totalPages })
          }
        })
      }
    })
  })
}

export const getFollowerPosts = (userId, page, desiredPageSize) => {
  const MAX_PAGE_SIZE = 4 // Limit the maximum page size
  const pageSize = Math.min(desiredPageSize, MAX_PAGE_SIZE) // Ensure the page size does not exceed the limit
  const skip = (page - 1) * pageSize // Calculate offset for pagination

  return new Promise((resolve, reject) => {
    // Adjusted query to include pagination
    const q = `
      SELECT
        p.*,
        u.id AS userId,
        username
      FROM
        posts AS p
      JOIN
        users AS u ON (u.id = p.uid)
      JOIN
        relationships AS r ON (p.uid = r.followedUserId AND r.followerUserId = ?)
      ORDER BY
        u.username ASC, p.date DESC
      LIMIT ?, ?`

    // Query to count the total number of posts a user's followers have made
    const countQuery = `
      SELECT
        COUNT(*) AS totalPosts
      FROM
        posts AS p
      JOIN
        relationships AS r ON (p.uid = r.followedUserId AND r.followerUserId = ?)`

    db.query(q, [userId, skip, pageSize], (err, data) => {
      if (err) {
        reject(err)
      } else {
        // Execute the count query to get the total count of posts
        db.query(countQuery, [userId], (countErr, countData) => {
          if (countErr) {
            reject(countErr)
          } else {
            const totalPosts = countData[0].totalPosts
            const totalPages = Math.ceil(totalPosts / pageSize) // Calculate total pages
            resolve({ posts: data, totalPages })
          }
        })
      }
    })
  })
}

// add theme to post
const addTagsToPost = (pid, selectedThemes) => {
  return new Promise((resolve, reject) => {
    const qTag = 'INSERT INTO posttags(`pid`, `tid`) SELECT ? AS `pid`, tagId FROM tags WHERE name IN (?)'
    db.query(qTag, [pid, selectedThemes], (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve('Tags have been added to the post.')
      }
    })
  })
}

export const addPost = (title, desc, img, thumbnail, cat, date, userId, selectedThemes) => {
  return new Promise((resolve, reject) => {
    const q = 'INSERT INTO posts(`title`, `desc`, `img`,`thumbnail`, `cat`, `date`, `uid`) VALUES (?, ?, ?, ?, ?, ?, ?)'
    const values = [title, desc, img, thumbnail, cat, date, userId]

    db.query(q, values, async (err, data) => {
      if (err) {
        reject(err)
      } else {
        const pid = data.insertId
        try {
          await addTagsToPost(pid, selectedThemes)
          resolve(pid) // Resolve with post ID
        } catch (error) {
          reject(new Error('Error adding tags to post or sending emails to subscribers'))
        }
      }
    })
  })
}

export const deletePost = (postId, userId) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?'

    db.query(q, [postId, userId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('Post has been deleted.')
      }
    })
  })
}

// Step 1: Update the post
// Step 2: Remove existing theme associations
// Step 3: Add new theme associations

export const updatePost = (title, desc, img, thumbnail, cat, postId, userId, selectedThemes) => {
  return new Promise((resolve, reject) => {
    let q = 'UPDATE posts SET title = ?, `desc` = ?, cat = ?'
    const values = [title, desc, cat]

    if (img) {
      q += ', img = ?'
      values.push(img)
    }

    // Add thumbnail column update
    if (thumbnail) {
      q += ', thumbnail = ?'
      values.push(thumbnail)
    }

    q += ' WHERE id = ? AND uid = ?'
    values.push(postId, userId)

    db.query(q, values, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      // Proceed to update posttags 
      // 2. Remove existing theme associations
      const clearTagsQuery = 'DELETE FROM posttags WHERE pid = ?'
      db.query(clearTagsQuery, [postId], (clearErr) => {
        if (clearErr) {
          reject(clearErr)
          return
        }

        // Handling tag insertion
        Promise.all(selectedThemes.map(themeName =>
          tag.getTagIdByThemeName(themeName).then(tid => {
            if (!tid) return Promise.resolve() // Skip if tid is not found

            const insertTagQuery = 'INSERT INTO posttags(pid, tid) VALUES (?, ?)'
            return new Promise((resolve, reject) => {
              db.query(insertTagQuery, [postId, tid], (tagErr) => {
                if (tagErr) reject(tagErr)
                else resolve()
              })
            })
          })
        ))
          .then(() => resolve('Post and post-tag associations have been updated.'))
          .catch(tagErr => reject(tagErr))
      })
    })
  })
}

export const post = {
  getPost,
  getPosts,
  getOwnPosts,
  getFollowerPosts,
  addPost,
  deletePost,
  updatePost,
  getPostsByTagId

}
