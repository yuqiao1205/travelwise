import { db } from '../db.js'
import { userModel } from '../models/user.js'

export const getUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE `id` = ?'
    db.query(sql, [userId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.length === 0 ? null : userModel.User.fromObject(data[0]))
      }
    })
  })
}

export const updateUser = async (userId, city, img, email, nickname, fullname, interest) => {
  // Start with the base SQL query without the img field
  let sql = 'UPDATE users SET `city` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?'
  let params = [city, email, nickname, fullname, interest, userId]

  // If img parameter is provided (not null or undefined), include it in the SQL query and parameters
  if (img !== null && img !== undefined) {
    sql = 'UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?'
    params = [city, img, email, nickname, fullname, interest, userId]
  }

  // Execute the query and return the result
  const data = await new Promise((resolve, reject) => {
    db.query(sql, params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.affectedRows > 0)
      }
    })
  })

  return data
}

// export const updateUser = async (userId, city, img, email, nickname, fullname, interest) => {
//   // Define the SQL query for updating the user's profile without changing the password
//   const sql = 'UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `fullname` = ?, `interest` = ? WHERE `id` = ?'

//   // Execute the query and return the result
//   const data = await new Promise((resolve, reject) => {
//     db.query(sql, [city, img, email, nickname, fullname, interest, userId], (err, data) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(data.affectedRows > 0)
//       }
//     })
//   })

//   return data
// }

// export const updateUser = async (userId, city, img, email, nickname, newPassword) => {
//   let sql, data

//   if (newPassword && newPassword !== '') {
//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10)

//     sql =
//       'UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `password` = ? WHERE `id` = ?'

//     data = await new Promise((resolve, reject) => {
//       db.query(sql, [city, img, email, nickname, hashedPassword, userId], (err, data) => {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(data.affectedRows > 0)
//         }
//       })
//     })
//   } else {
//     // If no new password is provided, update the user's profile without changing the password
//     sql =
//       'UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ? WHERE `id` = ?'

//     data = await new Promise((resolve, reject) => {
//       db.query(sql, [city, img, email, nickname, userId], (err, data) => {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(data.affectedRows > 0)
//         }
//       })
//     })
//   }

//   return data
// }

// export const updateUser = async (userId, city, img, email, nickname, newPassword) => {
//   // Hash the new password
//   const hashedPassword = await bcrypt.hash(newPassword, 10)

//   const sql =
//     'UPDATE users SET `city` = ?, `img` = ?, `email` = ?, `nickname` = ?, `password` = ? WHERE `id` = ?'

//   const data = await new Promise((resolve, reject) => {
//     db.query(sql, [city, img, email, nickname, hashedPassword, userId], (err, data) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(data.affectedRows > 0)
//       }
//     })
//   })

//   return data
// }

export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM users WHERE `id` = ?'
    db.query(q, [userId], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.affectedRows > 0)
      }
    })
  })
}
export const users = { getUser, updateUser, deleteUser }
