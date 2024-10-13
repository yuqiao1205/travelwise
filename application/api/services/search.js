import { db } from '../db.js'

export const getSearch = (searchTerm, filter, page, limit) => {
  const offset = (page - 1) * limit
  const filterAll = (filter === undefined) || (filter === '')
  console.log('filter_all:', filterAll)

  let q = ''

  if (filterAll) {
    q = `
      SELECT SQL_CALC_FOUND_ROWS posts.*, users.username 
      FROM posts 
      JOIN users ON posts.uid = users.id 
      WHERE posts.title LIKE ? 
      OR posts.desc LIKE ? 
      OR users.username LIKE ? 
      OR posts.cat LIKE ?
      ORDER BY posts.date DESC
      LIMIT ? OFFSET ?
    `
  } else if (filter === 'username') {
    // validate filter in 'username' only because it's needed for the JOIN
    q = `
    SELECT SQL_CALC_FOUND_ROWS posts.*, users.username 
    FROM posts 
    JOIN users ON posts.uid = users.id 
    WHERE users.username LIKE ? 
    ORDER BY posts.date DESC
    LIMIT ? OFFSET ?
  `
  } else {
    // validate filter in 'cat', 'title'
    if ((filter !== 'cat') && (filter !== 'title')) {
      filter = 'title'
    }

    q = `
      SELECT SQL_CALC_FOUND_ROWS posts.*, users.username 
      FROM posts 
      JOIN users ON posts.uid = users.id 
      WHERE posts.${filter} LIKE ? 
      ORDER BY posts.date DESC
      LIMIT ? OFFSET ?
    `
  }

  console.log('q:', q)
  const formattedTerm = `%${searchTerm}%`
  const vars = filterAll ? [formattedTerm, formattedTerm, formattedTerm, formattedTerm, limit, offset] : [formattedTerm, limit, offset]
  console.log('vars:', vars)

  return new Promise((resolve, reject) => {
    db.query(
      q,
      vars,
      (err, data) => {
        if (err) {
          return reject(err) // Immediately reject the promise if an error occurs
        }

        // Query to get the total count of matched results, only if the first query succeeds
        db.query('SELECT FOUND_ROWS() AS total', (err, totalData) => {
          if (err) {
            return reject(err) // Immediately reject the promise if an error occurs
          }

          const totalPosts = totalData[0].total
          const totalPages = Math.ceil(totalPosts / limit)

          resolve({
            data,
            total: totalPosts,
            totalPages
          })
        })
      }
    )
  })
}

export const search = {
  getSearch
}
