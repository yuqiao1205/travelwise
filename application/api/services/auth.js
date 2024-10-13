import { db } from '../db.js'
import bcrypt from 'bcryptjs'

export const checkExistingUser = (email, username) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT * FROM users WHERE email = ? OR username = ?'
    db.query(q, [email, username], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const createUser = (username, email, password, nickname) => {
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const q = 'INSERT INTO users(`username`,`email`,`password`,`nickname`) VALUES (?)'
    const values = [username, email, hash, nickname]

    db.query(q, [values], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve('User has been created.')
      }
    })
  })
}

export const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const q = 'SELECT * FROM users WHERE username = ?'
    db.query(q, [username], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

export const authService = {
  checkExistingUser,
  createUser,
  findUserByUsername,
  comparePassword
}
