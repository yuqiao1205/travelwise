import { db } from '../db.js'

const isAlreadySubscribed = async (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM subscriptions WHERE email = ?'
    db.query(sql, [email], (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results.length > 0)
      }
    })
  })
}

// Function to save a new subscription to the database
export const saveSubscription = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO subscriptions (email) VALUES (?)'
    const values = [email]
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

export const removeSubscriber = (email) => {
  return new Promise((resolve, reject) => {
    const q = 'DELETE FROM subscriptions WHERE email = ?'
    const values = [email]
    db.query(q, values, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results.affectedRows)
      }
    })
  })
}

// Function to remove a subscriber from the database
// const removeSubscriber = (email) => {
//   return new Promise((resolve, reject) => {
//       db.query('DELETE FROM subscriptions WHERE email = ?', [email], (err, result) => {
//           if (err) {
//               reject(err);
//           } else {
//               resolve(result.affectedRows);
//           }
//       });
//   });
// };

// Function to fetch all subscribers from the database
const getAllSubscribersEmail = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT email FROM subscriptions'
    db.query(sql, (error, results) => {
      if (error) {
        reject(error)
      } else {
        const subscribers = results.map((result) => result.email)
        resolve(subscribers)
      }
    })
  })
}

export const subscription = {
  isAlreadySubscribed,
  saveSubscription,
  removeSubscriber,
  getAllSubscribersEmail
}
