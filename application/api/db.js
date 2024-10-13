import mysql from 'mysql2'
import sinon from 'sinon'
import dotenv from 'dotenv'

dotenv.config()

const dbHost = process.env.DATABASE_HOST
const dbUser = process.env.DATABASE_USER
const dbPass = process.env.DATABASE_PASS
const dbSchema = process.env.DATABASE_SCHEMA

let db

if (process.env.NODE_ENV === 'test') {
  // Mock the database connection for tests
  db = {
    query: sinon.stub()
  }
} else {
  // Create a real database connection for production
  db = mysql.createPool({
    connectionLimit: 20,
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbSchema,
    insecureAuth: true
  })
}

export { db }
